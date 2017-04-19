import gulp from 'gulp';
import {src, tmp} from './helper/dir';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

// Copy unoptimized images in dev mode
export const imagecopy = () =>
    gulp.src(src('img/**/*', '!img/icons/**/*.svg'))
        .pipe(gulp.dest(tmp('img')))
        .pipe($.size({title: 'imageCopy'}));

// Optimize images
export const imagemin = () =>
    gulp.src(src('img/**/*', '!img/icons/**/*.svg'))
        .pipe($.cache($.imagemin()))
        .pipe(gulp.dest(tmp('img')))
        .pipe($.size({title: 'imagemin'}));

export const svgstore = () =>
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
