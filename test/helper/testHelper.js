/**
 * Created by ben on 27.10.15.
 */
'use strict';
/*jshint expr: true*/
var path = require('path');
/*jshint -W079 */
var Promise = require('bluebird');
var debug = require('debug')('yeoman:generator-sf');
var helpers = require('yeoman-test');
var chalk = require('chalk');
var indentString = require('indent-string');
var assert = require('yeoman-assert');
var _ = require('lodash');
var files = require('./fileHelper');
var fixtureHelper = require('./fixturesHelper');
var withComposer = fixtureHelper.withComposer;
var withJspm = fixtureHelper.withJspm;
var chai = require('chai');
var expect = chai.expect;
var exec = require('child_process').exec;
var os = require('os');
var fs = require('fs-extra');
var assign = require('lodash/assign');

var base = path.join(__dirname, '..', 'fixtures');
var target = path.join(__dirname, '..', 'temp');
var removeDir = Promise.promisify(fs.remove);

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
    return _.reduce(promts, function (res, curr, key) {
        if (_.indexOf(['symfonyStandard', 'continue'], key) >= 0) {
            return res;
        } else {
            res.push(key + ': ' + chalk.yellow(curr));
            return res;
        }

    }, []);
}

/**
 * Helper function to test grunt task for don't throwning an error
 * @param task
 * @returns {promise}
 */
function runTask(tool, task) {
    if (tool === 'gulp') {
        var p = path.resolve(__dirname, '..', 'temp');
        tool = 'gulp --cwd ' + p + ' --gulpfile ' + path.join(p, 'gulpfile.babel.js');
    }
    return new Promise(function (resolve, reject) {
        debug(tool + ' ' + task);
        exec(tool + ' ' + task + ' --no-color', function (error, stdout, stderr) {
            debug('stderr:', stderr);
            debug('stdout:', stdout);
            if (error) {
                log(os.EOL + stdout + os.EOL);
                reject(error);
            }

            /*jshint expr: true*/
            expect(error).to.be.null;
            expect(stdout).to.contain(tool === 'grunt' ? 'Done.' : 'Finished');
            resolve(stdout);
        });
    });
}

/**
 * Run generator
 *
 * @param prompts
 * @returns {Promise}
 */
function install(prompts) {
    var opts = prompts2String(prompts);
    process.stdout.write(os.EOL + indentString('running app with ' + opts.join(', '), 4) + os.EOL);
    debug(path.join(__dirname, '../../generators/app'), target);
    return Promise.resolve(helpers.run(path.join(__dirname, '../../generators/app'))
        .inDir(target)
        .withOptions({'skip-install': true})
        .withPrompts(prompts)
        .toPromise()
        .then(fixtureHelper.linkDeps(base, target)));
}

function installDeps(prompts) {
    return function () {
        log('... install dependencies');
        return new Promise(function (resolve) {
            // withComposer(function (error, stdout) {
            //     if (error) {
            //         log(os.EOL + stdout + os.EOL);
            //     }

            // debug(os.EOL + stdout);
            // /*jshint expr: true*/
            // //noinspection BadExpressionStatementJS
            // expect(error).to.be.null;
            // process.stdout.write(chalk.green(' composer'));

            if (prompts.loader !== 'jspm') {
                markDone();
                return resolve();
            }

            withJspm(function (error, stdout) {
                if (error) {
                    log(os.EOL + stdout + os.EOL);
                }
                debug(os.EOL + stdout);
                // noinspection BadExpressionStatementJS
                /* jshint expr: true */
                expect(error).to.be.null;
                process.stdout.write(', ' + chalk.green('jspm'));
                markDone();
                resolve();
            });
            // });
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

        var usedFiles = files(target);
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
        }

        switch (prompts.buildtool) {
            case 'grunt':
                usedFiles = usedFiles.addGrunt();
                break;
            case 'gulp':
                usedFiles = usedFiles.addGulp();
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
        }

        return runTask(prompts.buildtool, task).then(function () {
            if (_.indexOf(prompts.additional, 'critical') >= 0) {
                assert.file(['app/Resources/public/styles/critical/index.css']);
                var critical = fs.readFileSync('app/Resources/public/styles/critical/index.css', 'utf8');
                expect(critical).to.not.equal('');
            }
            markDone();
        });
    };
}

function checkRev(prompts) {
    return function () {
        log('... check rev');
        return runTask(prompts.buildtool, 'rev').then(function () {
            assert.file(['app/config/rev-manifest.json']);
            var reved = fs.readJsonSync('app/config/rev-manifest.json');
            _.forEach(reved, function (file) {
                assert.file([path.join('web', file)]);
            });
            expect(_.size(reved)).to.equal(2);
            return markDone(reved);
        });
    };
}

function checkServiceWorker(prompts) {
    // must be called directly after checkRev because it takes the reved file summary
    return function (reved) {
        log('... check service worker');
        return runTask(prompts.buildtool, 'generate-service-worker').then(function () {
            assert.file(['web/service-worker.js']);
            var workerJs = fs.readFileSync('web/service-worker.js', 'utf8');
            _.forEach(reved, function (file) {
                expect(workerJs).to.contain(file.replace(/^\//, ''));
            });
            expect(workerJs).to.contain('scripts/sw/runtime-caching.js');
            expect(workerJs).to.contain('scripts/sw/sw-toolbox.js');
            markDone();
        });
    };
}


module.exports.cleanup = function() {
    return cleanup();
};

module.exports.testAll = function (prompts) {
    var args = assign({}, {
        // need to inject symfony 2.8.12 to tests as travis node does not support min php version for symfony 3.0
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
    var args = assign({}, {
        // need to inject symfony 2.8.12 to tests as travis node does not support min php version for symfony 3.0
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
