'use strict';
var os = require('os');
var path = require('path');
var Promise = require('bluebird');
var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var generators = require('yeoman-generator');

Promise.promisifyAll(fs);

function read(file) {
    return fs.readFileSync(file, 'utf-8');
}

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

    },

    /**
     *  initialization methods (checking current project state, getting configs, etc)
     */
    initializing: function () {

    },

    prompting: function () {
        function hasFeature(answers, group, feature) {
            var val = _.result(answers, group);
            return typeof feature !== 'undefined' && (val === feature || _.isArray(val) && _.indexOf(val, feature) !== -1);
        }

        var useSass = function (answers) {
            return hasFeature(answers, 'preprocessor', 'sass');
        };

        var prompts = [{
            type: 'list',
            name: 'preprocessor',
            message: function () {
                this.log('--------------------------------------------------------------------------------');
                return 'Would you like to use a CSS preprocessor?';
            }.bind(this),
            choices: [
                {name: 'Sass', value: 'sass'},
                {name: 'Less', value: 'less'},
                {name: 'Stylus', value: 'stylus'},
                {name: 'No Preprocessor', value: 'nopreprocessor'}
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

        return this.prompt(prompts).then(function (answers) {
            if (answers.symfonyCommit) {
                this.commit = answers.symfonyCommit;
                this.version = parseFloat(this.commit);
            }
        }.bind(this));
    },



    writing: {



    }
});
