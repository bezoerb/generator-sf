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
//
// // Compile and automatically prefix stylesheets
// gulp.task('styles:dev', () =>
//     // For best performance, don't add Sass partials to `gulp.src`
//     gulp.src(prefixDev('styles/main.scss'))
//         .pipe($.newer('.tmp/styles'))
//         .pipe($.sass({
//             precision: 10,
//             includePaths: ['bower_components']
//         }).on('error', $.sass.logError))
//         .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
//         .pipe(gulp.dest('.tmp/styles'))
// );
//
// gulp.task('styles', () =>
//     // For best performance, don't add Sass partials to `gulp.src`
//     gulp.src(prefixDev('styles/main.scss'))
//         .pipe($.newer('.tmp/styles'))
//         .pipe($.sourcemaps.init())
//         .pipe($.sass({
//             precision: 10,
//             includePaths: ['bower_components']
//         }).on('error', $.sass.logError))
//         .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
//         .pipe(gulp.dest('.tmp/styles'))
//         // Concatenate and minify styles
//         .pipe($.if('*.css', $.minifyCss()))
//         .pipe($.size({title: 'styles'}))
//         .pipe($.sourcemaps.write('./'))
//         .pipe(gulp.dest(prefixDist('styles')[0]))
// );

gulp.task('styles', () =>
    gulp.src(prefixDev('styles/main.css'))
        .pipe($.postcss([
            require('postcss-import')(),
            require('postcss-url')(),
            require('postcss-cssnext')({
                browser: AUTOPREFIXER_BROWSERS
            })
            // add your "plugins" here
            // ...
            // and if you want to compress
            // require("cssnano")(),
        ]))
        .pipe(gulp.dest(prefixDist('styles')[0]))
);
