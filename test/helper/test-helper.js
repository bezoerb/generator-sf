'use strict';
const path = require('path');
const exec = require('child_process').exec;
const os = require('os');
const Bluebird = require('bluebird');
const debug = require('debug')('yeoman:generator-sf');
const helpers = require('yeoman-test');
const chalk = require('chalk');
const indentString = require('indent-string');
const assert = require('yeoman-assert');
const _ = require('lodash');
const fs = require('fs-extra');
const assign = require('lodash/assign');
const chai = require('chai');
const files = require('./file-helper');
const fixtureHelper = require('./fixtures-helper');

const withComposer = fixtureHelper.withComposer;
const withJspm = fixtureHelper.withJspm;

const expect = chai.expect;

const base = path.join(__dirname, '..', 'fixtures');
const target = path.join(__dirname, '..', 'temp');
const removeDir = Bluebird.promisify(fs.remove);

function log(text) {
  process.stdout.write(indentString(chalk.grey(text), 6));
}

function markDone(data) {
  process.stdout.write(os.EOL);
  return data;
}

function cleanup() {
  return removeDir(target);
}

function prompts2String(promts) {
  return _.reduce(promts, (res, curr, key) => {
    if (_.indexOf(['symfonyStandard', 'continue'], key) >= 0) {
      return res;
    }
    res.push(key + ': ' + chalk.yellow(curr));
    return res;
  }, []);
}

/**
 * Helper function to test grunt task for don't throwning an error
 * @param task
 * @returns {Bluebird}
 */
function runTask(tool, task) {
  if (tool === 'gulp') {
    const p = path.resolve(__dirname, '..', 'temp');
    tool = 'gulp --cwd ' + p + ' --gulpfile ' + path.join(p, 'gulpfile.babel.js');
  }
  return new Bluebird((resolve, reject) => {
    debug(tool + ' ' + task);
    exec(tool + ' ' + task + ' --no-color', (error, stdout, stderr) => {
      debug('stderr:', stderr);
      debug('stdout:', stdout);
      if (error) {
        log(os.EOL + stdout + os.EOL);
        reject(error);
      }

      expect(error).to.be.null; // eslint-disable-line no-unused-expressions
      expect(stdout).to.contain(tool === 'grunt' ? 'Done.' : 'Finished');
      resolve(stdout);
    });
  });
}

/**
 * Run generator
 *
 * @param prompts
 * @returns {Bluebird}
 */
function install(prompts) {
  const opts = prompts2String(prompts);
  process.stdout.write(os.EOL + indentString('running app with ' + opts.join(', '), 4) + os.EOL);
  debug(path.join(__dirname, '../../generators/app'), target);
  return Bluebird.resolve(helpers.run(path.join(__dirname, '../../generators/app'))
    .inDir(target)
    .withOptions({'skip-install': true})
    .withPrompts(prompts)
    .toPromise()
    .then(fixtureHelper.linkDeps(base, target)));
}

function installDeps(prompts) {
  return function () {
    log('... install dependencies');
    return new Bluebird(resolve => {
      withComposer((error, stdout) => {
        if (error) {
          log(os.EOL + stdout + os.EOL);
        }

        debug(os.EOL + stdout);
        // Noinspection BadExpressionStatementJS
        expect(error).to.be.null; // eslint-disable-line no-unused-expressions
        process.stdout.write(chalk.green(' composer'));

        if (prompts.loader !== 'jspm') {
          markDone();
          return resolve();
        }

        withJspm((error, stdout) => {
          if (error) {
            log(os.EOL + stdout + os.EOL);
          }
          debug(os.EOL + stdout);
          // Noinspection BadExpressionStatementJS
          /* jshint expr: true */
          expect(error).to.be.null; // eslint-disable-line no-unused-expressions
          process.stdout.write(', ' + chalk.green('jspm'));
          markDone();
          resolve();
        });
      });
    });
  };
}

/**
 * @param prompts
 * @returns {Function}
 */
