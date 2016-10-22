import gulpLoadPlugins from 'gulp-load-plugins';
import {paths, phpMiddleware} from './helper/utils';

const $ = gulpLoadPlugins();

export const host = '127.0.0.1';
export const port = 9999;

export const connect = () =>
    $.connect.server({
        root: paths.dist,
        host: host,
        port: port,
        middleware: function () {
            return [
                phpMiddleware('dev')
            ];
        }
    });

connect.serverClose = $.connect.serverClose;
