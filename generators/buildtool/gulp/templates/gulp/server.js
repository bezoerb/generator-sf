const browserSync = require('browser-sync');
const {php} = require('./helper/middleware');
const {tmp, src, dist} = require('./helper/dir');
const {ENV} = require('./helper/env');
const getport = require('getport');
const pkg = require('../package.json');
<% if (props.loader === 'webpack') { %>
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');
<% } %>
const nodeEnv = ENV !== 'prod';

const bs = browserSync.create(pkg.name || 'generator-sf');

const options = {
    server: {
        baseDir: nodeEnv ? [tmp(), src(), './', 'node_modules', dist()] : dist()
    },
    watchTask: nodeEnv,
    notify: nodeEnv,
    open: true,
    ghostMode: {
        clicks: true,
        scroll: true,
        links: true,
        forms: true
    }
};

const serve = cb => done => {<% if (props.loader === 'webpack') { %>
    const bundler = webpack(config);
    const middleware = [
        webpackDevMiddleware(bundler, {
            publicPath: config.output.publicPath,
            stats: {colors: true}
        }),
        webpackHotMiddleware(bundler)
    ];<% } %>
    getport(8000, 8999, (err, port) => {
        bs.init({...options, port, middleware: [<% if (props.loader === 'webpack') { %>...middleware, <% } %>php(options.server.baseDir)]}, err => {
            if (cb) {
                cb(err, done);
            } else {
                done(err);
            }
        });
    });
};

const stream = browserSync.stream;

module.exports = {
    bs,
    serve,
    stream
};
