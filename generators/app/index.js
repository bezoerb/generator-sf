'use strict';
var os = require('os');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var commands = require('../../lib/commands');

module.exports = yeoman.Base.extend({

    _invoke: function _invoke(generatorName, generatorPath) {
        this.composeWith(generatorName, {
            arguments: ['app'],
            options: _.assign(this.props, {
                skipInstall: true
            })
        }, {
            local: require.resolve(generatorPath)
        });
    },

    /**
     * Check for installed git
     */
    checkGit: function checkGit() {
        // Check if jspm is installed globally
        this.globalGit = false;
        this.spawnCommand('git', ['--version'], {stdio: 'ignore'}).on('exit', function () {
            this.globalGit = true;
        }.bind(this)).on('error', function () {
            this.globalGit = false;
        }.bind(this));
    },

    initializing: function () {
        this.props = {
            safeProjectName: _.camelCase(this.appname)
        };

        this._invoke('generator:symfony', '../backend/symfony');
    },

    prompting: {

        askTask: function () {
            var prompts = [{
                type: 'list',
                name: 'taskrunner',
                message: 'Please select a taskrunner',
                choices: [
                    {name: 'Grunt', value: 'grunt'},
                    {name: 'Gulp (beta)', value: 'gulp'}
                ]
            }];

            return this.prompt(prompts).then(function (props) {
                this.props = _.merge(this.props, props);
            }.bind(this));
        },

        askTools: function () {
            var useSass = function useSass (answers) {
                return _.result(answers,'preprocessor') === 'sass';
            };

            var prompts = [{
                type: 'list',
                name: 'preprocessor',
                message: 'Would you like to use a CSS preprocessor?',
                choices: [
                    {name: 'Sass', value: 'sass'},
                    {name: 'Less', value: 'less'},
                    {name: 'Stylus', value: 'stylus'},
                    {name: 'No Preprocessor', value: 'none'}
                ]
            }, {
                when: useSass,
                type: 'confirm',
                name: 'libsass',
                value: 'uselibsass',
                message: 'Would you like to use libsass? Read up more at' + os.EOL +
                chalk.green('https://github.com/andrew/node-sass#node-sass'),
                default: true
            },{
                type: 'list',
                name: 'loader',
                message: 'Which module loader would you like to use?',
                choices: [
                    {name: 'SystemJS (jspm)', value: 'jspm'},
                    {name: 'Browserify (babel)', value: 'browserify'},
                    {name: 'Webpack (babel)', value: 'webpack'},
                    {name: 'RequireJS', value: 'requirejs'}
                ]
            }, {
                type: 'checkbox',
                name: 'additional',
                message: 'Which additional plugins should i integrate for you?',
                choices: [
                    {value: 'uncss', name: 'UnCSS - A grunt task for removing unused CSS', checked: true},
                    {value: 'critical', name: 'Critical - Extract & Inline Critical-path CSS', checked: true}
                ]
            }];

            return this.prompt(prompts).then(function (props) {
                this.props = _.merge(this.props, props);
                this.props.noBower = this.props.loader === 'webpack' || this.props.loader === 'browserify' || this.props.loader === 'jspm';
            }.bind(this));
        },

        askView: function() {
            var prompts = [{
                when: this.props.preprocessor === 'sass',
                type: 'list',
                name: 'view',
                message: 'Would you like to include a CSS framework?',
                choices: [
                    {name: 'UIkit', value: 'uikit'},
                    {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                    {name: 'Foundation', value: 'foundation'},
                    {name: 'Inuit CSS', value: 'inuit'},
                    {name: 'No Framework', value: 'plain'}
                ]
            }, {
                when: this.props.preprocessor !== 'sass',
                type: 'list',
                name: 'view',
                message: 'Would you like to include a CSS framework?',
                choices: [
                    {name: 'UIkit', value: 'uikit'},
                    {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                    {name: 'Foundation', value: 'foundation'},
                    {name: 'No Framework', value: 'plain'}
                ]
            }];

            return this.prompt(prompts).then(function (props) {
                this.props = _.merge(this.props, props);
            }.bind(this));
        }
    },

    configuring: function configuring() {
        this._invoke('generator:' + this.props.taskrunner, '../taskrunner/' + this.props.taskrunner);
        this._invoke('generator:' + this.props.view, '../view/' + this.props.view);
    },

    install: function () {
        var installer = ['npm install'];
        if (!this.props.noBower) {
            installer.push('bower install');
        }
        if (this.props.loader === 'jspm') {
            installer.push('jspm install');
        }
        installer.push('composer update');

        this.log('');
        this.log('I\'m all done. Running ' + chalk.bold.yellow(installer.join(' && ')) + ' for you to install the required dependencies.');
        this.log('If this fails, try running the command yourself.');
        this.log('');

        this.installDependencies({
            skipMessage: true,
            skipInstall: this.options.skipInstall,
            bower: !this.props.noBower,
            callback: function() {
                if (!this.options['skip-install']) {
                    commands.composer(['update'], {cwd: this.destinationPath()}).then(function(){
                       return this.props.loader === 'jspm' && commands.jspm(['install']);
                    }.bind(this));
                }
            }.bind(this)
        });
    }
});
