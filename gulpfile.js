var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    compass = require('gulp-compass'),
    copy = require('gulp-copy'),
    watch = require('gulp-watch'),
    gutil = require('gulp-util'),
    inject = require('gulp-inject'),
    sequent = require('run-sequence');

var src = {
  root: "src/",
  image: "src/image/",
  script: "src/script/",
  style: "src/style/",
  font: 'src/font/'
};

var dev = {
  root: "dest.dev/",
  image: "dest.dev/assets/img/",
  script: "dest.dev/assets/js/",
  style: "dest.dev/asset/css/",
  font: 'dest.dev/asset/font/'
};

var prod = {

};

gulp.task('cleaner', function () {
  gulp.src([dev.style + '*.css', dev.root + '*.html'], {read: false})
      .pipe(clean({force: true}));
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

gulp.task('copy-html', function ()
{
   gulp.src(src.root + '*.html')
      .pipe(copy(dev.root, {prefix: 1}));
});

gulp.task('copy-font', function ()
{
  gulp.src(src.font + '*')
      .pipe(copy(dev.font, {prefix: 1}));
});

/* ===== Run ===== */
gulp.task('dev', function (callback) {
  sequent('cleaner', 'compasser', 'copy-html', 'copy-font', callback);
});

gulp.task('watch', function () {
  gutil.log('Start watching ...');

  gulp.watch([src.style + '*.scss', src.style + '**/*.scss', src.root + '*.html'], ['dev']);
});

gulp.task('prod', function () {

});
