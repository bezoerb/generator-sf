const gulp = require('gulp');
const {stream} = require('critical');
const {tmp, dist} = require('./helper/dir');

const critical = () =>
    gulp.src(tmp('html/**/*.html'), {base: tmp('html')})
        .pipe(stream({base: tmp('html'), destFolder: dist(), minify: true, inline: false, css: [tmp('styles/main.css')]}))
        .pipe(gulp.dest(dist('styles/critical')));

module.exports = {
    critical
};