'use strict';
var os = require('os');
var path = require('path');
var Promise = require('bluebird');
var decompress = require('decompress');
var download = require('download');
var chalk = require('chalk');
var fs = require('fs-extra');
var got = require('got');
var exec = require('child_process').exec;
var yaml = require('js-yaml');
var _ = require('lodash');
var xdgBasedir = require('xdg-basedir');
var generators = require('yeoman-generator');


Promise.promisifyAll(fs);

function read(file) {
    return fs.readFileSync(file, 'utf-8');
}

module.exports = generators.Base.extend({

    _composer: function (args) {
        var cmd = 'composer';
        if (!this.globalComposer) {
            args.unshift('composer.phar');
            cmd = 'php';
        }

        return new Promise(function (resolve, reject) {
            this.spawnCommand(cmd, args, {}).on('error', reject).on('exit', resolve);
        }.bind(this));
    },

    /**
     * Get available symfony tags
     *
     * @returns {Promise}
     * @private
     */
    _getSymfonyTags: function () {
        return got('https://symfony.com/versions.json').then(function (response) {
            if (response.statusCode === 200) {
                this.versions = JSON.parse(response.body);

                this.commits = [
                    {name: this.versions['lts'] + ' (lts)', value: this.versions['lts']},
                    {name: this.versions['latest'] + ' (latest)', value: this.versions['latest']}
                ];
            } else {
                this.log.error('A problem occurred', response.statusCode);
            }
        }.bind(this));
    },

    _hasAssetic: function _hasAssetic() {
        return (this.version || 3) < 2.8;
    },

    _isDeprecated: function _isDeprecated() {
        return (this.version || 3) < 3;
    },


    constructor: function () {
        this.props = {};
        generators.Base.apply(this, arguments);
    },

    initializing: function () {
        return this._getSymfonyTags();
    },

    prompting: function () {


        this.commit = this.versions['latest'];
        this.version = parseFloat(this.commit);

        var symfonyCustom = function (answers) {
            return !_.result(answers, 'symfonyStandard');
        };

        var prompts = [{
            type: 'confirm',
            name: 'symfonyStandard',
            message: 'Would you like to use the Symfony "Standard Edition" distribution ' + this.commit + ' (latest)',
            default: true
        }, {
            type: 'list',
            name: 'symfonyCommit',
            message: 'Commit (commit/branch/tag)',
            default: 'lts',
            choices: this.commits,
            when: symfonyCustom
        }];

        return this.prompt(prompts).then(function (answers) {
            if (answers.symfonyCommit) {
                this.props.commit = answers.symfonyCommit;
                this.props.version = parseFloat(this.commit);
            } else {
                this.props.commit = this.commit;
                this.props.version = this.version;
            }

            this.env.symfony = this.props;

        }.bind(this));
    },

    /**
     * Install symfony base
     *
     * @returns {Promise}
     */
    symfonyBase: function () {

        var source = 'https://github.com/symfony/symfony-standard/archive/v' + this.commit + '.zip';
        var dest = this.destinationRoot();
        var cache = path.join(xdgBasedir.cache, 'generator-sf');

        // will be generated from the zip
        var dirname = 'symfony-standard-' + this.commit;
        var log = this.log.write();

        // check cache first
        return fs.statAsync(path.join(cache, dirname))
            .catch(function(){
                log.info('Fetching %s ...', source)
                   .info(chalk.yellow('This might take a few moments'));
                return download(source,cache, {extract: true})
            })
            .then(function() {
                return fs.copyAsync(path.join(cache, dirname) + '/', dest + '/.');
            });
    },

    /**
     * Check for installed composer and prompt for installing composer locally if not found
     */
    checkComposer: function checkComposer() {
        this.globalComposer = false;

        return new Promise(function (resolve, reject) {
            // Check if composer is installed globally
            exec('composer', ['-V'], function (error) {
                if (error !== null && os.platform() !== 'win32') {
                    this.log.write().info('No global composer installation found. Installing composer locally.');
                    // Use the secondary installation method as we cannot assume curl is installed
                    exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php');
                    resolve();
                } else if (error !== null) {
                    reject(error);
                } else {
                    this.globalComposer = true;
                    resolve();
                }
            }.bind(this));
        }.bind(this));
    },

    writing: {

        /**
         * remove assetic
         */
        updateComposerJson: function () {
            var data = this.fs.readJSON(this.destinationPath('composer.json'));

            // remove assetic
            delete data.require['symfony/assetic-bundle'];

            // add filerev bundle
            if (this.props.version >= 2.7) {
                data.require['zoerb/filerevbundle'] = '~1.0.1';
            } else {
                data.require['zoerb/filerevbundle'] = '~0.1.2';
            }

            // add phpunit
            data['require-dev'] = _.assign(data['require-dev'] || {}, {'phpunit/phpunit': '~4.6'});

            this.fs.writeJSON(this.destinationPath('composer.json'), data);
        },

        dropAssetic: function dropAssetic() {
            if (!this._hasAssetic()) {
                return;
            }

            // remove assetic from config_dev.yml
            var confDev = yaml.safeLoad(read('app/config/config_dev.yml'));
            delete confDev.assetic;
            var newConfDev = yaml.dump(confDev, {indent: 4});
            fs.writeFileSync('app/config/config_dev.yml', newConfDev);

            // remove assetic from config.yml
            var conf = yaml.safeLoad(read('app/config/config.yml'));
            delete conf.assetic;
            var newConf = yaml.dump(conf, {indent: 4});
            fs.writeFileSync('app/config/config.yml', newConf);

            // remove assetic from app kernel
            var appKernel = read('app/AppKernel.php').replace('new Symfony\\Bundle\\AsseticBundle\\AsseticBundle(),', '');
            fs.writeFileSync('app/AppKernel.php', appKernel);

            return this._composer(['remove', 'symfony/assetic-bundle']);

        },

        /**
         * Update symfony config
         *
         *  - remove assetic configuration
         *  - update parameters to use proposed dot notation
         *    @see http://symfony.com/doc/current/cookbook/configuration/external_parameters.html
         */
        updateConfig: function updateConfig() {
            var conf = read('app/config/config.yml').replace(/\[([^"']+)\]/igm, '["$1"]');

            // change parameter names to use dot notation
            conf = conf.replace(/%(database|mailer)_(.*)%/g, '%$1.$2%');
            fs.writeFileSync('app/config/config.yml', conf);

            // update routing
            fs.copySync(this.templatePath('routing.yml'), 'app/config/routing.yml');

            // add node environment for browsersync
            fs.copySync(this.templatePath('config_node.yml'), 'app/config/config_node.yml');
        },

        /**
         * update parameters.yml.dist to use dot notation
         */
        updateParameters: function updateParameters() {
            var file = 'app/config/parameters.yml.dist';
            var contents = read(file, 'utf8').replace(/(database|mailer)_(.*):/g, '$1.$2:');
            fs.unlinkSync(file);
            fs.writeFileSync(file, contents);
        },

        /**
         * update app.php to consider environment variables SYMFONY_ENV and SYMFONY_DEBUG
         * add extend .htaccess with best practices from h5b
         */
        updateApp: function updateApp() {
            fs.unlinkSync(this.destinationPath('web/app.php'));
            this.template('app.php', 'web/app.php');

            var htaccess = [
                read(this.destinationPath('web/.htaccess'), 'utf8'),
                read(this.templatePath('_htaccess'), 'utf8')
            ];

            fs.writeFileSync(this.destinationPath('web/.htaccess'), htaccess.join('\n'), 'utf8');
        },

        /**
         * Update AppKernel
         *
         *  - remove assetic
         *  - add "node" as dev environment
         *
         * see http://symfony.com/doc/current/best_practices/web-assets.html
         */
        updateAppKernel: function updateAppKernel() {
            function addBundle(contents, str) {
                return contents.replace(/(\$bundles\s*=\s.*\n(?:[^;]*\n)+)/, '$&            ' + str + '\n');
            }

            var appKernel = read('app/AppKernel.php');

            // add bundle
            appKernel = addBundle(appKernel, 'new Zoerb\\Bundle\\FilerevBundle\\ZoerbFilerevBundle(),');
            fs.writeFileSync('app/AppKernel.php', appKernel);

            this.log().info('FilerevBundle added');
        }
    },

    install: function () {
        this.log('');
        this.log('Running ' + chalk.bold.yellow('composer update') + ' for you to install the required dependencies.');
        this._composer(['update']);
    }
});