function checkFiles(prompts) {
  return function () {
    log('... check files');

    let usedFiles = files(target);
    switch (prompts.preprocessor) {
      case 'less':
        usedFiles = usedFiles.addLess();
        break;
      case 'stylus':
        usedFiles = usedFiles.addStylus();
        break;
      case 'sass':
        usedFiles = usedFiles.addSass();
        break;
      default:
        usedFiles = usedFiles.addNop();
        break;
    }

    switch (prompts.loader) {
      case 'jspm':
        usedFiles = usedFiles.addJspm();
        break;
      default:
        break;
    }

    switch (prompts.buildtool) {
      case 'grunt':
        usedFiles = usedFiles.addGrunt();
        break;
      case 'gulp':
        usedFiles = usedFiles.addGulp();
        break;
      default:
        break;
    }

    assert.file(usedFiles.toArray());
    markDone();
  };
}

function checkEslint(prompts) {
  return function () {
    log('... check eslint');
    return runTask(prompts.buildtool, 'eslint').then(markDone);
  };
}

function checkKarma(prompts) {
  return function () {
    log('... check karma');
    return runTask(prompts.buildtool, 'karma').then(markDone);
  };
}

function checkPhpUnit(prompts) {
  return function () {
    log('... check phpunit');
    return runTask(prompts.buildtool, 'phpunit').then(markDone);
  };
}

function checkJs(prompts) {
  return function () {
    log('... check js build');
    let task = '';
    switch (prompts.buildtool) {
      case 'grunt':
        task = 'js:dist';
        break;
      case 'gulp':
        task = 'scripts --env prod';
        break;
      default:
        break;
    }
    return runTask(prompts.buildtool, task).then(markDone);
  };
}

function checkCss(prompts) {
  return function () {
    log('... check css build');
    let task = '';
    switch (prompts.buildtool) {
      case 'grunt':
        task = 'css:dist';
        break;
      case 'gulp':
        task = 'styles  --env prod';
        break;
      default:
        break;
    }

    return runTask(prompts.buildtool, task).then(() => {
      if (_.indexOf(prompts.additional, 'critical') >= 0) {
        assert.file(['app/Resources/public/styles/critical/index.css']);
        const critical = fs.readFileSync('app/Resources/public/styles/critical/index.css', 'utf8');
        expect(critical).to.not.equal('');
      }
      markDone();
    });
  };
}

function checkRev(prompts) {
  return function () {
    log('... check rev');
    return runTask(prompts.buildtool, 'rev').then(() => {
      assert.file(['app/config/rev-manifest.json']);
      const reved = fs.readJsonSync('app/config/rev-manifest.json');
      _.forEach(reved, file => {
        assert.file([path.join('web', file)]);
      });
      expect(_.size(reved)).to.equal(2);
      return markDone(reved);
    });
  };
}

function checkServiceWorker(prompts) {
  // Must be called directly after checkRev because it takes the reved file summary
  return function (reved) {
    log('... check service worker');
    return runTask(prompts.buildtool, 'generate-service-worker').then(() => {
      assert.file(['web/service-worker.js']);
      const workerJs = fs.readFileSync('web/service-worker.js', 'utf8');
      _.forEach(reved, file => {
        expect(workerJs).to.contain(file.replace(/^\//, ''));
      });
      expect(workerJs).to.contain('scripts/sw/runtime-caching.js');
      expect(workerJs).to.contain('scripts/sw/sw-toolbox.js');
      markDone();
    });
  };
}

module.exports.cleanup = function () {
  return cleanup();
};

module.exports.testAll = function (prompts) {
  const args = assign({}, {
    // Need to inject symfony 2.8.12 to tests as travis node does not support min php version for symfony 3.0
    symfonyStandard: false,
    symfonyCommit: '3.1.6',
    continue: true,
    view: 'plain',
    preprocessor: 'none',
    loader: 'jspm',
    additional: []
  }, prompts);

  return function () {
    return install(args)
      .then(installDeps(args))
      .then(checkFiles(args))
      .then(checkEslint(args))
      .then(checkKarma(args))
      .then(checkPhpUnit(args))
      .then(checkJs(args))
      .then(checkCss(args))
      .then(checkRev(args))
      .then(checkServiceWorker(args));
  };
};

module.exports.testSome = function (prompts) {
  const args = assign({}, {
    // Need to inject symfony 2.8.12 to tests as travis node does not support min php version for symfony 3.0
    symfonyStandard: false,
    symfonyCommit: '3.1.6',
    continue: true,
    view: 'plain',
    preprocessor: 'none',
    loader: 'jspm',
    additional: []
  }, prompts);

  return function () {
    return install(args)
      .then(installDeps(args))
      .then(checkFiles(args))
      .then(checkCss(args));
  };
};
