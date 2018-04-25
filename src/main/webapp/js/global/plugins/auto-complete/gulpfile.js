var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean');

gulp.task('default', ["clean"], function () {
    gulp.start("jsmin", "cssmin", "copyImg");
});

gulp.task("clean", function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('jsmin', function () {
    gulp.src(['auto-complete.js', 'i18n/*.js'], {base: '.'})
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('cssmin', function () {
    gulp.src('auto-complete.css')
        .pipe(minifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('copyImg', function () {
    gulp.src('image/*')
        .pipe(gulp.dest('dist/image/'));
});
