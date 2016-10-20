import gulp from 'gulp';
import {paths, prefixDev} from './helper/utils';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export const copy = () =>
    gulp.src(prefixDev( '**/*.{ico,txt,web,json,webapp,xml}'), {dot: true})
        .pipe(gulp.dest(paths.dist))
        .pipe($.size({title: 'copy'}));
