import browserSync from 'browser-sync';
import {phpMiddleware, paths, prefixDev} from './helper/utils';
import {ENV} from './helper/env';
import getport from 'getport';
import pkg from '../package.json';
<% if (props.loader === 'webpack') { %>
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {dev as configDev, prod as configDist} from '../webpack.config.js';
<% } %>
const nodeEnv = ENV !== 'prod';

export const bs = browserSync.create(pkg.name || 'generator-sf');

const options = {
    server: {
        baseDir: nodeEnv ? ['.tmp', paths.app, './', 'node_modules', paths.dist] : paths.dist
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
    const config = nodeEnv ? configDev : configDist;
    const bundler = webpack(config);
    const middleware = [
        webpackDevMiddleware(bundler, {
            publicPath: config.output.publicPath,
            stats: {colors: true}
        }),
        webpackHotMiddleware(bundler)
    ];<% } %>
    getport(8000, 8999, (err, port) => {
        bs.init({...options, port, middleware: [<% if (props.loader === 'webpack') { %>...middleware, <% } %>phpMiddleware()]}, err => {
            if (cb) {
                cb(err, done);
            } else {
                done(err);
            }
        });
    });
};

export const stream = browserSync.stream;

