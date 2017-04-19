'use strict';
var common = require('../_common');

module.exports = common.extend({
    constructor: function () {
        common.apply(this, arguments);
    },

    /**
     *  Initialization methods (checking current project state, getting configs, etc)
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
                uikit: '^2.25.0'
            });
        } else {
            this.addBowerDependencies({
                uikit: '~2.26.2'
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
        this.addFonts();
    }
});
