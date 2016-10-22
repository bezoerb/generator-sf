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

const compile = watch => stream => {
    let bundler = browserify(prefixDev('scripts/main.js'), {debug: watch});
    if (watch) {
        bundler = watchify(bundler);
    }

    bundler.transform(rollupify)
        .transform(babelify.configure({
            presets: ['es2015', 'stage-2'],
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
        bundler.on('update', () => rebundle().pipe(stream({once: true})));
    }

    return rebundle;
};

export const scriptsDev = compile(true);
export const scriptsProd = compile(false);<% } else if (props.loader === 'webpack') { %>import gutil from 'gulp-util';
import webpack from 'webpack';
import webpackConfig from '../webpack.config';

const compile = env => () => cb => {
    const wpc = webpackConfig[env];
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
};

export const scriptsDev = compile('dev');
export const scriptsProd = compile('prod');<% } else if (props.loader === 'jspm') { %>
import {exec} from 'child_process';

export const scriptsProd = () => cb =>
    exec(`node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js`,  (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
export const scriptsDev = () => () => {};
<% } %>
