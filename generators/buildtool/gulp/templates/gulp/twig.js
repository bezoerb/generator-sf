const gulp = require('gulp');
const {basename} = require('path');
const {tmp, views, dist} = require('./helper/dir');
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

export const twig = () =>
    gulp.src(views('../views/controller/**/*.twig'))
        .pipe($.newer(tmp('html')))
        .pipe($.twig({
            base: views(),
            functions: [{name: 'asset', func: args => args}],
            namespaces: {web: dist('/')},
            data: {
                // You could add 'mock' template variables here
                // if they are required to render an appropriate
                // html structure for uncss/critical
            }
        }))
        .pipe($.rename(path => {
            path.basename = basename(path.basename, '.html');
        }))
        .pipe(gulp.dest(tmp('html')))
        .pipe($.size({title: 'twig'}));

module.exports = {
    twig
};