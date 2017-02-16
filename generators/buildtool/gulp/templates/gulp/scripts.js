<% if (props.loader === 'browserify') { %>import watchify from 'watchify';
import babelify from 'babelify';
import rollupify from 'rollupify';
import browserify from 'browserify';
import gulp from 'gulp';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import sourcemaps from 'gulp-sourcemaps';
import {first} from 'lodash';
import {prefixDev} from './helper/utils';
import {ENV} from './helper/env';

export const scripts = bs => {
    const watch = ENV !== 'prod';
    let bundler = browserify(prefixDev('scripts/main.js'), {debug: watch});
    if (watch) {
        bundler = watchify(bundler);
    }

    bundler.transform(rollupify)
        .transform(babelify.configure({
            presets: ['env'],
            ignore: /(node_modules)/,
            sourceMaps: true
        }));

    const rebundle = () =>
        bundler.bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('.tmp/scripts'));

    if (watch) {
        bundler.on('update', () => rebundle().pipe(bs.stream({once: true})));
    }

    return rebundle;
};<% } else if (props.loader === 'webpack') { %>import gutil from 'gulp-util';
import webpack from 'webpack';
import wpc from '../webpack.config';

export const scripts = () => cb => {
    const config = {
        ...wpc, stats: {
            // Configure the console output
            colors: true,
            modules: true,
            reasons: true,
            errorDetails: true
        }
    };

    webpack(config, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        cb();
    });
};<% } else if (props.loader === 'jspm') { %>
import {exec} from 'child_process';
import {ENV} from './helper/env';

export const scripts = () => cb =>
    (ENV !== 'node' && exec(`node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js`, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })) || cb();
<% } %>
