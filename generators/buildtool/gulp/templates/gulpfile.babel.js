/**
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/
import gulp from 'gulp';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';

import {serveDev,serveDist} from './gulp/browserSync';
import {stylesDev,stylesDist} from './gulp/styles';
import {scriptsDev, scriptsDist} from './gulp/scripts';
import {rev, revManifest} from './gulp/rev';
import {images} from './gulp/images';
import {connect} from './gulp/connect';
import {copy} from './gulp/copy';
import {clean} from './gulp/clean';
import {critical} from './gulp/critical';
import {sfcl} from './gulp/exec';
import {copySwScripts, generateServiceWorker} from './gulp/service-worker';
import {lint, karma, phpunit} from './gulp/tests';

gulp.task('sfcl:node', sfcl('node'));
gulp.task('sfcl:dev', sfcl('dev'));
gulp.task('sfcl:prod', sfcl('prod'));

gulp.task('styles', stylesDev);
gulp.task('styles:dist', stylesDist);

gulp.task('scripts', scriptsDev);
gulp.task('scripts:dist', scriptsDist);

gulp.task('images', images);

gulp.task('rev-files', ['images','styles:dist','scripts:dist'], rev);
gulp.task('rev', ['rev-files'], revManifest);

gulp.task('connect', connect);
gulp.task('critical', ['styles','connect'], critical);

gulp.task('serve', ['scripts', 'styles'], serveDev);
gulp.task('serve:dist', ['scripts:dist', 'styles:dist'], serveDist);

gulp.task('copy', copy);
gulp.task('clean', clean);

gulp.task('copy-sw-scripts', copySwScripts);
gulp.task('generate-service-worker', ['copy-sw-scripts'], generateServiceWorker);

gulp.task('lint', lint);
gulp.task('karma', karma);
gulp.task('phpunit', phpunit);

gulp.task('test', cb =>
    runSequence(
        ['lint', 'karma', 'phpunit'],
        cb
    )
);

gulp.task('assets', ['clean'], cb =>
    runSequence(
        ['styles','scripts', 'images', 'copy'],
        'rev',
        'generate-service-worker',
        cb
    )
);

gulp.task('build', ['test'], cb =>
    runSequence(
        ['styles:dist', 'scripts:dist', 'images', 'copy'],
        'rev',
        'generate-service-worker',
        cb
    )
);

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
    runSequence(
        'styles',
        ['scripts', 'images', 'copy'],
        'generate-service-worker',
        cb
    )
);
