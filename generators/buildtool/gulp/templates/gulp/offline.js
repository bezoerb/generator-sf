import path from 'path';
import gulp from 'gulp';
import swPrecache from 'sw-precache';
import {dist, src} from './helper/dir';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from '../package.json';

const $ = gulpLoadPlugins();
const baseDir = dist(path.sep);

// Static file globs for appcache & service worker
// Add/remove glob patterns to match your directory setup.
const staticFiles = [
    dist('img/**/*.{svg,png,jpg,gif}'),
    dist('scripts/**/*.js'),
    dist('styles/**/*.css'),
    dist('fonts/**/*.{woff,woff2,ttf,svg,eot}'),
    dist('*.{html,json}')
];

// Copy html for appcache fallback based on the "Offline IFRAME Hack"
// by the awesome Financial Times Labs team: http://labs.ft.com/category/tutorial/
export const appcacheNanny = () =>
    gulp.src([require.resolve('appcache-nanny/appcache-loader.html')])
        .pipe(gulp.dest(dist('')));

// generate appcahe manifest fpr browsers not supporting servive workers
export const appcache = () =>
    gulp.src(staticFiles, {base: baseDir})
        .pipe($.manifest({
            hash: true,
            preferOnline: true,
            network: ['*'],
            filename: 'manifest.appcache',
            exclude: 'manifest.appcache'
        }))
        .pipe(gulp.dest(baseDir));

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
export const copySwScripts = () =>
    gulp.src(['node_modules/sw-toolbox/sw-toolbox.js', src('scripts/sw/runtime-caching.js')])
        .pipe(gulp.dest(dist('scripts/sw')));

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
export const generateServiceWorker = () => {
    const filepath = dist('service-worker.js');

    return swPrecache.write(filepath, {
        // Used to avoid cache conflicts when serving on localhost.
        cacheId: pkg.name || 'generator-sf',
        // sw-toolbox.js needs to be listed first. It sets up methods used in runtime-caching.js.
        importScripts: [
            'scripts/sw/sw-toolbox.js',
            'scripts/sw/runtime-caching.js'
        ],
        staticFileGlobs: staticFiles,
        // Translates a static file path to the relative URL that it's served from.
        stripPrefix: baseDir
    });
};
