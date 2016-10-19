import path from 'path';
import gulp from 'gulp';
import {prefixDev,prefixDist} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Compile and automatically prefix stylesheets
export const stylesDev = () =>
    // For best performance, don't add Sass partials to `gulp.src`
    gulp.src(prefixDev('styles/main.scss'))
        .pipe($.newer('.tmp/styles'))
        .pipe($.sass({
            precision: 10,
            includePaths: ['node_modules']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'));

export const stylesDist = () =>
    // For best performance, don't add Sass partials to `gulp.src`
    gulp.src(prefixDev('styles/main.scss'))
        .pipe($.newer('.tmp/styles'))
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            precision: 10,
            includePaths: ['node_modules']
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.minifyCss()))
        .pipe($.size({title: 'styles'}))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(prefixDist('styles')[0]));
