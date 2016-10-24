'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import {prefixDev, prefixDist} from './gulp/helper/utils';

import {serveDev, serveProd, stream} from './gulp/browserSync';
import {stylesDev, stylesProd} from './gulp/styles';
import {scriptsDev, scriptsProd} from './gulp/scripts';
import {rev, revManifest} from './gulp/rev';
import {imagemin, imagecopy, svgstore} from './gulp/images';
import {copy} from './gulp/copy';
<% if (props.uncss || props.critical) { %>import {connect} from './gulp/connect';<% } %>
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

gulp.task('sfcl:node', sfcl('node'));
gulp.task('sfcl:dev', sfcl('dev'));
gulp.task('sfcl:prod', sfcl('prod'));

gulp.task('styles:dev', ['clean:styles'], stylesDev(stream));
gulp.task('styles:prod', ['clean:styles'], stylesProd());

gulp.task('scripts:dev', ['clean:scripts'], scriptsDev(stream));
gulp.task('scripts:prod', ['clean:scripts'], scriptsProd());

gulp.task('images:copy', imagecopy);
gulp.task('images:min', imagemin);
gulp.task('images:svg', svgstore);
gulp.task('images:prod', ['images:min', 'images:svg']);
gulp.task('images:dev', ['images:copy', 'images:svg']);

gulp.task('rev-files', rev);
gulp.task('rev', ['rev-files'], revManifest);

<% if (props.uncss || props.critical) { %>gulp.task('connect', connect);<% } %>
<% if (props.critical) { %>gulp.task('critical', ['styles', 'connect'], critical);<% } %>
<% if (props.uncss) { %>gulp.task('uncss', ['styles', 'connect'], uncss);<% } %>

gulp.task('copy', copy);

gulp.task('copy-sw-scripts', copySwScripts);
gulp.task('generate-service-worker', ['copy-sw-scripts'], generateServiceWorker);

gulp.task('serve', ['scripts:dev', 'styles:dev', 'images:dev'], serveDev(bs => {
    gulp.watch(prefixDev('img/icons/*.svg'), ['images:svg', bs.reload]);
    gulp.watch(prefixDev('styles/**/*.scss'), ['styles:dev']);<% if (props.loader === 'jspm') { %>
    gulp.watch(prefixDev('scripts/**/*.js'), bs.reload);<% } %>
    gulp.watch(prefixDev('../views/**/*.html.twig'), bs.reload);
}));
gulp.task('serve:dist', ['build'], serveProd);

gulp.task('eslint', lint);
gulp.task('karma', karma);
gulp.task('phpunit', phpunit);

gulp.task('test', cb =>
    runSequence(['lint', 'karma', 'phpunit'], cb)
);

gulp.task('assets', ['styles:prod', 'scripts:prod', 'images:prod', 'copy'], cb =>
    runSequence('rev', 'generate-service-worker', cb)
);

gulp.task('build', ['test', 'assets']);

// Build production files, the default task
gulp.task('default', ['clean']);
