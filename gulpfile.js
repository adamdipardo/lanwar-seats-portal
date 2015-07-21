// 'use strict';
var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var fs = require('fs');

var libs = [
  'react',
  'fluxxor',
  'classnames',
  'react-bootstrap',
  'react-router',
  'react-select',
  'react-tooltip',
  'socket.io-client',
  'underscore'
];

var packageJson = require('./package.json');
var dependencies = Object.keys(packageJson && packageJson.dependencies || {});

gulp.task('app', function() {

	var bundler = browserify({
		entries: ['./js/app.js'],
		transform: [reactify],
		debug: argv.env != 'production'
		})
		.external(dependencies);

	if (argv.env == 'production')
	{
		return bundler.bundle()
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./build'));
	}
	else
	{
		return bundler.bundle()
			.pipe(source('app.js'))
			.pipe(gulp.dest('./build'));
	}

});

gulp.task('vendor', function() {

	var bundler = browserify({
		debug: argv.env != 'production'
		})
		.require(dependencies);
	
	if (argv.env == 'production')
	{
		return bundler.bundle()
			.pipe(source('vendor.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./build'));
	}
	else
	{
		return bundler.bundle()
			.pipe(source('vendor.js'))
			.pipe(gulp.dest('./build'));
	}

});

gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      proxies: [{source: '/api', target:'http://l.dev.api.lanwar.ca'},{source: '/reservations', target:'http://127.0.0.1:3000'}]
    }));
});

gulp.task('html', function () {    
	return gulp.src('*.html')
		.pipe(gulp.dest('build'));
});

gulp.task('sass', function () {
	gulp.src('./css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('sass:watch', function () {
	gulp.watch('./css/**/*.scss', ['sass']);
});

gulp.task('watch', function() {
	gulp.watch('./js/**', ['app']);
	gulp.watch('./package.json', ['vendor']);
});

gulp.task('config', function(cb) {

	var socketURL = argv.env == 'production' ? 'http://dev.tickets.lanwarx.ca/reservations/' : 'http://127.0.0.1:8000/reservations';

	fs.writeFile('./js/LanwarConfig.js', 'var LanwarConfig = {socketURL: "'+socketURL+'"}; module.exports = LanwarConfig;', cb);

});

// 
gulp.task('default', ['config', 'webserver', 'app', 'vendor', 'html', 'sass', 'sass:watch', 'watch']);
gulp.task('build', ['config', 'webserver', 'app', 'vendor', 'html', 'sass']);
gulp.task('build-only', ['config', 'app', 'vendor', 'html', 'sass']);
