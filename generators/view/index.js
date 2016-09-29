'use strict';
var os = require('os');
var path = require('path');
var Promise = require('bluebird');
var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var generators = require('yeoman-generator');

Promise.promisifyAll(fs);


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

        var dontUseSass = function (answers) {
            return !hasFeature(answers, 'preprocessor', 'sass');
        };

        var prompts = [ {
            when: useSass,
            type: 'list',
            name: 'framework',
            message: 'Would you like to include a CSS framework?',
            choices: [
                {name: 'UIkit', value: 'uikit'},
                {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                {name: 'Foundation', value: 'foundation'},
                {name: 'Inuit CSS', value: 'inuit'},
                {name: 'No Framework', value: 'noframework'}
            ]
        }, {
            when: dontUseSass,
            type: 'list',
            name: 'framework',
            message: 'Would you like to include a CSS framework?',
            choices: [
                {name: 'UIkit', value: 'uikit'},
                {name: 'Twitter Bootstrap', value: 'bootstrap', checked: true},
                {name: 'Foundation', value: 'foundation'},
                {name: 'No Framework', value: 'noframework'}
            ]
        }];

        return this.prompt(prompts);
    },

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring: function () {
        this.template('editorconfig', '.editorconfig');
        this.template('eslintrc', '.eslintrc');
        this.template('jscsrc', '.jscsrc');
        this.template('bowerrc', '.bowerrc');
    },

    writing: {
        /**
         * Add Service worker config
         */
        serviceWorker: function serviceWorker() {
            this.template('public/service-worker.js', 'app/Resources/public/service-worker.js');
            this.template('public/appcache-loader.html', 'app/Resources/public/appcache-loader.html');
        },

        /**
         * Add Favicon
         */
        favicon: function favicon() {
            this.template('public/browserconfig.xml', 'app/Resources/public/browserconfig.xml');
            this.template('public/favicon.ico', 'app/Resources/public/favicon.ico');
            this.template('public/manifest.json', 'app/Resources/public/manifest.json');
            this.template('public/manifest.webapp', 'app/Resources/public/manifest.webapp');

            return fs.copyAsync(this.templatePath('img/touch'), 'app/Resources/public/img/touch');
        }
    }
});
