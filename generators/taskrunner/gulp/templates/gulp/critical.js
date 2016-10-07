import path from 'path';
import gulp from 'gulp';
import critical from 'critical';
import connect from 'gulp-connect';
import {paths,phpMiddleware} from './helper/utils';
import {host,port} from './connect';


gulp.task('critical', ['styles','connect'], () => {
    return critical.generate({
        base: paths.dist,
        minify: true,
        css: path.join(paths.dist,'styles/main.css'),
        src: `http://${host}:${port}/`,
        dest: path.join(paths.dist,'styles/critical/index.css')
    }).finally(connect.serverClose);
});


