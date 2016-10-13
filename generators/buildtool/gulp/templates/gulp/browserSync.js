import path from 'path';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import {phpMiddleware,paths, prefixDev} from './helper/utils';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {dev as configDev, dist as configDist} from '../webpack.config.js';


const reload = browserSync.reload;

let cache = null;

function bsOptions (target, ...base) {
    if (cache) {
        return cache;
    }

    let bundler = webpack(target !== 'dist' ? configDev : configDist);

    cache = {
        server: {
            baseDir: base,
            middleware: [
                webpackDevMiddleware(bundler, {
                    publicPath: configDev.output.publicPath,
                    noInfo: true,
                    stats: {colors: true}
                }),
                webpackHotMiddleware(bundler),
                phpMiddleware(target)
            ]
        },
        port: 8888,
        watchTask: target !== 'dist',
        notify: true,
        open: true,
        ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
        }
    };

    return cache;
}

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles'], () => {
    browserSync.init(bsOptions('dev', '.tmp', paths.app, './', 'bower_components', paths.dist));

    gulp.watch(prefixDev('images/**/*.{jpg,jpeg,gif,png,webp}'), reload);
    gulp.watch(prefixDev('styles/**/*.scss'), ['styles:dev', reload]);
    gulp.watch(prefixDev('../views/**/*.html.twig'), reload);
});

gulp.task('serve:dist', ['assets'], () => {
    browserSync.init(bsOptions('dist', paths.dist));
});
