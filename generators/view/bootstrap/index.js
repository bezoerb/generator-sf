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

    bower: function() {
        if (this.props.noBower) {
            return;
        }

        var bower = {
            name: _.camelCase(this.appname),
            private: true,
            dependencies: {}
        };

        bower.dependencies['bootstrap-sass-official'] = '~3.3.0';
        bower.dependencies.modernizr = '~3.3.1';

        switch (this.props.preprocessor) {
            case 'sass':
                bower.dependencies['bootstrap-sass-official'] = '~3.3.0';
                break;
            case 'stylus':
                bower.dependencies['bootstrap-stylus'] = '~5.0.2';
                break;
            default:
                bower.dependencies['bootstrap'] = '~3.3.0';
                break;
        }

        if (this.props.loader === 'requirejs') {
            bower.dependencies.requirejs = '~2.2.0';
            bower.dependencies.almond = '~0.3.0';
            bower.dependencies['visionmedia-debug'] = '~2.2.0';
            bower.dependencies['appcache-nanny'] = '~1.0.3';
        }

        this.fs.writeJSON(this.destinationPath('bower.json'), bower);
    },

    writing: function () {
        this.addConfigFiles();
        this.addFavicon();
        this.addServiceWorker();
        this.addStyles();
        this.addScripts();
        this.addTemplates();
    }
});
