const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const {tmp} = require('./helper/dir');
const $ = gulpLoadPlugins();

const uncss = () =>
    gulp.src(tmp('styles/**/*.css'))
        .pipe(gulp.dest(tmp('no-uncss')))
        .pipe($.sourcemaps.init())
        .pipe($.uncss({
            html: [tmp('html/**/*.html')],
            ignore: [
            /* ignore classes which are not present at dom load */<% if (props.view === 'bootstrap') { %>
            /\.fade/,
            /\.collapse/,
            /\.collapsing/,
            /\.modal/,
            /\.alert/,
            /\.open/,
            /\.in/<% } else if (props.view === 'foundation') { %>
            /meta\..+/,
            /\.move-/,
            /\.fixed/,
            /\.modal/,
                /open/<% } else if (props.view === 'uikit') { %>
            /\.uk-open/,
            /\.uk-notify/,
            /\.uk-nestable/,
            /\.uk-sortable/,
            /\.uk-active/<% } %>
            ]
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe($.size({title: 'uncss'}))
        .pipe(gulp.dest(tmp()));

module.exports = {
    uncss
};