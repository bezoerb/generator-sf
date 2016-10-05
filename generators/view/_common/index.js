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

        this.props = _.merge({
            symfony: this.env.symfony || {commit: '3.1.5', version: 3.1}
        }, this.options);
    },

    /**
     *  initialization methods (checking current project state, getting configs, etc)
     */
    initializing: function () {

    },

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    metaFiles: function metaFiles() {
        this.template('editorconfig', '.editorconfig');
        this.template('eslintrc', '.eslintrc');
        this.template('jscsrc', '.jscsrc');
        this.template('bowerrc', '.bowerrc');
    },

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
});
