'use strict';
var os = require('os');
var path = require('path');
var globby = require('globby');
var Promise = require('bluebird');
var pathIsAbsolute = require('path-is-absolute');
var chalk = require('chalk');
var fs = require('fs-extra');
var _ = require('lodash');
var generators = require('yeoman-generator');

Promise.promisifyAll(fs);

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);

        this.option('base', {
            type: String,
            desc: 'Base path',
            default: 'app/Resources/public'
        });

        this.props = _.merge({
            symfony: this.env.symfony || {commit: '3.1.5', version: 3.1},
            safeAppame: _.camelCase(this.appname)
        }, this.options);

        this.commonRoot = path.join(path.dirname(this.resolved), '..', '_common');
    },

    commonTemplatePath: function commonTemplatePath() {
        var filepath = path.join.apply(path, arguments);

        if (!pathIsAbsolute(filepath)) {
            filepath = path.join(path.join(this.commonRoot , 'templates'), filepath);
        }

        return filepath;
    },

    commonTemplate: function commonTemplate(source, dest, data, options) {
        if (typeof dest !== 'string') {
            options = data;
            data = dest;
            dest = source;
        }

        this.fs.copyTpl(
            path.join(this.commonRoot, 'templates', source),
            this.destinationPath(dest),
            data || this,
            options
        );
        return this;
    },

    /**
     * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
     */
    addConfigFiles: function addConfigFiles() {
        this.commonTemplate('editorconfig', '.editorconfig');
        this.commonTemplate('eslintrc', '.eslintrc');
        this.commonTemplate('jscsrc', '.jscsrc');

        if (!this.props.noBower) {
            this.commonTemplate('bowerrc', '.bowerrc');
        }
    },

    /**
     * Add Service worker config
     */
    addServiceWorker: function addServiceWorker() {
        this.commonTemplate('public/service-worker.js', path.join(this.props.base, 'service-worker.js'));
        this.commonTemplate('public/appcache-loader.html', path.join(this.props.base, 'appcache-loader.html'));
    },

    /**
     * Add Favicon
     */
    addFavicon: function addFavicon() {
        this.commonTemplate('public/browserconfig.xml', path.join(this.props.base, 'browserconfig.xml'));
        this.commonTemplate('public/favicon.ico', path.join(this.props.base, 'favicon.ico'));
        this.commonTemplate('public/manifest.json', path.join(this.props.base, 'manifest.json'));
        this.commonTemplate('public/manifest.webapp', path.join(this.props.base, 'manifest.webapp'));

        return fs.copyAsync(path.join(this.commonRoot, 'templates', 'img/touch'), path.join(this.props.base, 'img/touch'));
    },


    addStyles: function addStyles() {
        var filesMap = {};
        filesMap['sass'] = '**/*.scss';
        filesMap['less'] = '**/*.less';
        filesMap['stylus'] = '**/*.styl';
        filesMap['none'] = '**/*.css';

        var roots = [
            path.join(this.commonRoot, 'templates/styles', filesMap[this.props.preprocessor]),
            path.join(this.templatePath('styles'), filesMap[this.props.preprocessor])
        ];

        globby(roots).then(_.bind(function(paths) {
            _.forEach(paths, _.bind(function (file) {
                this.fs.copyTpl(
                    file,
                    this.destinationPath(path.join(this.props.base, 'styles', file.replace(/^.*styles\//,''))),
                    this
                );
            }, this));
        },this));

        return this;
    },

    /**
     * Add scripts from instance
     */
    addScripts: function addScripts() {
        var roots = [
            path.join(this.commonRoot, 'templates/scripts', this.props.loader,'**/*.js'),
            path.join(this.templatePath('scripts'), this.props.loader,'**/*.js')
        ];

        globby(roots).then(_.bind(function(paths) {
            _.forEach(paths, _.bind(function (file) {
                this.fs.copyTpl(
                    file,
                    this.destinationPath(path.join(this.props.base, 'scripts', file.replace(/^.*scripts\/[^\/]+\//,''))),
                    this
                );
            }, this));
        },this));

        var file = path.join('scripts', 'sw', 'runtime-caching.js');
        this.commonTemplate(file, path.join(this.props.base,  file));

        return this;
    },

    addTemplates: function addTemplates() {
        fs.removeSync(this.destinationPath('app/Resources/views'));
        fs.mkdirsSync(this.destinationPath('app/Resources/views/controller/default'));

        // copy base template
        this.commonTemplate('base.html.twig', path.join(this.props.base, '..', 'views', 'base.html.twig'));

        // copy default action template
        this.template('index.html.twig', path.join(this.props.base, '..', 'views', 'controller', 'default', 'base.html.twig'));

        fs.copySync(this.commonTemplatePath('img'), path.join(this.props.base,'img'));
    }

});
