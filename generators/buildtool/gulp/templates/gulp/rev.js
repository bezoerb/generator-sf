const gulp = require('gulp');
const {dist, tmp, config} = require('./helper/dir');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();

const rev = () =>
    gulp.src(tmp(
        'img/**/*.{jpg,jpeg,gif,png,webp,svg}',
        'styles/**/*.css',
        'scripts/**/*.js'
    ), {base: tmp()})
        .pipe($.rev())
        .pipe(gulp.dest(dist()))
        .pipe($.rev.manifest('rev-manifest.json'))
        .pipe(gulp.dest(config()))
        .pipe($.size({title: 'rev'}));

const revManifest = () => {
    const manifest = gulp.src(config('rev-manifest.json'));

    return gulp.src(dist(
        'styles/*.css',
        'scripts/*.js'
    ), {base: dist()})
        .pipe($.revReplace({manifest: manifest, replaceInExtensions: ['.js', '.css']}))
        .pipe(gulp.dest(dist()));
};

module.exports = {
    rev,
    revManifest
};