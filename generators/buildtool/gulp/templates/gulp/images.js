const gulp = require('gulp');
const {src, tmp} = require('./helper/dir');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

// Copy unoptimized images in dev mode
const imagecopy = () =>
    gulp.src(src('img/**/*', '!img/icons/**/*.svg'))
        .pipe(gulp.dest(tmp('img')))
        .pipe($.size({title: 'imageCopy'}));

// Optimize images
const imagemin = () =>
    gulp.src(src('img/**/*', '!img/icons/**/*.svg'))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(tmp('img')))
        .pipe($.size({title: 'imagemin'}));

// Generate SVG sprite
const svgstore = () =>
    gulp.src(src('img/icons/**/*.svg'))
        .pipe($.imagemin([$.imagemin.svgo({
            plugins: [
                {removeViewBox: false},
                {removeUselessStrokeAndFill: false},
                {cleanupIDs: false}
            ]
        })]))
        .pipe($.svgstore())
        .pipe(gulp.dest(tmp('img')))
        .pipe($.size({title: 'svgstore'}));

module.exports = {
    imageCopy,
    imagemin,
    svgstore
};