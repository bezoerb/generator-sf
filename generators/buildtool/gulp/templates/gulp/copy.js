import gulp from 'gulp';
import {dist, src} from './helper/dir';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

export const copy = () =>
    gulp.src(src('**/*.{ico,txt,web,json,webapp,xml}'), {dot: true})
        .pipe(gulp.dest(dist()))
        .pipe($.size({title: 'copy'}));
