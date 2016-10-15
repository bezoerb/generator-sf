'use strict';
var path = require('path');
var shell = require('shelljs');
var gulp = require('gulp');
var exec = require('child_process').exec;
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var runSequence = require('run-sequence');

gulp.task('static', function () {
    return gulp.src(['generators/**/*.js', '!generators/**/templates/**/*.js'])
        .pipe(excludeGitignore())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
    nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('npm-fixtures', function (cb) {
    exec('yarn', {cwd: 'test/fixtures'}, function (err) {
        if (err) {
            exec('npm install', {cwd: 'test/fixtures'}, function () {
                cb();
            });
        } else {
            cb();
        }
    });
});

gulp.task('bower-fixtures', function (cb) {
    exec('bower install', {cwd: 'test/fixtures'}, function () {
        cb();
    });
});

gulp.task('jspm-fixtures', function (cb) {
    exec('node_modules/.bin/jspm install', {cwd: 'test/fixtures'}, function () {
        cb();
    });
});

gulp.task('composer-fixtures', function (cb) {
    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', {cwd: 'test/fixtures'}, function () {
        exec('php composer.phar update --prefer-source --no-interaction --dev ', {cwd: 'test/fixtures'}, function () {
            exec('php composer.phar run-script post-update-cmd --no-interaction ', {cwd: 'test/fixtures'}, function () {
                cb();
            });
        });
    });
});

gulp.task('fixtures', function (cb) {
    runSequence(
        'npm-fixtures',
        ['jspm-fixtures', 'bower-fixtures', 'composer-fixtures'],
        cb
    );
});

gulp.task('pre-test', function () {
    return gulp.src(['generators/**/*.js', '!generators/**/templates/**/*.js'])
        .pipe(excludeGitignore())
        .pipe(istanbul({
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
    var mochaErr;

    gulp.src('test/*.js')
        .pipe(plumber())
        .pipe(mocha({reporter: 'spec'}))
        .on('error', function (err) {
            mochaErr = err;
        })
        .pipe(istanbul.writeReports())
        .on('end', function () {
            cb(mochaErr);
        });
});

gulp.task('watch', function () {
    gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('coveralls', ['test'], function () {
    if (!process.env.CI) {
        return;
    }

    return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
        .pipe(coveralls());
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', function(cb) {
    runSequence('fixtures', ['static', 'test', 'coveralls'], cb);
});
