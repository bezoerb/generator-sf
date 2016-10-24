import path from 'path';
import gulp from 'gulp';
import {prefixDev, prefixDist} from './helper/utils';
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
export const stylesDev = stream => () =>
    // For best performance, don't add Sass partials to `gulp.src`
    gulp.src(prefixDev('styles/main.<% if (props.preprocessor === 'sass') { %>scss<% } else if (props.preprocessor === 'less') { %>less<% } else if (props.preprocessor === 'stylus') { %>styl<% } else { %>css<% } %>'))
        .pipe($.newer('.tmp/styles'))
        <% if (props.preprocessor === 'sass') { %>.pipe($.sass({
            precision: 10,
            includePaths: ['node_modules']
        }).on('error', $.sass.logError))<% } else if (props.preprocessor === 'less') { %>.pipe($.less({
            paths: ['node_modules']
        }))
        <% } else if (props.preprocessor === 'stylus') { %>
        <% } else {%>.pipe($.minifyCss())
        <% } %>.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles'}))
        .pipe(stream());

export const stylesProd = () => () =>
    // For best performance, don't add Sass partials to `gulp.src`
    gulp.src(prefixDev('styles/main.<% if (props.preprocessor === 'sass') { %>scss<% } else if (props.preprocessor === 'less') { %>less<% } else if (props.preprocessor === 'stylus') { %>styl<% } else { %>css<% } %>', 'styles/**/*.css'))
        .pipe($.newer('.tmp/styles'))
        .pipe($.sourcemaps.init())
        <% if (props.preprocessor === 'sass') { %>.pipe($.sass({
            precision: 10,
            includePaths: ['node_modules']
        }).on('error', $.sass.logError))<% } else if (props.preprocessor === 'less') { %>.pipe($.less({
            paths: ['node_modules']
        }))
        <% } else if (props.preprocessor === 'stylus') { %>
        <% } %>.pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(gulp.dest('.tmp/styles'))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.minifyCss()))
        .pipe($.size({title: 'styles'}))
        .pipe($.sourcemaps.write('./'))
        .pipe($.size({title: 'styles'}))
        .pipe(gulp.dest('.tmp/styles'));
