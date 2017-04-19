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
                inuitcss: '^6.0.0-beta.4'
            });
        } else {
            this.addBowerDependencies({
                inuitcss: '^6.0.0-beta.4'
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
