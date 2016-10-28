import gulp from 'gulp';
import {stream} from 'critical';
import {prefixDist} from './helper/utils';

export const critical = () =>
    gulp.src('.tmp/html/**/*.html', {base: '.tmp/html/'})
        .pipe(stream({base: '.tmp/html', destFolder: prefixDist('/') , minify: true, inline: false, css: ['.tmp/styles/main.css']}))
        .pipe(gulp.dest(prefixDist('styles/critical')));
