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

        bower.dependencies.picturefill = '~3.0.1';
        bower.dependencies.modernizr = '~3.3.1';
        bower.dependencies.jquery = '~2.2.1';
        bower.dependencies['inuit-starter-kit'] = '~0.2.9';
        bower.dependencies['inuit-widths'] = '~0.4.2';
        bower.dependencies['inuit-clearfix'] = '~0.2.2';
        bower.dependencies['inuit-layout'] = '~0.3.2';
        bower.dependencies['inuit-spacing'] = '~0.7.0';
        bower.dependencies['inuit-images'] = '~0.3.3';
        bower.dependencies['inuit-reset'] = '~0.1.1';
        bower.dependencies['inuit-headings'] = '~0.3.1';
        bower.dependencies['inuit-media'] = '~0.4.2';
        bower.dependencies['inuit-shared'] = '~0.1.5';
        bower.dependencies['inuit-box'] = '~0.4.4';
        bower.dependencies['inuit-buttons'] = '~0.4.2';
        bower.dependencies['inuit-lists'] = '~0.1.0';
        bower.dependencies['inuit-responsive-tools'] = '~0.1.3';
        bower.dependencies['inuit-flag'] = '~0.3.2';
        bower.dependencies['inuit-widths-responsive'] = '~0.2.2';
        bower.dependencies['inuit-paragraphs'] = '~0.1.4';
        bower.dependencies['inuit-tables'] = '~0.2.1';
        bower.dependencies['inuit-tabs'] = '~0.2.1';
        bower.dependencies['inuit-list-inline'] = '~0.3.2';
        bower.dependencies['inuit-list-ui'] = '~0.4.1';

        // add standalone glyphicons if bootstrap is not used
        bower.dependencies['sass-bootstrap-glyphicons'] = '~1.0.0';

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
