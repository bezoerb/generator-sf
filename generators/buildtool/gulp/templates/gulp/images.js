import gulp from 'gulp';
import {prefixDev} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

// copy unoptimized images in dev mode
export const imagecopy = () =>
    gulp.src(prefixDev('img/**/*', '!img/icons/**/*.svg'))
        .pipe(gulp.dest('.tmp/img'))
        .pipe($.size({title: 'imageCopy'}));

// Optimize images
export const imagemin = () =>
    gulp.src(prefixDev('img/**/*', '!img/icons/**/*.svg'))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest('.tmp/img'))
        .pipe($.size({title: 'imagemin'}));

export const svgstore = () =>
    gulp.src(prefixDev('img/icons/**/*.svg'))
        .pipe($.imagemin([$.imagemin.svgo({
            plugins: [
                {removeViewBox: false},
                {removeUselessStrokeAndFill: false},
                {cleanupIDs: false}
            ]
        })]))
        .pipe($.svgstore())
        .pipe(gulp.dest('.tmp/img'))
        .pipe($.size({title: 'svgstore'}));
