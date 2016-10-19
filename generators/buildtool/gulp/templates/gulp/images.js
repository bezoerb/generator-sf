import gulp from 'gulp';
import {prefixDev,prefixDist} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();


// Optimize images
export const images = () =>
    gulp.src(prefixDev('img/**/*.{png,jpg,gif,svg}'))
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
        .pipe(gulp.dest(prefixDist('img')))
        .pipe($.size({title: 'images'}));
