'use strict';
require('babel-polyfill');
require('babel-register');

const path = require('path');
const webpack = require('webpack');
const assign = require('lodash/assign');
const {ENV} = require('./gulp/helper/env');
const DEV = ENV === 'dev' || ENV === 'node';

const resolveNpmPath = function (componentPath) {
    return path.resolve(path.join(__dirname, 'node_modules', componentPath));
};

const provide = {
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery'
};

const aliases = {
    'jquery': resolveNpmPath('jquery/dist/jquery')<% if (props.preprocessor === 'sass' && props.view === 'bootstrap') { %>,
    'bootstrap': resolveNpmPath('bootstrap-sass/assets/javascripts/bootstrap')<% } %>
};


const config = {
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

    config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
