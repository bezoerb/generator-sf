'use strict';
var Promise = require('bluebird');
var fs = require('fs-extra');
var _ = require('lodash');
var common = require('../_common');

Promise.promisifyAll(fs);

module.exports = common.extend({
    constructor: function () {
        common.apply(this, arguments);
    },

    configuring: {
        common: function () {
            this.props.noBower = this.props.loader === 'webpack' || this.props.loader === 'browserify' || this.props.loader === 'jspm';
        }
    },

    writing: {
        pkgScripts: function () {
            var pkg = this._readPkg();
            pkg.scripts.test = 'grunt test';
            pkg.scripts.start = 'grunt serve';
            this._writePkg(pkg);
        },
        pkgDev: function () {
            var pkg = this._readPkg();

            if (!this.props.noBower) {
                pkg.devDependencies.bower = '^1.3.12';
            }

            pkg.devDependencies.bower = '^1.3.12';
            pkg.devDependencies.grunt = '^1.0.1';
            pkg.devDependencies.chalk = '^1.1.1';
            pkg.devDependencies.lodash = '^4.6.1';
            pkg.devDependencies.eslint = '^3.7.1';
            pkg.devDependencies['eslint-config-xo'] = '^0.17.0';
            pkg.devDependencies['grunt-eslint'] = '^19.0.0';
            pkg.devDependencies['grunt-available-tasks'] = '^0.6.1';
            pkg.devDependencies['grunt-browser-sync'] = '^2.0.0';
            pkg.devDependencies['grunt-contrib-clean'] = '^1.0.0';
            pkg.devDependencies['grunt-contrib-copy'] = '^1.0.0';
            pkg.devDependencies['grunt-contrib-cssmin'] = '^1.0.0';
            pkg.devDependencies['grunt-sw-precache'] = '^1.0.3';
            pkg.devDependencies['sw-toolbox'] = '^3.0.1';
            pkg.devDependencies['appcache-nanny'] = '^1.0.3';
            pkg.devDependencies['grunt-appcache'] = '^0.2.0';
            pkg.devDependencies['grunt-contrib-imagemin'] = '^1.0.0';
            pkg.devDependencies['grunt-autoprefixer'] = '^3.0.0';
            pkg.devDependencies['grunt-contrib-watch'] = '^1.0.0';
            pkg.devDependencies['grunt-filerev'] = '^2.1.2';
            pkg.devDependencies['grunt-svgmin'] = '^4.0.0';
            pkg.devDependencies['grunt-svgstore'] = '^1.0.0';
            pkg.devDependencies['grunt-usemin'] = '^3.0.0';
            pkg.devDependencies['grunt-phpunit'] = '^0.3.6';
            pkg.devDependencies['jit-grunt'] = '^0.10.0';
            pkg.devDependencies['grunt-exec'] = '^1.0.1';
            pkg.devDependencies.parseurl = '^1.3.0';
            pkg.devDependencies['php-proxy-middleware'] = '^1.0.1';
            pkg.devDependencies['load-grunt-config'] = '^0.19.0';
            pkg.devDependencies['core-js'] = '^2.4.0';
            pkg.devDependencies.chai = '^3.3.0';
            pkg.devDependencies.karma = '^1.3.0';
            pkg.devDependencies.mocha = '^3.1.2';
            pkg.devDependencies['grunt-karma'] = '^2.0.0';
            pkg.devDependencies['karma-chai'] = '^0.1.0';
            pkg.devDependencies['karma-coverage'] = '^1.0.0';
            pkg.devDependencies['karma-mocha'] = '^1.0.1';
            pkg.devDependencies['karma-mocha-reporter'] = '^2.0.0';
            pkg.devDependencies['karma-phantomjs-launcher'] = '^1.0.0';
            pkg.devDependencies['time-grunt'] = '^1.1.0';
            pkg.devDependencies['phantomjs-prebuilt'] = '>=1.9';
            pkg.devDependencies.slash = '^1.0.0';
            pkg.devDependencies['fs-extra'] = '^1.0.0';

            // css preprocessors
            if (this.props.preprocessor === 'sass' && !this.props.libsass) {
                pkg.devDependencies['grunt-contrib-sass'] = '^1.0.0';
            } else if (this.props.preprocessor === 'sass') {
                pkg.devDependencies['grunt-sass'] = '^1.0.0';
            } else if (this.props.preprocessor === 'less') {
                pkg.devDependencies['grunt-contrib-less'] = '^1.0.0';
            } else if (this.props.preprocessor === 'stylus') {
                pkg.devDependencies.nib = '^1.1.0';
                pkg.devDependencies['grunt-contrib-stylus'] = '^1.1.0';
            } else if (this.props.preprocessor === 'none') {
                pkg.devDependencies['grunt-contrib-concat'] = '^1.0.0';
            }

            // js loader
            if (this.props.loader === 'jspm') {
                pkg.devDependencies.jspm = '^0.16.19';
                pkg.devDependencies['grunt-contrib-uglify'] = '^2.0.0';
                pkg.devDependencies['karma-jspm'] = '^2.0.1';
                pkg.devDependencies.systemjs = '^0.19.3';
                pkg.devDependencies['babel-cli'] = '^6.16.0';
                pkg.devDependencies['es6-module-loader'] = '^0.17.6';
                pkg.devDependencies['phantomjs-polyfill'] = '0.0.2';
            } else if (this.props.loader === 'webpack') {
                pkg.devDependencies['babel-cli'] = '^6.16.0';
                pkg.devDependencies['babel-core'] = '^6.6.5';
                pkg.devDependencies['babel-loader'] = '^6.2.4';
                pkg.devDependencies['babel-runtime'] = '^6.6.1';
                pkg.devDependencies['babel-preset-es2015'] = '^6.6.0';
                pkg.devDependencies['babel-preset-stage-2'] = '^6.18.0';
                pkg.devDependencies['grunt-webpack'] = '^1.0.11';
                pkg.devDependencies.webpack = '^1.12.2';
                pkg.devDependencies['webpack-dev-server'] = '^1.12.1';
                pkg.devDependencies['webpack-dev-middleware'] = '^1.2.0';
                pkg.devDependencies['webpack-hot-middleware'] = '^2.4.1';
                pkg.devDependencies['json-loader'] = '^0.5.3';
                pkg.devDependencies['karma-webpack'] = '^1.7.0';
                pkg.devDependencies['monkey-hot-loader'] = '0.0.3';
            } else if (this.props.loader === 'browserify') {
                pkg.devDependencies['babel-cli'] = '^6.16.0';
                pkg.devDependencies['babel-core'] = '^6.6.5';
                pkg.devDependencies['babel-preset-es2015'] = '^6.6.0';
                pkg.devDependencies['babel-preset-stage-2'] = '^6.18.0';
                pkg.devDependencies['babel-runtime'] = '^6.6.1';
                pkg.devDependencies.babelify = '^7.2.0';
                pkg.devDependencies.browserify = '^13.0.0';
                pkg.devDependencies.watchify = '^3.7.0';
                pkg.devDependencies.deamdify = '^0.2.0';
                pkg.devDependencies.debowerify = '^1.4.1';
                pkg.devDependencies.rollupify = '^0.3.4';
                pkg.devDependencies['grunt-browserify'] = '^5.0.0';
                pkg.devDependencies['karma-browserify'] = '^5.0.2';
                pkg.devDependencies['karma-babel-preprocessor'] = '^6.0.1';
                pkg.devDependencies['grunt-contrib-uglify'] = '^1.0.0';
            }

            if (this.props.uncss) {
                pkg.devDependencies['grunt-uncss'] = '^0.5.0';
            }
            if (this.props.critical) {
                pkg.devDependencies['grunt-critical'] = '^0.2.0';
            }
            if (this.props.uncss || this.props.critical) {
                pkg.devDependencies['grunt-contrib-connect'] = '^1.0.0';
                pkg.devDependencies['get-port'] = '^2.1.0';
                pkg.devDependencies['grunt-http'] = '^2.0.1';
            }

            this._writePkg(pkg);
        },

        pkgJspm: function () {
            if (this.props.loader !== 'jspm') {
                return;
            }

            var pkg = this._readPkg();

            pkg.jspm = {
                directories: {
                    lib: 'app/Resources/public/scripts'
                },
                configFile: 'app/Resources/public/scripts/config.js',
                dependencies: {
                    debug: 'npm:debug@^2.2.0',
                    'appcache-nanny': 'npm:appcache-nanny@^1.0.3',
                    jquery: 'npm:jquery@^2.2.1',
                    picturefill: 'npm:picturefill@^3.0.1',
                    svg4everybody: 'npm:svg4everybody@^2.1.0'
                },
                devDependencies: {
                    babel: 'npm:babel-core@^5.8.34',
                    'babel-runtime': 'npm:babel-runtime@^5.8.34',
                    'core-js': 'npm:core-js@^1.1.4'
                }
            };

            if (this.props.view === 'bootstrap') {
                pkg.jspm.dependencies.bootstrap = 'github:twbs/bootstrap@^3.3.4';
            } else if (this.props.view === 'foundation') {
                pkg.jspm.dependencies.bootstrap = 'npm:foundation-sites@^6.2.0';
            } else if (this.props.view === 'uikit') {
                pkg.jspm.dependencies.uikit = 'github:uikit/uikit@2.26.2';
            }

            this._writePkg(pkg);
        },

        grunt: function () {
            this.pkg = this._readPkg();

            this.template('Gruntfile.js', 'Gruntfile.js');
            fs.mkdirsSync(this.destinationPath('grunt'));

            // first all basic tasks for every configuration
            this.template('grunt/aliases.js', 'grunt/aliases.js');
            this.template('grunt/clean.js', 'grunt/clean.js');
            this.template('grunt/watch.js', 'grunt/watch.js');
            this.template('grunt/autoprefixer.js', 'grunt/autoprefixer.js');
            this.template('grunt/cssmin.js', 'grunt/cssmin.js');
            this.template('grunt/copy.js', 'grunt/copy.js');
            this.template('grunt/exec.js', 'grunt/exec.js');
            this.template('grunt/filerev.js', 'grunt/filerev.js');
            this.template('grunt/usemin.js', 'grunt/usemin.js');
            this.template('grunt/eslint.js', 'grunt/eslint.js');
            this.template('grunt/imagemin.js', 'grunt/imagemin.js');
            this.template('grunt/svgmin.js', 'grunt/svgmin.js');
            this.template('grunt/svgstore.js', 'grunt/svgstore.js');
            this.template('grunt/browserSync.js', 'grunt/browserSync.js');
            this.template('grunt/phpunit.js', 'grunt/phpunit.js');
            this.template('grunt/availabletasks.js', 'grunt/availabletasks.js');
            this.template('grunt/sw-precache.js', 'grunt/sw-precache.js');
            this.template('grunt/appcache.js', 'grunt/appcache.js');

            // css
            switch (this.props.preprocessor) {
                case 'none':
                    this.template('grunt/concat.js', 'grunt/concat.js');
                    break;
                case 'sass':
                    this.template('grunt/sass.js', 'grunt/sass.js');
                    break;
                case 'less':
                    this.template('grunt/less.js', 'grunt/less.js');
                    break;
                case 'stylus':
                    this.template('grunt/stylus.js', 'grunt/stylus.js');
                    break;
                default:
                    break;
            }

            if (this.props.uncss || this.props.critical) {
                this.template('grunt/connect.js', 'grunt/connect.js');
                this.template('grunt/http.js', 'grunt/http.js');
            }

            if (this.props.uncss) {
                this.template('grunt/uncss.js', 'grunt/uncss.js');
            }
            if (this.props.critical) {
                this.template('grunt/critical.js', 'grunt/critical.js');
            }

            // js
            this.template('grunt/karma.js', 'grunt/karma.js');

            switch (this.props.loader) {
                case 'jspm':
                    this.template('grunt/uglify.js', 'grunt/uglify.js');
                    break;
                case 'webpack':
                    this.template('grunt/webpack.js', 'grunt/webpack.js');
                    this.commonTemplate('webpack.config.js', 'webpack.config.js');
                    break;
                case 'browserify':
                    this.template('grunt/browserify.js', 'grunt/browserify.js');
                    this.template('grunt/uglify.js', 'grunt/uglify.js');
                    break;
                default:
                    break;
            }
        }
    }
});
