const gulp = require('gulp');
const {dist, src} = require('./helper/dir');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

const copy = () =>
    gulp.src(src('**/*.{ico,txt,web,json,webapp,xml}'), {dot: true})
        .pipe(gulp.dest(dist()))
        .pipe($.size({title: 'copy'}));

module.exports = {
    copy
};
