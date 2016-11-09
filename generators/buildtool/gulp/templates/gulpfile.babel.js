'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import {prefixDev, prefixDist} from './gulp/helper/utils';
import {ENV} from './gulp/helper/env';

import {serve, bs} from './gulp/browserSync';
import {styles} from './gulp/styles';
import {scripts} from './gulp/scripts';
import {rev, revManifest} from './gulp/rev';
import {imagemin, imagecopy, svgstore} from './gulp/images';
import {copy} from './gulp/copy';
<% if (props.uncss || props.critical) { %>import {twig} from './gulp/twig';<% } %>
<% if (props.critical) { %>import {critical} from './gulp/critical';<% } %>
<% if (props.uncss) { %>import {uncss} from './gulp/uncss';<% } %>
import {sfcl} from './gulp/exec';
import {copySwScripts, generateServiceWorker} from './gulp/service-worker';
import {lint, karma, phpunit} from './gulp/tests';


gulp.task('clean:tmp', () => del(['.tmp'], {dot: true}));
gulp.task('clean:scripts', () => del([prefixDist('scripts')], {dot: true}));
gulp.task('clean:images', () => del([prefixDist('img')], {dot: true}));
gulp.task('clean:styles', () => del([prefixDist('styles')], {dot: true}));
gulp.task('clean', ['clean:tmp', 'clean:scripts', 'clean:styles', 'clean:images']);

gulp.task('sfcl', sfcl());

gulp.task('styles', ['clean:styles'], styles(bs));

gulp.task('scripts', ['clean:scripts'], scripts(bs));

gulp.task('images:copy', imagecopy);
gulp.task('images:min', imagemin);
gulp.task('images:svg', svgstore);
gulp.task('images:svg:watch', ['images:svg'], done => {
    bs.reload();
    done();
});
gulp.task('images', ENV === 'prod' ? ['images:min', 'images:svg'] : ['images:copy', 'images:svg']);

gulp.task('rev-files', rev);
gulp.task('rev', ['rev-files'], revManifest);
<% if (props.uncss || props.critical) { %>
gulp.task('twig', twig);<% } if (props.critical) { %>
gulp.task('critical', ['twig'], critical);<% } if (props.uncss) { %>
gulp.task('uncss', ['twig'], uncss);
<% } %>
gulp.task('copy', copy);

gulp.task('copy-sw-scripts', copySwScripts);
gulp.task('generate-service-worker', ['copy-sw-scripts'], generateServiceWorker);

gulp.task('serve', ENV  === 'prod'? ['build'] : [<% if (props.loader !== 'webpack') { %>'scripts', <% } %>'styles', 'images'], serve((err, done) => {
    if (!err && ENV  !== 'prod') {
        gulp.watch(prefixDev('img/icons/*.svg'), ['images:svg:watch']);
        gulp.watch(prefixDev('styles/**/*.scss'), ['styles']);<% if (props.loader === 'jspm') { %>
        gulp.watch(prefixDev('scripts/**/*.js'), bs.reload);<% } %>
        gulp.watch(prefixDev('../views/**/*.html.twig'), bs.reload);
    }
    done(err);
}));

gulp.task('eslint', lint);
gulp.task('karma', karma);
gulp.task('phpunit', phpunit);

gulp.task('test', cb =>
    runSequence(['eslint', 'karma', 'phpunit'], cb)
);

gulp.task('assets', ['styles', 'scripts', 'images', 'copy'], cb =>
    runSequence(<% if (props.uncss || props.critical) { %>
        'twig',<% } if (props.uncss) { %>
        'uncss',<% } if (props.critical) { %>
        'critical',<% } %>
        'rev',
        'generate-service-worker',
        cb)
);

gulp.task('build', ['test', 'assets']);

// Build production files, the default task
gulp.task('default', ['serve']);
