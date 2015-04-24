'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    runSquence = require('run-sequence'),
    wiredep = require('wiredep').stream;

var SRC = 'src/';
var SRC_STYLE = SRC + 'style/';

var APP = 'app/';
var APP_STYLE = APP + 'style/';

gulp.task('bower', function () {
  gulp.src(SRC + 'index.html')
      .pipe(wiredep())
      .pipe(gulp.dest(APP));
});

gulp.task('html', function () {
  gulp.src(SRC + '*.html')
      .pipe(gulp.dest(APP));
});

// Compile scss, concatenate styles and make style for last 2 verson of browser
gulp.task('style', function () {
  gulp.src(SRC_STYLE + '*.scss')
      .pipe(sass())
      .pipe(autoprefixer('last 2 version'))
      .pipe(concat('style.min.css'))
      .pipe(minifyCss())
      .pipe(gulp.dest(APP_STYLE));
});

gulp.task('watch', function () {
  gulp.watch(SRC + '*.html', ['html']);
  gulp.watch(SRC_STYLE + '*.scss', ['style']);

  console.log('Watching!...');
});

gulp.task('build', function () {
  runSquence('html', 'bower', 'style');
});

gulp.task('default', ['build']);
