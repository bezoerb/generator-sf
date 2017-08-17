'use strict';
const os = require('os');
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const _ = require('lodash');

const commands = require('../../lib/commands');

module.exports = Generator.extend({

  _invoke: function (generatorPath) {
    return this.composeWith(require.resolve(generatorPath), _.assign(this.props, {
      skipInstall: true
    }));
  },

  _installCmd: function () {
    const installer = [];
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

    this._invoke('../backend/symfony');
    this._invoke('../git');

    this.props.yarn = commands.hasYarn();
  },

  prompting: {
    greetings: function () {
      if (!this.options['skip-welcome-message']) {
        this.log(yosay('\'Allo \'allo! Let\'s scaffold your Symfony PHP app with full featured frontend tooling'));
      }
    },

    askTask: function () {
      const prompts = [{
        type: 'list',
        name: 'buildtool',
        message: 'Please select a build tool',
        choices: [
          {name: 'Gulp', value: 'gulp'},
          {name: 'Grunt', value: 'grunt'}
        ]
      }];

      return this.prompt(prompts).then(props => {
        this.props = _.merge(this.props, props);
      });
    },

    askTools: function () {
      const useSass = function (answers) {
        return _.result(answers, 'preprocessor') === 'sass';
      };

      const prompts = [{
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
          {name: 'Webpack (babel)', value: 'webpack'},
          {name: 'SystemJS (jspm)', value: 'jspm'},
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

      return this.prompt(prompts).then(props => {
        this.props = _.merge(this.props, props);
        this.props.noBower = this.props.loader === 'webpack' || this.props.loader === 'browserify' || this.props.loader === 'jspm';
        this.props.critical = _.includes(props.additional || [], 'critical');
        this.props.uncss = _.includes(props.additional || [], 'uncss');
      });
    },

    askView: function () {
      const prompts = [{
        when: this.props.preprocessor === 'sass',
        type: 'list',
        name: 'view',
        message: 'Would you like to include a CSS framework?',
        choices: [
          {name: 'Inuit CSS', value: 'inuit', checked: true},
          {name: 'Twitter Bootstrap', value: 'bootstrap'},
          {name: 'Foundation', value: 'foundation'},
          {name: 'UIkit', value: 'uikit'},
          {name: 'No Framework', value: 'plain'}
        ]
      }, {
        when: this.props.preprocessor !== 'sass',
        type: 'list',
        name: 'view',
        message: 'Would you like to include a CSS framework?',
        choices: [
          {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
          {name: 'UIkit', value: 'uikit'},
          {name: 'Foundation', value: 'foundation'},
          {name: 'No Framework', value: 'plain'}
        ]
      }];

      return this.prompt(prompts).then(props => {
        this.props = _.merge(this.props, props);
      });
    }
  },

  configuring: function () {
    this.props.symfony = this.env.symfony;

    this._invoke('../buildtool/' + this.props.buildtool);
    this._invoke('../view/' + this.props.view);
  },

  install: function () {
    this.log('');
    if (this.options['skip-install']) {
      this.log('I\'m all done. Run ' + chalk.bold.yellow(this._installCmd()) + ' to install the required dependencies.');
    } else {
      this.log('I\'m all done. Running ' + chalk.bold.yellow(this._installCmd()) + ' for you to install the required dependencies.');
      this.log('If this fails, try running the command yourself.');
    }
    this.log('');

    const cb = function () {
      if (!this.options['skip-install']) {
        const installNodeModules = commands.hasYarn() ? commands.yarn : commands.npm;

        installNodeModules().then(() => {
          commands.composer(['update'], {cwd: this.destinationPath()}).then(() => {
            return this.props.loader === 'jspm' && commands.jspm(['install']);
          });
        });
      }
    }.bind(this);

    if (this.props.noBower) {
      cb();
    } else {
      this.installDependencies({
        skipMessage: true,
        skipInstall: this.options.skipInstall,
        bower: true,
        npm: false,
        callback: cb
      });
    }
  }
});
