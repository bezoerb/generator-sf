const gulp = require('gulp');
const path = require('path');
const {Server} = require('karma');
const browserSync = require('browser-sync');
const {src} = require('./helper/dir');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

const lint = () =>
    gulp.src(src('scripts/**/*.js'<% if (props.loader === 'jspm') { %>, '!scripts/config.js'<% } %>))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failOnError()));

const karma = (cb) => {
    new Server({
        configFile: path.join(__dirname, '../tests/Frontend/karma.conf.js'),
        singleRun: true
    }, cb).start();
};

const phpunit = () =>
    gulp.src('app/phpunit.xml.dist')
        .pipe($.phpunit('bin/phpunit', {
            configurationFile: 'app/phpunit.xml.dist',
            colors: false
        }));

module.exports = {
    lint,
    karma,
    phpunit
};