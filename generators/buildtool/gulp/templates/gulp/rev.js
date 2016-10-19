import gulp from 'gulp';
import {paths, prefixDist} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export const rev = () =>
    gulp.src(prefixDist(
        'img/**/*.{jpg,jpeg,gif,png,webp}',
        'styles/*.css',
        'scripts/*.js'
    ), {base: paths.dist})
    .pipe($.rev())
    .pipe(gulp.dest(paths.dist))
    .pipe($.rev.manifest())
    .pipe(gulp.dest('app/config'))
    .pipe($.size({title: 'rev'}));

export const revManifest = () => {
    var manifest = gulp.src('./app/config/rev-manifest.json');
    console.log(prefixDist('**/*'));
    return gulp.src(prefixDist('**/*'), {base: paths.dist})
       // .pipe($.revReplace({manifest: manifest, replaceInExtensions: ['.js', '.css']}))
      //  .pipe(gulp.dest(paths.dist));
};
