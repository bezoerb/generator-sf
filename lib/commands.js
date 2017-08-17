'use strict';
const path = require('path');
const Bluebird = require('bluebird');
const spawn = require('cross-spawn');
const findUp = require('find-up');

function composer(args, opts) {
  return findUp('composer.phar', opts).then(fp => {
    return new Bluebird((resolve, reject) => {
      let cmd = 'composer';
      if (fp) {
        args.unshift(fp);
        cmd = 'php';
      }
      spawn(cmd, args, {stdio: 'inherit'}).on('error', reject).on('exit', resolve);
    });
  });
}

function jspm(args, opts) {
  const cwd = path.resolve((opts && opts.cwd) || '');
  const cmd = path.join(cwd, 'node_modules', '.bin', 'jspm');

  return new Bluebird((resolve, reject) => {
    spawn(cmd, args, {stdio: 'inherit'}).on('error', reject).on('exit', resolve);
  });
}

function hasYarn() {
  const result = spawn.sync('yarn', ['--version']);
  return result.status === 0 && Boolean(result.stdout);
}

function yarn(args) {
  return new Bluebird((resolve, reject) => {
    spawn('yarn', args || [], {stdio: 'inherit'}).on('error', reject).on('exit', resolve);
  });
}

function npm(args) {
  return new Bluebird((resolve, reject) => {
    spawn('npm', ['install'].concat(args || []), {stdio: 'inherit'}).on('error', reject).on('exit', resolve);
  });
}

module.exports = {
  composer,
  jspm,
  yarn,
  hasYarn,
  npm
};

