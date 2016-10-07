import path from 'path';
import gulp from 'gulp';
import {paths} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();


// Optimize images
gulp.task('images', () =>
    gulp.src(path.join(paths.app, 'img/**/*.{png,jpg,gif,svg}'))
        .pipe($.if('*.{png,jpg,gif}', $.cache($.imagemin({
            progressive: true,
            interlaced: true
        }))))
        .pipe($.if('*.svg', $.cache($.svgmin({
            plugins: [
                {removeViewBox: false},
                {removeUselessStrokeAndFill: false}
            ],
            js2svg: {pretty: true}
        }))))
        .pipe(gulp.dest(path.join(paths.dist, 'img')))
        .pipe($.size({title: 'images'}))
);
