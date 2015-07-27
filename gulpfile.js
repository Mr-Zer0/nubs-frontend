var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    compass = require('gulp-compass'),
    copy = require('gulp-copy')
    watch = require('gulp-watch')
    gutil = require('gulp-util')
    inject = require('gulp-inject');

var src = {
  root: "src/",
  image: "src/image/",
  script: "src/script/",
  style: "src/style/"
};

var dev = {
  root: "dest.dev/",
  image: "dest.dev/assets/img/",
  script: "dest.dev/assets/js/",
  style: "dest.dev/asset/css/"
};

var prod = {

};

gulp.task('cleaner', function () {
  gulp.src([dev.style + '*.css', dev.root + '*.html'])
      .pipe(clean());
});

gulp.task('compasser', function () {
  gulp.src([src.style + '*.scss', src.style + '**/*.scss'])
      .pipe(compass({
        style: "expanded",
        css: dev.style,
        sass: src.style
      }))
      .pipe(prefixer({
        browsers: [
          '> 1%',
          'last 2 versions',
          'firefox >= 4',
          'safari 7',
          'safari 8',
          'IE 8',
          'IE 9',
          'IE 10'
        ],
        cascade: true
      }))
      .pipe(gulp.dest(dev.style))
      .on('error', gutil.log);
});

gulp.task('copier', function () {
  gulp.src(src.root + '*.html')
      .pipe(copy(dev.root, {prefix: 1}));
});

/* ===== Run ===== */
gulp.task('dev', ['cleaner', 'copier', 'compasser']);

gulp.task('watch', function () {
  gutil.log('Start watching ...');

  gulp.watch([src.style + '*.scss', src.style + '**/*.scss'], ['cleaner', 'compasser']);
});

gulp.task('prod', function () {

});
