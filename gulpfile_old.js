var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify'); 
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var sass = require('gulp-sass');
var gStreamify = require('gulp-streamify')
  ,uglify = require('gulp-uglify');
 
gulp.task('browserify', function() {
    var bundler = browserify({
        entries: ['./js/app.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        external: false,
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('bundle.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./build/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      // open: true,
      proxies: [{source: '/api', target:'http://l.dev.api.lanwar.ca'},{source: '/reservations', target:'http://127.0.0.1:3000'}]
    }));
});

gulp.task('html', function () {
    // gulp.watch('./*.html', function () {
        return gulp.src('*.html')
            .pipe(gulp.dest('build'));
    // });
});

gulp.task('sass', function () {
  gulp.src('./css/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./css/**/*.scss', ['sass']);
});

gulp.task('compress', function() {
    return gulp.src('./build/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('browserify:production', function () {
    var b = browserify({
        entries: ['./js/app.js'], // Only need initial file, browserify finds the deps
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: false, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: false // Requirement of watchify
    });
    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(gStreamify(uglify()))
        .pipe(gulp.dest('./dist'));
});

// Just running the two tasks
gulp.task('default', ['webserver', 'browserify', 'html', 'sass', 'sass:watch']);