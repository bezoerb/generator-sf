import gulp from 'gulp';
import {stream} from 'critical';
import {tmp, dist} from './helper/dir';

export const critical = () =>
    gulp.src(tmp('html/**/*.html'), {base: tmp('html')})
        .pipe(stream({base: tmp('html'), destFolder: dist() , minify: true, inline: false, css: [tmp('styles/main.css')]}))
        .pipe(gulp.dest(dist('styles/critical')));
