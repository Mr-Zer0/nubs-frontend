'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    minifyJs = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    react = require('gulp-react'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    runSquence = require('run-sequence'),
    sourcemap = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    wiredep = require('wiredep').stream;

var SRC = 'src/';
var SRC_STYLE = SRC + 'style/';
var SRC_SCRIPT = SRC + 'script/';

var APP = 'app/';
var APP_STYLE = APP + 'style/';
var APP_SCRIPT = APP + 'script/';

gulp.task('bower', function () {
  gulp.src(SRC + 'index.html')
      .pipe(wiredep())
      .pipe(gulp.dest(APP));
});

gulp.task('html', function () {
  var minifyOpt = {
    conditionals: true,
    empty: true,
    comments: true
  }

  gulp.src(SRC + '*.html')
      .pipe(minifyHtml(minifyOpt))
      .pipe(gulp.dest(APP));
});

gulp.task('react', function () {
  gulp.src(APP_SCRIPT + 'app/**/*.js')
      .pipe(sourcemap.init())
      .pipe(react())
      .pipe(sourcemap.write('.'))
      .pipe(gulp.dest(APP_SCRIPT + 'app/'));
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
  gulp.watch(SRC_SCRIPT + 'app/**/*.js', ['react']);

  console.log('Watching!...');
});

gulp.task('build', function () {
  runSquence('html', 'bower', 'react', 'style');
});

gulp.task('default', ['build']);
