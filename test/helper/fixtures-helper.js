'use strict';
const path = require('path');
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const _ = require('lodash');
const fs = require('fs-extra');
const Promise = require('bluebird');
const glob = require('glob');
const debug = require('debug')('yeoman:generator-sf');

/**
 * Symlink npm dependencies
 */
function prepareNpmDeps(configFile, baseConfigFile, base, target) {
  const config = fs.readJsonSync(configFile);
  const baseConfig = fs.readJsonSync(baseConfigFile);
  const modules = _.keys(_.merge(config.dependencies || {}, config.devDependencies));
  const baseModules = _.keys(_.merge(baseConfig.dependencies || {}, baseConfig.devDependencies));
  const drop = _.difference(baseModules, modules);

  fs.removeSync(target);

  _.forEach(glob.sync(base + '/*'), fp => {
    const module = path.basename(fp);
    if (drop.indexOf(module) === -1) {
      fs.ensureSymlinkSync(fp, path.join(target, module));
      const cwd = process.cwd();
      if (module === 'node-sass') {
        process.chdir(path.dirname(target));
        execSync('npm rebuild node-sass');
        process.chdir(cwd);
      }

      if (module === 'jspm') {
        process.chdir(path.dirname(target));
        execSync('npm rebuild jspm');
        process.chdir(cwd);
      }
    }
  });
}

/**
 * Link dependencies
 */
function linkDeps(base, target) {
  return function () {
    return new Promise((resolve, reject) => {
      try {
        prepareNpmDeps(path.join(target, 'package.json'), path.join(base, 'package.json'), path.join(base, 'node_modules'), path.join(target, 'node_modules'));
        fs.ensureSymlinkSync(path.join(base, 'node_modules', '.bin'), path.join(target, 'node_modules', '.bin'));
        fs.ensureSymlinkSync(path.join(base, 'vendor'), path.join(target, 'vendor'));
        fs.removeSync(path.join(target, 'composer.lock'));
        fs.ensureSymlinkSync(path.join(base, 'composer.lock'), path.join(target, 'composer.lock'));
        fs.removeSync(path.join(target, 'composer.json'));
        fs.ensureSymlinkSync(path.join(base, 'composer.json'), path.join(target, 'composer.json'));
        fs.ensureSymlinkSync(path.join(base, 'bin'), path.join(target, 'bin'));
        fs.copySync(path.join(base, 'app/autoload.php'), path.join(target, 'app/autoload.php'));
        fs.copySync(path.join(base, 'app/bootstrap.php.cache'), path.join(target, 'app/bootstrap.php.cache'));
        fs.copySync(path.join(base, 'app/config/parameters.yml'), path.join(target, 'app/config/parameters.yml'));
        fs.copySync(path.join(base, 'app/config/parameters.yml.dist'), path.join(target, 'app/config/parameters.yml.dist'));

        const pkg = fs.readJsonSync(path.join(target, 'package.json'));
        if (pkg.jspm) {
          fs.ensureSymlinkSync(path.join(base, 'jspm_packages'), path.join(target, 'jspm_packages'));
        }
      } catch (err) {
        debug('linkDeps', err);
        reject(err);
      }

      resolve();
    });
  };
}

module.exports.linkDeps = linkDeps;

module.exports.withComposer = function (cb) {
  if (!cb) {
    cb = function () {
    };
  }

  debug('process.cwd() -> ', process.cwd());

  exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php', error => {
    if (error) {
      cb(error);
      return;
    }

    const cmd = process.env.COMPOSER_AUTH ? 'config github-oauth.github.com ' + process.env.COMPOSER_AUTH : ' --version';
    exec('php composer.phar ' + cmd, (error, stdout, stderr) => {
      debug('stdout: composer config -> ', stdout);
      debug('stderr: composer config -> ', stderr);
      if (error) {
        debug('error: composer config -> ', error);
      }

      exec('php composer.phar clear-cache', (error, stdout, stderr) => {
        debug('stdout: composer clear-cache  -> ', stdout);
        debug('stderr: composer clear-cache  -> ', stderr);
        if (error) {
          debug('error: composer clear-cache -> ', error);
          cb(error);
          return;
        }

        process.env.SYMFONY_ENV = 'dev';

        exec('php composer.phar install --prefer-dist --no-interaction --dev', (error, stdout, stderr) => {
          debug('error: composer install -> ', error);
          debug('stdout: composer install -> ', stdout);
          debug('stderr: composer install -> ', stderr);
          // App/bootstrap.php.cache should be ready
          const bootstrap = path.resolve('app/bootstrap.php.cache');
          /* jshint -W016 */
          try {
            fs.statSync(bootstrap, fs.R_OK | fs.W_OK);
            debug('SUCCESS bootstrap.php.cache -> available');
          } catch (err) {
            debug('ERROR: bootstrap.php.cache -> ', err.message || err);
          }

          cb(error, stdout);
        });
      });
    });
  });
};

module.exports.withJspm = function (cb) {
  if (!cb) {
    cb = function () {
    };
  }

  const cmd = process.env.JSPM_AUTH ? 'config registries.github.auth ' + process.env.JSPM_AUTH : ' --version';
  exec('node_modules/.bin/jspm ' + cmd, (error, stdout, stderr) => {
    debug('stdout: jspm config -> ', stdout);
    debug('stderr: jspm config -> ', stderr);

    if (error) {
      debug('stderr: jspm config -> ', stderr);
    }
    exec('node_modules/.bin/jspm cc', () => {
      exec('node_modules/.bin/jspm init -y', (error, stdout, stderr) => {
        debug('stdout: jspm init -> ', stdout);
        debug('stderr: jspm init -> ', stderr);

        if (error) {
          debug('error: jspm init -> ', error);
        }
        exec('node_modules/.bin/jspm install', (error, stdout, stderr) => {
          debug('stdout: jspm install -> ', stdout);
          debug('stderr: jspm install -> ', stderr);

          if (error) {
            debug('error: jspm install -> ', error);
            cb(error);
            return;
          }
          cb(error, stdout);
        });
      });
    });
  });
};
