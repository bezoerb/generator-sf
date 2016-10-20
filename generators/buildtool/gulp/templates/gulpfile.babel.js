'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/
import gulp from 'gulp';
import runSequence from 'run-sequence';
import del from 'del';
import {prefixDev, prefixDist} from './gulp/helper/utils';

import {serveDev, serveProd} from './gulp/browserSync';
import {stylesDev, stylesProd} from './gulp/styles';
import {scriptsDev, scriptsProd} from './gulp/scripts';
import {rev, revManifest} from './gulp/rev';
import {imagesDev, imagesProd} from './gulp/images';
import {connect} from './gulp/connect';
import {copy} from './gulp/copy';
import {critical} from './gulp/critical';
import {sfcl} from './gulp/exec';
import {copySwScripts, generateServiceWorker} from './gulp/service-worker';
import {lint, karma, phpunit} from './gulp/tests';

gulp.task('clean:tmp', () => del(['.tmp'], {dot: true}));
gulp.task('clean:scripts', () => del([prefixDist('scripts')], {dot: true}));
gulp.task('clean:images', () => del([prefixDist('img')], {dot: true}));
gulp.task('clean:styles', () => del([prefixDist('styles')], {dot: true}));

gulp.task('sfcl:node', sfcl('node'));
gulp.task('sfcl:dev', sfcl('dev'));
gulp.task('sfcl:prod', sfcl('prod'));

gulp.task('styles:dev', ['clean:styles'], stylesDev);
gulp.task('styles:prod', ['clean:styles'], stylesProd);

gulp.task('scripts:dev', ['clean:scripts'], scriptsDev);
gulp.task('scripts:prod', ['clean:scripts'], scriptsProd);

gulp.task('images:dev', ['clean:images'], imagesDev);
gulp.task('images:prod', ['clean:images'], imagesProd);

gulp.task('rev-files', rev);
gulp.task('rev', ['rev-files'], revManifest);

gulp.task('connect', connect);
gulp.task('critical', ['styles', 'connect'], critical);

gulp.task('copy', copy);

gulp.task('copy-sw-scripts', copySwScripts);
gulp.task('generate-service-worker', ['copy-sw-scripts'], generateServiceWorker);

gulp.task('serve', ['scripts:dev', 'styles:dev', 'images:dev'], serveDev(reload => {
    gulp.watch(prefixDev('img/**/*.{jpg,jpeg,gif,png,webp}'), ['images:dev', reload]);
    gulp.watch(prefixDev('styles/**/*.scss'), ['styles:dev', reload]);
    gulp.watch(prefixDev('../views/**/*.html.twig'), reload);
}));
gulp.task('serve:dist', ['build'], serveProd);

gulp.task('lint', lint);
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
