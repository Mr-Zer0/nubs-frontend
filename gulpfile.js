'use strict';

// Using gulp packages
var gulp      = require('gulp'),
  sass        = require('gulp-sass'),
  minifyCss   = require('gulp-minify-css'),
  minifyJs    = require('gulp-uglify'),
  minifyHtml  = require('gulp-minify-html'),
  autoprefixer = require('gulp-autoprefixer'),
  concat      = require('gulp-concat'),
  runSquence  = require('run-sequence'),
  source      = require('vinyl-source-stream'),
  watchify    = require('watchify'),
  browserify  = require('browserify'),
  reactify    = require('reactify'),
  clean       = require('gulp-clean'),
  wiredep     = require('wiredep').stream;

// Paths for src directory
var src = {
  ROOT    : 'src/',
  STYLE   : 'src/style/',
  SCRIPT  : 'src/script/',
  REACT   : 'src/script/app/'
};

// Paths for dest directory
var dest = {
  ROOT    : 'app/',
  STYLE   : 'app/style/',
  SCRIPT  : 'app/script',
  REACT   : 'app/script/app/'
};

// Styles and script are automatic link in html
gulp.task('bower', function () {
  gulp.src(src.ROOT + 'index.html')
      .pipe(wiredep())
      .pipe(gulp.dest(dest.ROOT));
});

gulp.task('wash', function () {
    gulp.src(dest.SCRIPT)
        .pipe(clean());
});

// Minify html files
gulp.task('html', function () {
  var minifyOpt = {
    conditionals: true,
    empty: true,
    comments: true
  };
  
  gulp.src(src.ROOT + '*.html')
      .pipe(minifyHtml(minifyOpt))
      .pipe(gulp.dest(dest.ROOT));
});

// Transforming reactjs
gulp.task('watch', function () {
  gulp.watch(src.SCRIPT + 'Nubs.js', ['wash']);
  gulp.watch(src.ROOT + '*.html', ['html']);
  gulp.watch(src.STYLE + '*.scss', ['style']);

  var watcher = watchify(browserify({
    entries   : ['./src/script/Nubs.js'],
    transform : [reactify],
    debug     : true,
    fullPaths : true,
    cache     : {},
    packageCache : {}
  }));

  return watcher.on('update', function () {
    watcher.bundle()
          .pipe(source('nubs.js'))
          .pipe(gulp.dest(dest.REACT));
  
    console.log('Updated!');
  })
    .bundle()
    .pipe(source('nubs.js'))
    .pipe(gulp.dest(dest.REACT));
  
});

// Compile scss, concatenate styles and make style for last 2 verson of browser
gulp.task('style', function () {
  gulp.src(src.STYLE + '*.scss')
      .pipe(sass())
      .pipe(autoprefixer('last 2 version'))
      .pipe(concat('style.min.css'))
      .pipe(minifyCss())
      .pipe(gulp.dest(dest.STYLE));
});

gulp.task('build', function () {
  runSquence('wash', 'html', 'bower', 'watch', 'style');
});

gulp.task('default', ['watch']);
