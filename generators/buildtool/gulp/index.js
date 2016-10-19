'use strict';
var common = require('../_common');

module.exports = common.Base.extend({
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
            pkg.scripts.test = 'gulp test';
        },
        pkgDev: function () {
            var pkg = this._readPkg();

            if (!this.props.noBower) {
                pkg.devDependencies.bower = '^1.3.12';
            }

            pkg.devDependencies['jquery'] = '^3.1.1';
            pkg.devDependencies['picturefill'] = '^3.0.2';
            pkg.devDependencies['psi'] = '^2.0.2';
            pkg.devDependencies['critical'] = '^0.8.0';
            pkg.devDependencies['del'] = '^2.2.2';
            pkg.devDependencies['gulp'] = '^3.9.1';

            pkg.devDependencies['browser-sync'] = '^2.9.0';
            pkg.devDependencies['gulp-autoprefixer'] = '^3.1.1';
            pkg.devDependencies['gulp-babel'] = '^6.1.2';
            pkg.devDependencies['gulp-cache'] = '^0.4.5';
            pkg.devDependencies['gulp-cached'] = '^1.1.0';
            pkg.devDependencies['gulp-concat'] = '^2.5.2';
            pkg.devDependencies['gulp-connect'] = '^5.0.0';
            pkg.devDependencies['gulp-eslint'] = '^3.0.1';
            pkg.devDependencies['gulp-if'] = '^2.0.1';
            pkg.devDependencies['gulp-imagemin'] = '^3.0.3';
            pkg.devDependencies['gulp-load-plugins'] = '^1.3.0';
            pkg.devDependencies['gulp-minify-css'] = '^1.1.6';
            pkg.devDependencies['gulp-minify-html'] = '^1.0.6';
            pkg.devDependencies['gulp-newer'] = '^1.3.0';
            pkg.devDependencies['gulp-phpunit'] = '^0.21.4';
            pkg.devDependencies['gulp-postcss'] = '^6.1.0';
            pkg.devDependencies['gulp-remote-src'] = '^0.4.0';
            pkg.devDependencies['gulp-rev'] = '^7.1.2';
            pkg.devDependencies['gulp-rev-replace'] = '^0.4.2';
            pkg.devDependencies['gulp-sass'] = '^2.0.0';
            pkg.devDependencies['gulp-size'] = '^2.1.0';
            pkg.devDependencies['gulp-sourcemaps'] = '^2.1.1';
            pkg.devDependencies['gulp-svgmin'] = '^1.2.0';
            pkg.devDependencies['gulp-uglify'] = '^2.0.0';
            pkg.devDependencies['gulp-useref'] = '^3.1.2';
            pkg.devDependencies['gulp-util'] = '^3.0.7';
            pkg.devDependencies['require-dir'] = '^0.3.0';
            pkg.devDependencies['run-sequence'] = '^1.0.1';
            pkg.devDependencies['sw-precache'] = '^4.1.0';

            pkg.devDependencies['eslint-config-xo'] = '^0.17.0';

            pkg.devDependencies['sw-toolbox'] = '^3.0.1';
            pkg.devDependencies['appcache-nanny'] = '^1.0.3';
            pkg.devDependencies.parseurl = '^1.3.0';
            pkg.devDependencies['php-proxy-middleware'] = '^1.0.1';
            pkg.devDependencies.chai = '^3.3.0';
            pkg.devDependencies.karma = '^1.3.0';
            pkg.devDependencies.mocha = '^3.1.2';
            pkg.devDependencies['karma-chai'] = '^0.1.0';
            pkg.devDependencies['karma-coverage'] = '^1.0.0';
            pkg.devDependencies['karma-mocha'] = '^1.0.1';
            pkg.devDependencies['karma-mocha-reporter'] = '^2.0.0';
            pkg.devDependencies['karma-phantomjs-launcher'] = '^1.0.0';
            pkg.devDependencies['phantomjs-prebuilt'] = '>=1.9';
            pkg.devDependencies.slash = '^1.0.0';
            pkg.devDependencies['fs-extra'] = '^0.30.0';

            // css preprocessors
            if (this.props.preprocessor === 'sass' && !this.props.libsass) {
                pkg.devDependencies['gulp-ruby-sass'] = '^2.1.0';
            } else if (this.props.preprocessor === 'sass') {
                pkg.devDependencies['gulp-sass'] = '^2.3.2';
            } else if (this.props.preprocessor === 'less') {
                pkg.devDependencies['gulp-less'] = '^3.1.0';
            } else if (this.props.preprocessor === 'stylus') {
                pkg.devDependencies.nib = '^1.1.0';
                pkg.devDependencies['gulp-stylus'] = '^2.5.0';
            } else if (this.props.preprocessor === 'none') {
                pkg.devDependencies['gulp-concat'] = '^2.6.0';
            }

            // js loader
            if (this.props.loader === 'jspm') {
                pkg.devDependencies.jspm = '^0.16.19';
                pkg.devDependencies['gulp-uglify'] = '^2.0.0';
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
                pkg.devDependencies['babel-preset-stage-2'] = '^6.17.0';
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
                pkg.devDependencies['babel-preset-stage-2'] = '^6.17.0';
                pkg.devDependencies['babel-runtime'] = '^6.6.1';
                pkg.devDependencies.babelify = '^7.2.0';
                pkg.devDependencies.browserify = '^13.0.0';
                pkg.devDependencies.watchify = '^3.7.0';
                pkg.devDependencies.deamdify = '^0.2.0';
                pkg.devDependencies.debowerify = '^1.4.1';
                pkg.devDependencies.rollupify = '^0.3.4';
                pkg.devDependencies['karma-browserify'] = '^5.0.2';
                pkg.devDependencies['karma-babel-preprocessor'] = '^6.0.1';
                pkg.devDependencies['gulp-uglify'] = '^2.0.0';
            }

            if (this.props.uncss) {
                pkg.devDependencies['gulp-uncss'] = '^1.0.0';
            }
            if (this.props.critical) {
                pkg.devDependencies.critical = '^0.8.0';
            }
            if (this.props.uncss || this.props.critical) {
                pkg.devDependencies['gulp-connect'] = '^5.0.0';
                pkg.devDependencies['get-port'] = '^2.1.0';
                pkg.devDependencies.got = '^2.5.0';
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
                    picturefill: 'npm:picturefill@^3.0.1'
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

            this.template('gulpfile.babel.js', 'gulpfile.babel.js');
            fs.mkdirsSync(this.destinationPath('gulp'));

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
            switch (this.options.preprocessor) {
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

            if (this.options.uncss || this.options.critical) {
                this.template('grunt/connect.js', 'grunt/connect.js');
                this.template('grunt/http.js', 'grunt/http.js');
            }

            if (this.options.uncss) {
                this.template('grunt/uncss.js', 'grunt/uncss.js');
            }
            if (this.options.critical) {
                this.template('grunt/critical.js', 'grunt/critical.js');
            }

            // js
            this.template('grunt/karma.js', 'grunt/karma.js');

            switch (this.options.loader) {
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
