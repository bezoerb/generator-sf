import gulp from 'gulp';
import {paths, prefixDist} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export const rev = () =>
    gulp.src([
        '.tmp/img/**/*.{jpg,jpeg,gif,png,webp}',
        '.tmp/styles/*.css',
        '.tmp/scripts/*.js'
    ], {base: '.tmp'})
        .pipe($.rev())
        .pipe(gulp.dest(paths.dist))
        .pipe($.rev.manifest('filerev.json'))
        .pipe(gulp.dest('app/config'))
        .pipe($.size({title: 'rev'}));

export const revManifest = () => {
    var manifest = gulp.src('./app/config/filerev.json');

    return gulp.src(prefixDist(
        'styles/*.css',
        'scripts/*.js'
    ), {base: paths.dist})
     .pipe($.revReplace({manifest: manifest, replaceInExtensions: ['.js', '.css']}))
     .pipe(gulp.dest(paths.dist));
};
