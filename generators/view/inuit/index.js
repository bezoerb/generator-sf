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
            this.addNpmDependencies({
                'inuit-starter-kit': '~0.2.9',
                'inuit-widths': '~0.4.2',
                'inuit-clearfix': '~0.2.2',
                'inuit-layout': '~0.3.2',
                'inuit-spacing': '~0.7.0',
                'inuit-images': '~0.3.3',
                'inuit-reset': '~0.1.1',
                'inuit-headings': '~0.3.1',
                'inuit-media': '~0.4.2',
                'inuit-shared': '~0.1.5',
                'inuit-box': '~0.4.4',
                'inuit-buttons': '~0.4.2',
                'inuit-lists': '~0.1.0',
                'inuit-responsive-tools': '~0.1.3',
                'inuit-flag': '~0.3.2',
                'inuit-widths-responsive': '~0.2.2',
                'inuit-paragraphs': '~0.1.4',
                'inuit-tables': '~0.2.1',
                'inuit-tabs': '~0.2.1',
                'inuit-list-inline': '~0.3.2',
                'inuit-list-ui': '~0.4.1',
                'bootstrap': '~3.3.5'
            });
        } else {
            this.addBowerDependencies({
                'inuit-starter-kit': '~0.2.9',
                'inuit-widths': '~0.4.2',
                'inuit-clearfix': '~0.2.2',
                'inuit-layout': '~0.3.2',
                'inuit-spacing': '~0.7.0',
                'inuit-images': '~0.3.3',
                'inuit-reset': '~0.1.1',
                'inuit-headings': '~0.3.1',
                'inuit-media': '~0.4.2',
                'inuit-shared': '~0.1.5',
                'inuit-box': '~0.4.4',
                'inuit-buttons': '~0.4.2',
                'inuit-lists': '~0.1.0',
                'inuit-responsive-tools': '~0.1.3',
                'inuit-flag': '~0.3.2',
                'inuit-widths-responsive': '~0.2.2',
                'inuit-paragraphs': '~0.1.4',
                'inuit-tables': '~0.2.1',
                'inuit-tabs': '~0.2.1',
                'inuit-list-inline': '~0.3.2',
                'inuit-list-ui': '~0.4.1',
                'bootstrap': '~3.3.5'
            });
        }
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
