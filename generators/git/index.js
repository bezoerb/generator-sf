'use strict';
var path = require('path');
var Buffer = require('buffer').Buffer;
var fs = require('fs-extra');
var _ = require('lodash');
var generators = require('yeoman-generator');
var spawn = require('cross-spawn');
var Promise = require('bluebird');


module.exports = generators.Base.extend({
    /**
     * Check for installed git
     */
    _gitAvailable: function () {
        // Check if jspm is installed globally
        return new Promise(function (resolve, reject) {
            this.spawnCommand('git', ['--version'], {stdio: 'ignore'}).on('error', reject).on('exit', resolve);
        }.bind(this));
    },

    _gitBase: function () {
        return new Promise(function (resolve, reject) {
            var stdErr = [];
            var stdOut = [];
            var spawned = spawn('git', ['rev-parse', '--show-cdup']);

            spawned.stdout.on('data', function (buffer) {
                stdOut.push(buffer);
            });
            spawned.stderr.on('data', function (buffer) {
                stdErr.push(buffer);
            });

            spawned.on('error', function (err) {
                stdErr.push(new Buffer(err.stack, 'ascii'));
            });

            spawned.on('close', function (exitCode, exitSignal) {
                this.log(exitCode, exitSignal, stdErr, stdOut);
                if (exitCode && stdErr.length) {
                    stdErr = Buffer.concat(stdErr).toString('utf-8');
                    reject(new Error(stdErr));
                } else {
                    resolve(Buffer.concat(stdOut).toString('utf-8').replace(/[\r\n]/,''));
                }
            }.bind(this));
        }.bind(this));
    },

    constructor: function () {
        this.props = { git: false };
        generators.Base.apply(this, arguments);
    },

    prompting: function () {
        var prompts = [{
            when: this._gitAvailable(),
            type: 'confirm',
            name: 'git',
            value: 'git',
            message: 'Would you like to enable Git for this project (includes post-merge hook)?',
            default: false
        }];

        return this.prompt(prompts).then(function (props) {
            // To access props later use this.props.someAnswer;
            this.props = _.merge(this.props,props);
        }.bind(this));
    },

    writing: {
        init: function() {
            if (!this.props.git) {
                return;
            }

            this._gitBase()
                .then(function(base) {
                    fs.copySync(this.templatePath('post-merge'), this.destinationPath(path.join(base, '.git/hooks/post-merge')));
                    fs.chmodSync(this.destinationPath(path.join(base, '.git/hooks/post-merge')), '755');
                }.bind(this))
                .catch(function(){
                    this.spawnCommand('git', ['init'] ).on('exit', function () {
                        fs.copySync(this.templatePath('post-merge'), this.destinationPath('.git/hooks/post-merge'));
                        fs.chmodSync(this.destinationPath('.git/hooks/post-merge'), '755');
                    }.bind(this));
                }.bind(this));
        },

        gitignore: function() {
            // append gitignore
            var ignores = fs.readFileSync(this.templatePath('gitignore'), 'utf-8');
            fs.ensureFileSync(this.destinationPath('.gitignore'));
            fs.appendFileSync(this.destinationPath('.gitignore'), ignores);
        }

    }
});
