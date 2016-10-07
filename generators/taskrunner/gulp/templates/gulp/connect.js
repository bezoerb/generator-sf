import gulp from 'gulp';
import connect from 'gulp-connect';
import {paths, phpMiddleware} from './helper/utils';

export const host = '127.0.0.1';
export const port = 9999;

gulp.task('connect', function () {
    connect.server({
        root: paths.dist,
        host: host,
        port: port,
        middleware: function () {
            return [
                phpMiddleware('dev')
            ];
        }
    });
});
