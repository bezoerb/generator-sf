// Karma configuration
// Generated on Thu May 07 2015 20:08:12 GMT+0200 (CEST)
'use strict';
module.exports = function (config) {
    config.set({
        // Base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',
        plugins: [
            'karma-jspm',
            'karma-mocha',
            'karma-chai',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher'
        ],

        // Frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jspm', 'mocha', 'chai'],

        // List of files / patterns to load in the browser
        files: [
            'node_modules/phantomjs-polyfill/bind-polyfill.js'
        ],

        jspm: {
            // Edit this to your needs
            config: 'app/Resources/public/scripts/config.js',
            loadFiles: ['tests/Frontend/**/*Spec.js'],
            serveFiles: ['app/Resources/public/scripts/**/*.js', 'jspm_packages/**/*.js'],
            paths: {
                '*': 'base/app/Resources/public/scripts/*',
                'tests\/*': 'base/tests/*',
                'github:*': 'base/jspm_packages/github/*',
                'npm:*': 'base/jspm_packages/npm/*'
            }
        },

        // List of files to exclude
        exclude: [],

        // Preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},

        // Test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha'],

        // Web server port
        port: 9876,

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
