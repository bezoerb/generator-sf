'use strict';
require('babel-polyfill');
require('babel-register');

var path = require('path');
var webpack = require('webpack');
var assign = require('lodash/assign');
var ENV = require('./gulp/helper/env');
var DEV = ENV === 'dev' || ENV === 'node';

var resolveNpmPath = function (componentPath) {
    return path.resolve(path.join(__dirname, 'node_modules', componentPath));
};

var provide = {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
};

var aliases = {
    'jquery': resolveNpmPath('jquery/dist/jquery')<% if (props.preprocessor === 'sass' && props.view === 'bootstrap') { %>,
    'bootstrap': resolveNpmPath('bootstrap-sass/assets/javascripts/bootstrap')<% } %>
};


var config = {
    context: path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
    resolve: {
        modules: [
            __dirname,
            path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
            path.join(__dirname, 'test'),
            'node_modules'
        ],
        alias: aliases
    },

    entry: ['./main'],

    output: {
        path: path.join(__dirname, '.tmp', 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin(provide)
    ],

    module: { rules: [] }
};


// specific configuration for prod environment
//  - enable uglify
if (!DEV) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());

    config.module.rules.push({
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader?presets[]=env,cacheDirectory=true']
    });

// specifiv config for dev environment
//  - enable sourcemaps
//  - enable hmr
} else {
    config.devtool = '#cheap-module-source-map';
    config.entry = [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client'
    ].concat(config.entry);

    config.module.rules.push({
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: [
            'monkey-hot-loader',
            'babel-loader?presets[]=env,cacheDirectory=true'
        ]
    });

}

module.exports = config;
