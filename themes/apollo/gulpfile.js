var gulp = require('gulp');
var compass    = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var   plumber    = require('gulp-plumber');
// 一次性编译 Sass
gulp.task('compass', function() {
  gulp.src('./source/scss/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: './config.rb',
       css: 'source/css',
       sass: 'source/scss/'
    }));
});

// 实时编译
gulp.task('default', ['compass'], function() {
    gulp.watch('./source/scss/_partial/*.scss', ['compass']);
    gulp.watch('./source/scss/*.scss', ['compass']);
});
