var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean');

gulp.task('default', ["clean"], function () {
    gulp.start("jsmin");
});

gulp.task("clean", function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('jsmin', function () {
    gulp.src(['inputType.js', 'i18n/*.js'], {base: '.'})
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

