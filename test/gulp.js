'use strict';
var all = require('./helper/testHelper').testAll;
var some = require('./helper/testHelper').testSome;
var cleanup = require('./helper/testHelper').cleanup;

describe('symfony generator (gulp)', function () {
    this.timeout(300000);

    afterEach(cleanup);

    // browserify no framework
    it('', some({buildtool: 'gulp', loader: 'browserify'}));
    it('', all({buildtool: 'gulp', loader: 'browserify', preprocessor: 'less'}));
    // it('', all({buildtool: 'gulp', loader: 'browserify', preprocessor: 'sass', libsass: false}));
    it('', some({buildtool: 'gulp', loader: 'browserify', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'browserify', preprocessor: 'stylus'}));

    // browserify uikit
    it('', all({buildtool: 'gulp', loader: 'browserify', framework: 'uikit'}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'less'}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'sass', libsass: false}));
    // it('', all({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'stylus'}));

    // browserify bootstrap
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap'}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'less'}));
    // it('', all({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'sass', libsass: false}));
    it('', all({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'stylus'}));

    // browserify foundation
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'foundation'}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'less'}));
    it('', some({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'sass', libsass: false}));
    // it('', all({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'sass', libsass: true}));
    it('', all({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'stylus'}));

    // jspm no framework
    it('', all({buildtool: 'gulp', loader: 'jspm'}));
    it('', some({buildtool: 'gulp', loader: 'jspm', preprocessor: 'less'}));
    // it('', all({buildtool: 'gulp', loader: 'jspm', preprocessor: 'sass', libsass: false}));
    it('', some({buildtool: 'gulp', loader: 'jspm', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'jspm', preprocessor: 'stylus'}));

    // jspm uikit
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'uikit'}));
    it('', all({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'less'}));
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'sass', libsass: false}));
    // it('', all({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'stylus'}));

    // jspm bootstrap
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap'}));
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'less'}));
    // it('', all({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'sass', libsass: false}));
    it('', all({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'stylus'}));

    // jspm foundation
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'foundation'}));
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'less'}));
    it('', some({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'sass', libsass: false}));
    // it('', all({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'sass', libsass: true}));
    it('', all({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'stylus'}));

    // webpack no framework
    it('', some({buildtool: 'gulp', loader: 'webpack'}));
    it('', some({buildtool: 'gulp', loader: 'webpack', preprocessor: 'less'}));
    // it('', all({buildtool: 'gulp', loader: 'webpack', preprocessor: 'sass', libsass: false}));
    it('', some({buildtool: 'gulp', loader: 'webpack', preprocessor: 'sass', libsass: true}));
    it('', all({buildtool: 'gulp', loader: 'webpack', preprocessor: 'stylus'}));

    // webpack uikit
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'uikit'}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'less'}));
    it('', all({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'sass', libsass: false}));
    // it('', all({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'stylus'}));

    // webpack bootstrap
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap'}));
    it('', all({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'less'}));
    // it('', all({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'sass', libsass: false}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'stylus'}));

    // webpack foundation
    it('', all({buildtool: 'gulp', loader: 'webpack', framework: 'foundation'}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'less'}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'sass', libsass: false}));
    // it('', all({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'sass', libsass: true}));
    it('', some({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'stylus'}));

});
