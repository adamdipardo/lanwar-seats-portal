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
var RevAll = require('gulp-rev-all');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var awspublish = require('gulp-awspublish');
var cloudfront = require("gulp-cloudfront");
var env = require('gulp-env');

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
		debug: (argv.env != 'production' && argv.env != 'dev')
		})
		.external(dependencies);

	if (argv.env == 'production' || argv.env == 'dev')
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
		debug: (argv.env != 'production' && argv.env != 'dev')
		})
		.require(dependencies);
	
	if (argv.env == 'production' || argv.env == 'dev')
	{
		env({
			vars: {
				NODE_ENV: 'production'
			}
		});
		
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
	if (argv.env == 'local')
	{
		gulp.src('build')
			.pipe(webserver({
			  livereload: true,
			  directoryListing: false,
			  host: '0.0.0.0',
			  fallback: 'index.html',
			  proxies: [{source: '/api', target:'http://l.dev.api.lanwar.ca'},{source: '/reservations', target:'http://127.0.0.1:3000'}]
			}));
	}
	else
	{
		gulp.src('build')
			.pipe(webserver({
			  livereload: true,
			  directoryListing: false,
			  host: '0.0.0.0',
			  fallback: 'index.html',
			  proxies: [{source: '/api', target:'http://lanwar-dev.herokuapp.com'},{source: '/reservations', /*target:'http://127.0.0.1:3000'*/target:'https://dev-tickets.lanwarx.ca/reservations'}]
			}));
	}
});

gulp.task('html', function () {    
	return gulp.src('*.html')
		.pipe(gulp.dest('build'));
});

gulp.task('images', function () {    
	return gulp.src('./img/*.{png,jpg,gif,ico,svg}')
		.pipe(gulp.dest('build/img'));
});

gulp.task('images:watch', function () {
	gulp.watch('./img/*.{png,jpg,gif,ico,svg}', ['images']);
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

gulp.task('scripts', function () {    
	return gulp.src('./js/vendor/*.js')
		.pipe(gulp.dest('build/js'));
});

gulp.task('scripts:watch', function () {
	gulp.watch('./js/vendor/*.js', ['scripts']);
});

gulp.task('config', function(cb) {

	var socketURL;
	if (argv.env == 'production') {
		socketURL = 'https://tickets.lanwarx.ca/';
		stripePK = 'pk_live_kaAxoRRHGCWyhBch0VqOjQvc';
		ticketIds = '{byoc:1,smash:2,spectator:3,melee:4}';
	}
	else if (argv.env == 'dev') {
		socketURL = 'https://dev-tickets.lanwarx.ca/';
		stripePK = 'pk_test_wLwLaMViOVhUcRGOIBWmj3N1';
		ticketIds = '{byoc:1,smash:11,spectator:21,melee:31}';
	}
	else {
		socketURL = 'http://127.0.0.1:8000/';
		stripePK = 'pk_test_wLwLaMViOVhUcRGOIBWmj3N1';
		ticketIds = '{byoc:1,smash:11,spectator:21,melee:31}';
	}

	fs.writeFile('./js/LanwarConfig.js', 'var LanwarConfig = {socketURL: "'+socketURL+'", stripePK: "'+stripePK+'", ticketIds: '+ticketIds+'}; module.exports = LanwarConfig;', cb);

});

gulp.task('clean:dist', function() {
	return gulp.src('dist', {read: false})
    	.pipe(clean());
});

gulp.task('hash', ['clean:dist'], function() {

	var revAll = new RevAll({
		dontRenameFile: ['index.html']
	});
	return gulp.src('build/**')
    	.pipe(revAll.revision())
    	.pipe(gulp.dest('dist'));

});

gulp.task('min-css', ['hash'], function() {
	return gulp.src('dist/css/*.css')
    	.pipe(minifyCss({compatibility: 'ie8'}))
    	.pipe(gulp.dest('dist/css'));
});

// 
gulp.task('default', ['config', 'webserver', 'app', 'vendor', 'html', 'sass', 'sass:watch', 'images', 'images:watch', 'scripts', 'scripts:watch', 'watch']);
gulp.task('build', ['config', 'webserver', 'app', 'vendor', 'html', 'images', 'sass', 'scripts']);
gulp.task('build-only', ['config', 'app', 'vendor', 'html', 'sass', 'images', 'scripts']);
gulp.task('create-dist', ['min-css']);
