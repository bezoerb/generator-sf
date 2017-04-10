'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/
import gulp from 'gulp';
import runSequence from 'run-sequence';
import {src, view} from './gulp/helper/utils';
import {ENV} from './gulp/helper/env';

// require the tasks
import {serve, bs} from './gulp/server';
import {styles} from './gulp/styles';
import {scripts} from './gulp/scripts';
import {rev, revManifest} from './gulp/rev';
import {imagemin, imagecopy, svgstore} from './gulp/images';
import {copy} from './gulp/copy';
import {clean} from './gulp/clean';
<% if (props.uncss || props.critical) { %>import {twig} from './gulp/twig';<% } %>
<% if (props.critical) { %>import {critical} from './gulp/critical';<% } %>
<% if (props.uncss) { %>import {uncss} from './gulp/uncss';<% } %>
import {sfcl} from './gulp/exec';
import {appcache, appcacheNanny, copySwScripts, generateServiceWorker} from './gulp/offline';
import {lint, karma, phpunit} from './gulp/tests';

// Clean output directory
gulp.task('clean:tmp', clean('tmp'));
gulp.task('clean:scripts', clean('scripts'));
gulp.task('clean:images', clean('images'));
gulp.task('clean:styles', clean('styles'));
gulp.task('clean:build', clean('build'));
gulp.task('clean', ['clean:tmp', 'clean:build', 'clean:scripts', 'clean:styles', 'clean:images']);

// Clear symfony cache
gulp.task('sfcl', sfcl());

// Compile and automatically prefix stylesheets
gulp.task('styles', ['clean:styles'], styles(bs));

// Compile scripts
gulp.task('scripts', ['clean:scripts'], scripts(bs));

// Optimize images and automatically create svg sprite
// from svg icons in app/resources/public/img/icons/**/*.svg
gulp.task('images:copy', imagecopy);
gulp.task('images:min', imagemin);
gulp.task('images:svg', svgstore);
gulp.task('images:svg:watch', ['images:svg'], done => {
    bs.reload();
    done();
});
gulp.task('images', ENV === 'prod' ? ['images:min', 'images:svg'] : ['images:copy', 'images:svg']);

// Hash asset filenames and create app/config/rev-manifest.json
// The manifest file is used by zoerb/filerevbundle to append hashes
// in TWIG using the {{ asset(...) }} function
gulp.task('rev-files', rev);
gulp.task('rev', ['rev-files'], revManifest);
<% if (props.uncss || props.critical) { %>
// Generate critical-path css and drop unused styles based on static
// html files compiled out of your controller templates located in
// app/resources/views/controller/**/*.twig
gulp.task('twig', twig);<% } if (props.critical) { %>
gulp.task('critical', ['twig'], critical);<% } if (props.uncss) { %>
gulp.task('uncss', ['twig'], uncss);
<% } %>
// Copy all files at the root level which are not processed by
// on of the other compile steps
gulp.task('copy', copy);

// Copy over the scripts that are used in importScripts as part of the
// generate-service-worker task. Also copy the appcache-nanny iframe template
// to allow fallback to appcache with appcache-nanny to add offline support to
// browsers that do not yet support service worker. The service-worker / appcache
// is activated in app/resources/public/scripts/modules/service-worker.js
// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
gulp.task('copy-appcache-nanny', appcacheNanny);
gulp.task('appcache', ['copy-appcache-nanny'], appcache)
gulp.task('copy-sw-scripts', copySwScripts);
gulp.task('generate-service-worker', ['copy-sw-scripts'], generateServiceWorker);
gulp.task('offline', cb =>
    runSequence(['appcache', 'generate-service-worker'], cb)
);

// Browsersync dev server with a php middleware. It watches files for changes & reload.
gulp.task('serve', ENV  === 'prod'? ['build'] : [<% if (props.loader !== 'webpack') { %>'scripts', <% } %>'styles', 'images'], serve((err, done) => {
    if (!err && ENV  !== 'prod') {
        gulp.watch(src('img/icons/*.svg'), ['images:svg:watch']);
        gulp.watch(src('styles/**/*.scss'), ['styles']);<% if (props.loader === 'jspm') { %>
        gulp.watch(src('scripts/**/*.js'), bs.reload);<% } %>
        gulp.watch(view('**/*.html.twig'), bs.reload);
    }
    done(err);
}));

// Runs mocha & phpunit tests and lints javascript files
gulp.task('eslint', lint);
gulp.task('karma', karma);
gulp.task('phpunit', phpunit);
gulp.task('test', cb =>
    runSequence(['eslint', 'karma', 'phpunit'], cb)
);

// Bring all the assets in place
// This task skips some optimizations for the dev environment to
// speed up the build process.
gulp.task('assets', ['styles', 'scripts', 'images', 'copy'], cb =>
    runSequence(<% if (props.uncss || props.critical) { %>
        'twig',<% } if (props.uncss) { %>
        'uncss',<% } if (props.critical) { %>
        'critical',<% } %>
        'rev',
        'offline',
        cb)
);

// Build production files. use with `--env prod` option
gulp.task('build', ['test', 'assets']);

// Build production files, the default task
gulp.task('default', ['build']);
