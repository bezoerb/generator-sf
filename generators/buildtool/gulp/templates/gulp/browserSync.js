import browserSync from 'browser-sync';
import {phpMiddleware, paths, prefixDev} from './helper/utils';
<% if (props.loader === 'webpack') { %>
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {dev as configDev, prod as configDist} from '../webpack.config.js';
<% } %>
let cache = null;

function bsOptions(target, ...base) {
    if (cache) {
        return cache;
    }
    <% if (props.loader === 'webpack') { %>
    const config = target === 'dist' ? configDist : configDev;
    let bundler = webpack(config);
    <% } %>
    cache = {
        server: {
            baseDir: base,
            middleware: [<% if (props.loader === 'webpack') { %>
                webpackDevMiddleware(bundler, {
                    publicPath: config.output.publicPath,
                    noInfo: true,
                    stats: {colors: true}
                }),
                webpackHotMiddleware(bundler), <% } %>
                phpMiddleware(target)
            ]
        },
        port: 8888,
        watchTask: target !== 'dist',
        notify: true,
        open: true,
        ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
        }
    };

    return cache;
}

// Watch files for changes & reload
export const serveDev = cb => () => {
    browserSync.init(bsOptions('dev', '.tmp', paths.app, './', 'node_modules', paths.dist));
    return cb && cb(browserSync);
};

export const serveProd = cb => () => {
    browserSync.init(bsOptions('dist', paths.dist));
    return cb && cb(browserSync);
};

export const stream = browserSync.stream;

