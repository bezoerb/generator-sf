'use strict';
const os = require('os');
const path = require('path');
const exec = require('child_process').exec;
const Bluebird = require('bluebird');
const download = require('download');
const chalk = require('chalk');
const fs = require('fs-extra');
const got = require('got');
const YAML = require('yamljs');
const wsfp = require('wsfp');
const _ = require('lodash');
const xdgBasedir = require('xdg-basedir');
const Generator = require('yeoman-generator');
const commands = require('../../../lib/commands');

Bluebird.promisifyAll(fs);

function read(file) {
  return fs.readFileSync(file, 'utf-8');
}

module.exports = Generator.extend({
  /**
   * Get available symfony tags
   *
   * @returns {Promise}
   * @private
   */
  _getSymfonyTags: function () {
    return got('https://symfony.com/versions.json').then(response => {
      if (response.statusCode === 200) {
        this.versions = JSON.parse(response.body);

        this.commits = [
          {name: this.versions.lts + ' (lts)', value: this.versions.lts},
          {name: this.versions.latest + ' (latest)', value: this.versions.latest}
        ];
      } else {
        this.log.error('A problem occurred', response.statusCode);
      }
    });
  },

  _hasAssetic: function () {
    return (this.version || 3) < 2.8;
  },

  _setPermissions: function () {
    return new Promise(resolve => {
      const folder = this.props.version >= 3 ? 'var' : 'app';
      wsfp([folder + '/cache', folder + '/logs'], (err, data) => {
        if (err) {
          this.log('Your system doesn\'t support ACL. Setting permissions via ' + chalk.bold.yellow('umask'));
          this.log('See: http://symfony.com/doc/current/book/installation.html#book-installation-permissions');

          // Without using ACL
          let consoleContents = '';
          if ((this.version || 3) < 2.8) {
            consoleContents = read('app/console').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
            fs.outputFileSync('app/console', consoleContents);
          } else {
            consoleContents = read('bin/console').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
            fs.outputFileSync('bin/console', consoleContents);
          }

          const appContents = read('web/app.php').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
          fs.outputFileSync('web/app.php', appContents);

          const appDevContents = read('web/app_dev.php').replace('<?php', '<?php' + os.EOL + 'umask(0002);');
          fs.outputFileSync('web/app_dev.php', appDevContents);

          return resolve(err);
        }
        return resolve(data);
      });
    });
  },

  constructor: function () {
    this.props = {};

    Generator.apply(this, arguments);

    //     This.option('symfonyStandard', {
    //         type: Boolean,
    //         desc: 'Would you like to use the Symfony "Standard Edition"'
    //     });
    //
    //     this.option('symfonyCommit', {
    //         type: String,
    //         desc: 'Which commit'
    //     });
    //
    //     this.props = _.merge({}, this.options);
  },

  initializing: function () {
    return this._getSymfonyTags();
  },

  prompting: function () {
    this.commit = this.versions.latest;
    this.version = parseFloat(this.commit);

    const symfonyCustom = function (answers) {
      return this.options.symfonyStandard === undefined && !_.result(answers, 'symfonyStandard');
    }.bind(this);

    const prompts = [{
      type: 'confirm',
      name: 'symfonyStandard',
      message: 'Would you like to use the Symfony "Standard Edition" distribution ' + this.commit + ' (latest)',
      when: this.options.symfonyStandard === undefined,
      default: true
    }, {
      type: 'list',
      name: 'symfonyCommit',
      message: 'Which version',
      default: 'lts',
      choices: this.commits,
      when: symfonyCustom
    }];

    return this.prompt(prompts).then(answers => {
      if (answers.symfonyCommit) {
        this.props.commit = answers.symfonyCommit;
        this.props.version = parseFloat(answers.symfonyCommit);
      } else {
        this.props.commit = this.commit;
        this.props.version = this.version;
      }

      this.env.symfony = {
        commit: this.props.commit,
        version: this.props.version
      };
    });
  },

  /**
   * Install symfony base
   *
   * @returns {Promise}
   */
  symfonyBase: function () {
    const source = 'https://github.com/symfony/symfony-standard/archive/v' + this.props.commit + '.zip';
    const dest = this.destinationRoot();
    const cache = path.join(xdgBasedir.cache, 'generator-sf');

    // Will be generated from the zip
    const dirname = 'symfony-standard-' + this.props.commit;
    const log = this.log.write();

    // Check cache first
    return fs.statAsync(path.join(cache, dirname))
      .catch(() => {
        log.info('Fetching %s ...', source)
          .info(chalk.yellow('This might take a few moments'));
        return download(source, cache, {extract: true});
      })
      .then(() => {
        return fs.copyAsync(path.join(cache, dirname) + '/', dest + '/.');
      });
  },

  /**
   * Check for installed composer and prompt for installing composer locally if not found
   */
  checkComposer: function () {
    return new Promise((resolve, reject) => {
      // Check if composer is installed globally
      exec('composer', ['-V'], error => {
        if (error !== null && os.platform() !== 'win32') {
          this.log.write().info('No global composer installation found. Installing composer locally.');
          // Use the secondary installation method as we cannot assume curl is installed
          exec('php -r "readfile(\'https://getcomposer.org/installer\');" | php');
          resolve();
        } else if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  writing: {

    /**
     * Remove assetic
     */
    updateComposerJson: function () {
      const data = this.fs.readJSON(this.destinationPath('composer.json'));
      fs.removeSync(this.destinationPath('composer.json'));

      // Remove assetic
      delete data.require['symfony/assetic-bundle'];

      // Add filerev bundle
      if (this.props.version >= 2.7) {
        data.require['zoerb/filerevbundle'] = '^1.1';
      } else {
        data.require['zoerb/filerevbundle'] = '~0.1.2';
      }

      // Add phpunit
      data['require-dev'] = _.assign(data['require-dev'] || {}, {'phpunit/phpunit': '~4.6'});

      this.fs.writeJSON(this.destinationPath('composer.json'), data);
    },

    dropAssetic: function () {
      if (!this._hasAssetic()) {
        return;
      }

      // Remove assetic from config_dev.yml
      const confDev = YAML.load('app/config/config_dev.yml');
      delete confDev.assetic;
      const newConfDev = YAML.stringify(confDev, 2, 4);
      fs.writeFileSync('app/config/config_dev.yml', newConfDev);

      // Remove assetic from config.yml
      const conf = YAML.load('app/config/config.yml');
      delete conf.assetic;

      const newConf = YAML.stringify(conf, 2, 4);
      fs.writeFileSync('app/config/config.yml', newConf);

      // Remove assetic from app kernel
      const appKernel = read('app/AppKernel.php').replace('new Symfony\\Bundle\\AsseticBundle\\AsseticBundle(),', '');
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
    updateConfig: function () {
      let conf = read('app/config/config.yml').replace(/\[([^"']+)]/igm, '["$1"]');

      // Change parameter names to use dot notation
      conf = conf.replace(/%(database|mailer)_(.*)%/g, '%$1.$2%');

      // Add twig namespaces
      conf = YAML.parse(conf);
      conf.twig = _.assign({}, conf.twig, {
        paths: {
          '%kernel.root_dir%/../web': 'web'
        }
      });
      conf = YAML.stringify(conf, 2, 4);

      fs.writeFileSync('app/config/config.yml', conf);

      // Update routing
      fs.copySync(this.templatePath('routing.yml'), 'app/config/routing.yml');

      // Add node environment for browsersync
      fs.copySync(this.templatePath('config_node.yml'), 'app/config/config_node.yml');
    },

    /**
     * Update parameters.yml.dist to use dot notation
     */
    updateParameters: function () {
      const file = 'app/config/parameters.yml.dist';
      const contents = read(file, 'utf8').replace(/(database|mailer)_(.*):/g, '$1.$2:');
      fs.unlinkSync(file);
      fs.writeFileSync(file, contents);
    },

    /**
     * Update app.php to consider environment variables SYMFONY_ENV and SYMFONY_DEBUG
     * add extend .htaccess with best practices from h5b
     */
    updateApp: function () {
      fs.unlinkSync(this.destinationPath('web/app.php'));
      this.fs.copyTpl(
        this.templatePath('app.php'),
        this.destinationPath('web/app.php'),
        this
      );

      const htaccess = [
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
    updateAppKernel: function () {
      function addBundle(contents, str) {
        return contents.replace(/(\$bundles\s*=\s.*\n(?:[^;]*\n)+)/, '$&            ' + str + '\n');
      }

      let appKernel = read('app/AppKernel.php');

      // Add node env
      if (this.props.version < 2.8) {
        appKernel = appKernel.replace('array(\'dev\', \'test\')', 'array(\'node\', \'dev\', \'test\')');
      } else {
        appKernel = appKernel.replace('[\'dev\', \'test\']', '[\'node\', \'dev\', \'test\']');
      }

      // Add bundle
      appKernel = addBundle(appKernel, 'new Zoerb\\Bundle\\FilerevBundle\\ZoerbFilerevBundle(),');
      fs.writeFileSync('app/AppKernel.php', appKernel);

      this.log().info('FilerevBundle added');
    },

    /**
     * Update default controller to use own template
     */
    updateController: function () {
      const controllerPath = 'src/AppBundle/Controller/DefaultController.php';
      if (fs.existsSync(controllerPath)) {
        fs.unlinkSync(controllerPath);
      }

      fs.copySync(this.templatePath('DefaultController.php'), controllerPath);
    },

    /**
     * Update default controller test to use own template
     */
    updateControllerTest: function () {
      const controllerPath = this.props.version < 3 ?
        'src/AppBundle/Tests/Controller/DefaultControllerTest.php' : 'tests/AppBundle/Controller/DefaultControllerTest.php';
      if (fs.existsSync(controllerPath)) {
        fs.unlinkSync(controllerPath);
      }

      this.fs.copyTpl(
        this.templatePath('DefaultControllerTest.php'),
        this.destinationPath(controllerPath),
        this
      );
    }
  },

  install: function () {
    if (!this.options['skip-install-message'] && Boolean(this.options.skipInstallMessage)) {
      this.log('');
      this.log('Running ' + chalk.bold.yellow('composer update') + ' for you to install the required dependencies.');
    }
    return !this.options.skipInstall && !this.options['skip-install'] && commands.composer(['update']);
  },

  end: function () {
    // Cleanup
    fs.removeSync(this.destinationPath('web/apple-touch-icon.png'));
    fs.removeSync(this.destinationPath('web/favicon.ico'));

    return this._setPermissions();
  }
});
