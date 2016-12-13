'use strict';
module.exports = function(grunt, options) {
    <% if (props.loader === 'webpack') { %>var path = require('path');
    <% } %>var parseurl = require('parseurl');<% if (props.loader === 'webpack') { %>
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var webpackHotMiddleware = require('webpack-hot-middleware');
    var webpackConfig = require('../webpack.config').dev;
    var bundler = webpack(webpackConfig);
    <% } %>

    // just a helper to prevent double config
    function getOptions() {
        <% if (props.loader === 'webpack') { %>var devMiddleware;
        var hotMiddleware;
        <% } %>
        return {
            server: {
                baseDir: Array.prototype.slice.call(arguments),
                middleware: [<% if (props.loader === 'webpack') { %>
                    function(req, res, next) {
                        // prevent middleware initialization when running other tasks
                        if (!devMiddleware) {
                            devMiddleware = webpackDevMiddleware(bundler, {
                                publicPath: webpackConfig.output.publicPath,
                                noInfo: true,
                                stats: { colors: true }

                                // for other settings see
                                // http://webpack.github.io/docs/webpack-dev-middleware.html
                            });
                        }
                        devMiddleware(req, res, next);
                    },
                    function(req, res, next) {
                        // prevent middleware initialization when running other tasks
                        // bundler should be the same as above
                        if (!hotMiddleware) {
                            hotMiddleware = webpackHotMiddleware(bundler);
                        }
                        hotMiddleware(req, res, next);
                    },
                    <% } %>
                    // use php proxy
                    function(req, res, next) {
                        var obj = parseurl(req);
                        if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
                            grunt.bsMiddleware(req, res, next);
                        } else {
                            next();
                        }
                    }
                ]
            },
            port: parseInt(options.env.port, 10),
            watchTask: true,
            notify: true,
            open: true,
            ghostMode: {
                clicks: true,
                scroll: true,
                links: true,
                forms: true
            }
        };
    }

    return {
        dev: {
            bsFiles: {
                src: [
                    <% if (!props.loader === 'webpack') { %>'<%%= paths.app %>/scripts/**/*.js',
                    <% } %>'<%%= paths.app %>/images/**/*.{jpg,jpeg,gif,png,webp}',
                    'app/Resources/views/**/*.html.twig',
                    '.tmp/styles/*.css'
                ]
            },
            options: getOptions('.tmp', '<%%= paths.app %>', './', 'bower_components', '<%%= paths.dist %>')
        },
        dist: {
            bsFiles: {src: []},
            options: getOptions('<%%= paths.dist %>')
        }
    };
};
