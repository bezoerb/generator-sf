'use strict';
const path = require('path');
const Buffer = require('buffer').Buffer;
const _ = require('lodash');
const Generator = require('yeoman-generator');
const spawn = require('cross-spawn');
const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs-extra'));

module.exports = Generator.extend({
  /**
   * Check for installed git
   */
  _gitAvailable: function () {
    // Check if jspm is installed globally
    return new Bluebird((resolve, reject) => {
      this.spawnCommand('git', ['--version'], {stdio: 'ignore'}).on('error', reject).on('exit', resolve);
    });
  },

  _gitBase: function () {
    return new Bluebird((resolve, reject) => {
      let stdErr = [];
      const stdOut = [];
      const spawned = spawn('git', ['rev-parse', '--show-cdup']);

      spawned.stdout.on('data', buffer => {
        stdOut.push(buffer);
      });
      spawned.stderr.on('data', buffer => {
        stdErr.push(buffer);
      });

      spawned.on('error', err => {
        stdErr.push(Buffer.from(err.stack, 'ascii'));
      });

      spawned.on('close', exitCode => {
        if (exitCode && stdErr.length !== 0) {
          stdErr = Buffer.concat(stdErr).toString('utf-8');
          reject(new Error(stdErr));
        } else {
          resolve(Buffer.concat(stdOut).toString('utf-8').replace(/[\r\n]/, ''));
        }
      });
    });
  },

  constructor: function () {
    this.props = {git: false};
    Generator.apply(this, arguments);
  },

  prompting: function () {
    const prompts = [{
      when: this._gitAvailable(),
      type: 'confirm',
      name: 'git',
      value: 'git',
      message: 'Would you like to enable Git for this project (includes post-merge hook)?',
      default: false
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = _.merge(this.props, props);
    });
  },

  install: {
    init: function () {
      if (!this.props.git) {
        return;
      }

      return this._gitBase()
        .then(base => {
          fs.copySync(this.templatePath('post-merge'), this.destinationPath(path.join(base, '.git/hooks/post-merge')));
          fs.chmodSync(this.destinationPath(path.join(base, '.git/hooks/post-merge')), '755');
        })
        .catch(() => {
          this.spawnCommand('git', ['init']).on('exit', () => {
            fs.copySync(this.templatePath('post-merge'), this.destinationPath('.git/hooks/post-merge'));
            fs.chmodSync(this.destinationPath('.git/hooks/post-merge'), '755');
          });
        });
    },

    gitignore: function () {
      // Append gitignore
      const ignores = fs.readFileSync(this.templatePath('gitignore'), 'utf-8');
      fs.ensureFileSync(this.destinationPath('.gitignore'));
      fs.appendFileSync(this.destinationPath('.gitignore'), ignores);
    }

  }
});
