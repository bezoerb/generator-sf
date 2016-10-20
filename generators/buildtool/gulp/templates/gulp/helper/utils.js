import parseurl from 'parseurl';
import path from 'path';
import php from 'php-proxy-middleware';
import {flatten, first} from 'lodash';

export const paths = {
    app: 'app/Resources/public',
    dist: 'web'
};

function getMiddleware(target) {
    if (target === 'dist') {
        process.env['SYMFONY_ENV'] = 'prod';
        process.env['SYMFONY_DEBUG'] = 0;
    } else {
        process.env['SYMFONY_ENV'] = 'node';
        process.env['SYMFONY_DEBUG'] = 1;
    }
    return php({
        address: '127.0.0.1', // which interface to bind to
        ini: {max_execution_time: 60, variables_order: 'EGPCS'},
        root: paths.dist,
        router: path.join(paths.dist, 'app.php')
    });
}

export function phpMiddleware(target) {
    var middleware = getMiddleware(target);

    return function (req, res, next) {
        var obj = parseurl(req);
        if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
            middleware(req, res, next);
        } else {
            next();
        }
    };
}

export function prefixPaths(source, ...rest) {
    const dirs = flatten(rest).map(dir => {
        const match = dir.match(/^(!+)(.*)$/);
        if (match) {
            const file = path.join(paths[source] || source, match[2]);
            return `${match[1]}${file}`;
        } else {
            return path.join(paths[source] || source, dir);
        }

    });

    return dirs.length === 1 ? first(dirs) : dirs;
}

export function prefixDev(...rest) {
    return prefixPaths(paths.app, rest);
}

export function prefixDist(...rest) {
    return prefixPaths(paths.dist, rest);
}
