'use strict';
var test = require('./helper/testHelper').testPrompts;
var cleanup = require('./helper/testHelper').cleanup;

describe('symfony generator (gulp)', function () {
    this.timeout(300000);

   // afterEach(cleanup);

    // browserify no framework
    it('', test({buildtool: 'gulp', loader: 'browserify'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'browserify', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'browserify', preprocessor: 'stylus'}));
    // browserify uikit
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'uikit'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'uikit', preprocessor: 'stylus'}));
    // browserify bootstrap
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'bootstrap', preprocessor: 'stylus'}));
    // browserify foundation
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'foundation'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'browserify', framework: 'foundation', preprocessor: 'stylus'}));

    // jspm no framework
    it('', test({buildtool: 'gulp', loader: 'jspm'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'jspm', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'jspm', preprocessor: 'stylus'}));
    // jspm uikit
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'uikit'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'uikit', preprocessor: 'stylus'}));
    // jspm bootstrap
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'bootstrap', preprocessor: 'stylus'}));
    // jspm foundation
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'foundation'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'jspm', framework: 'foundation', preprocessor: 'stylus'}));

    // webpack no framework
    it('', test({buildtool: 'gulp', loader: 'webpack'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'webpack', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'webpack', preprocessor: 'stylus'}));
    // webpack uikit
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'uikit'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'uikit', preprocessor: 'stylus'}));
    // webpack bootstrap
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'bootstrap', preprocessor: 'stylus'}));
    // webpack foundation
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'foundation'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'less'}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'sass', libsass: false}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'sass', libsass: true}));
    it('', test({buildtool: 'gulp', loader: 'webpack', framework: 'foundation', preprocessor: 'stylus'}));

});
