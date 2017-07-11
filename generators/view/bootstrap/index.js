'use strict';
const common = require('../_common');

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
      switch (this.props.preprocessor) {
        case 'sass':
          this.addNpmDependencies({'bootstrap-sass': '^3.3.6'});
          break;
        case 'stylus':
          this.addNpmDependencies({'bootstrap-styl': '~5.0.5'});
          break;
        default:
          this.addNpmDependencies({bootstrap: '~3.3.5'});
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
          this.addBowerDependencies({bootstrap: '~3.3.0'});
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
    this.addFonts();
  }
});
