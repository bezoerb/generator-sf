'use strict';
var path = require('path');
var webpack = require('webpack');
var assign = require('lodash/assign');

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

module.exports.prod = {
    context: path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
    resolve: {
        root: [
            __dirname,
            path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),
            path.join(__dirname, 'test')
        ],
        modulesDirectories: [
            path.join('app', 'Resources', 'public', 'scripts'),
            'test',
            'node_modules'
        ],
        alias: aliases
    },

    entry: ['./main'],

    output: {
        path: path.join(__dirname, 'web', 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({sourceMap: false}),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin(provide)
    ],
    module: {
        loaders: [
            {test: /.jsx?$/, exclude: /node_modules/, loaders: ['babel?presets[]=es2015&presets[]=stage-2,cacheDirectory=true']}
        ]
    }
};

module.exports.dev = assign(module.exports.prod, {
    debug: true,
    devtool: '#cheap-module-source-map',

    context: path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),

    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './main'
    ],

    output: {
        path: path.join(__dirname, '.tmp', 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },

    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin(provide)
    ],
    module: {
        loaders: [
            {test: /.jsx?$/, exclude: /node_modules/, loaders: ['monkey-hot', 'babel?presets[]=es2015&presets[]=stage-2,cacheDirectory=true']}
        ]
    }
});
