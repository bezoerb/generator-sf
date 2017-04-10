import browserSync from 'browser-sync';
import {php} from './helper/middleware';
import {tmp, src, dist} from './helper/dir';
import {ENV} from './helper/env';
import getport from 'getport';
import pkg from '../package.json';
<% if (props.loader === 'webpack') { %>
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.js';
<% } %>
const nodeEnv = ENV !== 'prod';

export const bs = browserSync.create(pkg.name || 'generator-sf');

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

export const serve = cb => done => {<% if (props.loader === 'webpack') { %>
    const bundler = webpack(config);
    const middleware = [
        webpackDevMiddleware(bundler, {
            publicPath: config.output.publicPath,
            stats: {colors: true}
        }),
        webpackHotMiddleware(bundler)
    ];<% } %>
    getport(8000, 8999, (err, port) => {
        bs.init({...options, port, middleware: [<% if (props.loader === 'webpack') { %>...middleware, <% } %>php()]}, err => {
            if (cb) {
                cb(err, done);
            } else {
                done(err);
            }
        });
    });
};

export const stream = browserSync.stream;

