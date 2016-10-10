'use strict';
var os = require('os');
var path = require('path');
var Promise = require('bluebird');
var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var common = require('../_common');


Promise.promisifyAll(fs);


module.exports = common.extend({
    constructor: function () {
        common.apply(this, arguments);

    },

    /**
     *  initialization methods (checking current project state, getting configs, etc)
     */
    initializing: function () {

    },

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    configuring: function () {

    },

    dependencies: function () {
        if (this.props.noBower) {
            switch (this.props.preprocessor) {
                case 'sass':
                    this.addNpmDependencies({'bootstrap-sass': '^3.3.6'});
                    break;
                case 'stylus':
                    this.addNpmDependencies({'bootstrap-styl': '~5.0.5'});
                    break;
                default:
                    this.addNpmDependencies({'bootstrap': '~3.3.5'});
                    break;
            }
        } else {
            switch (this.props.preprocessor) {
                case 'sass':
                    this.addBowerDependencies({'bootstrap-sass-official': '~3.3.0'});
                    break;
                case 'stylus':
                    this.addBowerDependencies({'bootstrap-stylus': '~5.0.2'});
                    break;
                default:
                    this.addBowerDependencies({'bootstrap': '~3.3.0'});
                    break;
            }
        }
    },

    writing: function () {
        this.addConfigFiles();
        this.addFavicon();
        this.addServiceWorker();
        this.addStyles();
        this.addScripts();
        this.addTemplates();
    },

    end: function () {
        this.addFonts();
    }
});
