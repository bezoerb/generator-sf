import gulp from 'gulp';
import path from 'path';
import {Server} from 'karma';
import browserSync from 'browser-sync';
import {prefixDev} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

export const lint = () =>
    gulp.src(prefixDev('scripts/**/*.js'<% if (props.loader === 'jspm') { %>, '!scripts/config.js'<% } %>))
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.if(!browserSync.active, $.eslint.failOnError()));

export const karma = (cb) => {
    new Server({
        configFile: path.join(__dirname, '../tests/Frontend/karma.conf.js'),
        singleRun: true
    }, cb).start();
};

export const phpunit = () =>
    gulp.src('app/phpunit.xml.dist')
        .pipe($.phpunit('bin/phpunit', {
            configurationFile: 'app/phpunit.xml.dist',
            colors: false
        }));
