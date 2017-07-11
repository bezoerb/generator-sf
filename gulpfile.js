'use strict';
const path = require('path');
const exec = require('child_process').exec;
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nsp = require('gulp-nsp');
const plumber = require('gulp-plumber');
const runSequence = require('run-sequence');

gulp.task('nsp', cb => {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('npm-fixtures', cb => {
  exec('yarn', {cwd: 'test/fixtures'}, err => {
    if (err) {
      // Npm install in case yarn errored
      exec('npm install', {cwd: 'test/fixtures'}, () => {
        cb();
      });
    } else {
      cb();
    }
  });
});

gulp.task('jspm-fixtures', cb => {
  exec('node_modules/.bin/jspm install', {cwd: 'test/fixtures'}, () => {
    cb();
  });
});

gulp.task('composer-fixtures', cb => {
  exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', {cwd: 'test/fixtures'}, () => {
    exec('php composer.phar update --prefer-source --no-interaction', {cwd: 'test/fixtures'}, () => {
      exec('php composer.phar run-script post-update-cmd --no-interaction ', {cwd: 'test/fixtures'}, () => {
        cb();
      });
    });
  });
});

gulp.task('fixtures', cb => {
  runSequence(
    'npm-fixtures',
    ['jspm-fixtures', 'composer-fixtures'],
    cb
  );
});

gulp.task('test', cb => {
  let mochaErr;

  gulp.src('test/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', err => {
      mochaErr = err;
    })
    .on('end', () => {
      cb(mochaErr);
    });
});

gulp.task('watch', () => {
  gulp.watch(['generators/**/*.js', 'test/**'], ['test']);
});

gulp.task('prepublish', ['nsp']);
gulp.task('default', ['test']);
