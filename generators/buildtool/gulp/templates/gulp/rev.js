import gulp from 'gulp';
import {dist, tmp, config} from './helper/dir';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export const rev = () =>
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

export const revManifest = () => {
    const manifest = gulp.src(config('rev-manifest.json'));

    return gulp.src(dist(
        'styles/*.css',
        'scripts/*.js'
    ), {base: dist()})
        .pipe($.revReplace({manifest: manifest, replaceInExtensions: ['.js', '.css']}))
        .pipe(gulp.dest(dist()));
};
