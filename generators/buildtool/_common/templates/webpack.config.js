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
        path: path.join(__dirname, <% if (props.buildtool === 'grunt') { %>'web'<% } else { %>'.tmp'<% } %>, 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin(provide)
    ],
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader?presets[]=env,cacheDirectory=true']
            }
        ]
    }
};

module.exports.dev = assign({}, module.exports.prod, {
    devtool: '#cheap-module-source-map',

    context: path.join(__dirname, 'app', 'Resources', 'public', 'scripts'),

    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './main'
    ],<% if (props.buildtool === 'grunt') { %>

    output: {
        path: path.join(__dirname, '.tmp', 'scripts'),
        publicPath: '/scripts/',
        filename: 'main.js'
    },<% } %>

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin(provide)
    ],
    module: {
        rules: [
            {
                test: /.jsx?$/,
                exclude: /node_modules/,
                use: [
                    'monkey-hot-loader',
                    'babel-loader?presets[]=env,cacheDirectory=true'
                ]
            }
        ]
    }
});
