import {critical as crt} from 'critical';
import {prefixDist, paths} from './helper/utils';
import {connect,host,port} from './connect';

export const critical = () =>
    crt.generate({
        base: paths.dist,
        minify: true,
        css: prefixDist('styles/main.css'),
        src: `http://${host}:${port}/`,
        dest: prefixDist('styles/critical/index.css')
    }).finally(connect.serverClose);


