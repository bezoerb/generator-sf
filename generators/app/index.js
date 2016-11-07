'use strict';
var os = require('os');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

var commands = require('../../lib/commands');

module.exports = yeoman.Base.extend({

    _invoke: function (generatorName, generatorPath) {
        return this.composeWith(generatorName, {
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
    _yarnAvailable: function () {
        // Check if jspm is installed globally
        return new Promise(function (resolve, reject) {
            this.spawnCommand('which', ['yarn'], {stdio: 'ignore'}).on('error', reject).on('exit', resolve);
        }.bind(this));
    },

    _installCmd: function () {
        var installer = [];
        if (this.props.yarn) {
            installer.push('yarn');
        } else {
            installer.push('npm install');
        }

        if (!this.props.noBower) {
            installer.push('bower install');
        }
        if (this.props.loader === 'jspm') {
            installer.push('jspm install');
        }
        installer.push('composer update');

        return installer.join(' && ');
    },

    initializing: function () {
        this.props = {
            safeProjectName: _.camelCase(this.appname)
        };

        this._invoke('generator:symfony', '../backend/symfony');
        this._invoke('generator:git', '../git');

        return this._yarnAvailable()
            .then(function () {
                this.props.yarn = true;
            }.bind(this))
            .catch(function () {
                this.props.yarn = false;
            }.bind(this));
    },

    prompting: {
        greetings: function () {
            if (!this.options['skip-welcome-message']) {
                this.log(yosay('\'Allo \'allo! Let\'s scaffold your Symfony PHP app with full featured frontend tooling'));
            }
        },

        askTask: function () {
            var prompts = [{
                type: 'list',
                name: 'buildtool',
                message: 'Please select a build tool',
                choices: [
                    {name: 'Gulp', value: 'gulp'},
                    {name: 'Grunt', value: 'grunt'}
                ]
            }];

            return this.prompt(prompts).then(function (props) {
                this.props = _.merge(this.props, props);
            }.bind(this));
        },

        askTools: function () {
            var useSass = function (answers) {
                return _.result(answers, 'preprocessor') === 'sass';
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
            }, {
                type: 'list',
                name: 'loader',
                message: 'Which module loader would you like to use?',
                choices: [
                    {name: 'SystemJS (jspm)', value: 'jspm'},
                    {name: 'Webpack (babel)', value: 'webpack'},
                    {name: 'Browserify (babel)', value: 'browserify'}
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
                this.props.critical = _.includes(props.additional || [], 'critical');
                this.props.uncss = _.includes(props.additional || [], 'uncss');
            }.bind(this));
        },

        askView: function () {
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

    configuring: function () {
        this.props.symfony = this.env.symfony;

        this._invoke('generator:' + this.props.buildtool, '../buildtool/' + this.props.buildtool);
        this._invoke('generator:' + this.props.view, '../view/' + this.props.view);
    },

    install: function () {
        this.log('');
        this.log('I\'m all done. Running ' + chalk.bold.yellow(this._installCmd()) + ' for you to install the required dependencies.');
        this.log('If this fails, try running the command yourself.');
        this.log('');

        var cb = function () {
            if (!this.options['skip-install']) {
                commands.yarn().catch(function () {
                }).then(function () {
                    commands.composer(['update'], {cwd: this.destinationPath()}).then(function () {
                        return this.props.loader === 'jspm' && commands.jspm(['install']);
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this);

        if (!this.props.noBower || !this.props.yarn) {
            this.installDependencies({
                skipMessage: true,
                skipInstall: this.options.skipInstall,
                bower: !this.props.noBower,
                npm: !this.props.yarn,
                callback: cb
            });
        } else {
            cb();
        }
    }
});
