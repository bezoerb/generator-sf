<% if (props.loader === 'browserify') { %>const watchify = require('watchify');
const babelify = require('babelify');
const rollupify = require('rollupify');
const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const {first} = require('lodash');
const {src, tmp} = require('./helper/dir');
const {ENV} = require('./helper/env');

const scripts = bs => {
    const watch = ENV !== 'prod';
    let bundler = browserify(src('scripts/main.js'), {debug: watch});
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
            .pipe(gulp.dest(tmp('scripts')));

    if (watch) {
        bundler.on('update', () => rebundle().pipe(bs.stream({once: true})));
    }

    return rebundle;
};

module.exports = {
    scripts
};<% } else if (props.loader === 'webpack') { %>const gutil = require('gulp-util');
const webpack = require('webpack');
const wpc = require('../webpack.config');

const scripts = () => cb => {
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

module.exports = {
    scripts
};<% } else if (props.loader === 'jspm') { %>
const {exec} = require('child_process');
const {ENV} = require('./helper/env');

const scripts = () => cb =>
    (ENV !== 'node' && exec(`node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js`, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })) || cb();

module.exports = {
    scripts
};<% } %>
