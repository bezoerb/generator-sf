import path from 'path';
import gulp from 'gulp';
import {paths,prefixDist} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

gulp.task('revision', ['images','styles','scripts'],() => {
    return gulp.src(prefixDist(
            'img/**/*.{jpg,jpeg,gif,png,webp}',
            'styles/*.css',
            'scripts/*.js'
        ), {base: paths.dist})
        .pipe($.rev())
        .pipe(gulp.dest(paths.dist))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('app/config'))
        .pipe($.size({title: 'rev'}));

});

gulp.task('rev', ['revision'], function(){
    var manifest = gulp.src('./app/config/rev-manifest.json');

    return gulp.src( prefixDist('**/*') , {base: paths.dist})
        .pipe($.revReplace({manifest: manifest, replaceInExtensions: ['.js', '.css']}))
        .pipe(gulp.dest( paths.dist));
});
