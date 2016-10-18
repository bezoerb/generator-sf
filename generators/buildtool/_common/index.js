'use strict';
var os = require('os');
var path = require('path');
var _ = require('lodash');
var chalk = require('chalk');
var pathIsAbsolute = require('path-is-absolute');
var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    /**
     * Re-read the content because a composed generator might modify it.
     * @returns {*}
     * @private
     */
    _readPkg: function () {
        return this.fs.readJSON(this.destinationPath('package.json'), {
            name: _.camelCase(this.appname),
            version: '0.0.0',
            scripts: {},
            dependencies: {},
            devDependencies: {}
        });
    },

    /**
     * Let's extend package.json so we're not overwriting user previous fields
     *
     * @private
     */
    _writePkg: function (pkg) {
        this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    },

    constructor: function () {
        generators.Base.apply(this, arguments);

        this.option('preprocessor', {
            type: String,
            desc: 'Use css preprocessor'
        });

        this.option('libsass', {
            type: Boolean,
            desc: 'Use libsass'
        });

        this.option('loader', {
            type: String,
            desc: 'Use js loader'
        });

        this.option('critical', {
            type: Boolean,
            desc: 'Use critical css'
        });

        this.option('uncss', {
            type: Boolean,
            desc: 'Use uncss'
        });

        this.props = _.merge({
            symfony: this.env.symfony || {commit: '3.1.5', version: 3.1}
        }, this.options);
    },

    commonTemplatePath: function () {
        var filepath = path.join.apply(path, arguments);

        if (!pathIsAbsolute(filepath)) {
            filepath = path.join(path.join(__dirname, 'templates'), filepath);
        }

        return filepath;
    },

    commonTemplate: function (source, dest, data, options) {
        if (typeof dest !== 'string') {
            options = data;
            data = dest;
            dest = source;
        }

        this.fs.copyTpl(
            this.commonTemplatePath(source),
            this.destinationPath(dest),
            data || this,
            options
        );
        return this;
    },

    /**
     *  initialization methods (checking current project state, getting configs, etc)
     */
    initializing: function () {

    },

    configuring: function () {

    },

    prompting: function () {
        var askLibsass = function (answers) {
            return _.result(answers, 'preprocessor') === 'sass' && this.options.libsass === undefined;
        }.bind(this);

        var prompts = [{
            type: 'list',
            name: 'preprocessor',
            message: 'Would you like to use a CSS preprocessor?',
            when: this.options.preprocessor === undefined,
            choices: [
                {name: 'Sass', value: 'sass'},
                {name: 'Less', value: 'less'},
                {name: 'Stylus', value: 'stylus'},
                {name: 'No Preprocessor', value: 'none'}
            ]
        }, {
            when: askLibsass,
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
            when: this.options.loader === undefined,
            choices: [
                {name: 'SystemJS (jspm)', value: 'jspm'},
                {name: 'Webpack (babel)', value: 'webpack'},
                {name: 'Browserify (babel)', value: 'browserify'}
            ]
        }, {
            type: 'checkbox',
            name: 'additional',
            message: 'Which additional plugins should i integrate for you?',
            when: this.options.critical === undefined && this.options.uncss === undefined,
            choices: [
                {value: 'uncss', name: 'UnCSS - A grunt task for removing unused CSS', checked: true},
                {value: 'critical', name: 'Critical - Extract & Inline Critical-path CSS', checked: true}
            ]
        }];

        return this.prompt(prompts).then(function (props) {
            this.props = _.merge(this.props, props);
        }.bind(this));
    }
});
