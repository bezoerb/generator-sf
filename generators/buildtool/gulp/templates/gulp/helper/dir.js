import path from 'path';
import {flatten, first} from 'lodash';

const paths = {
    bundles: 'src',
    src: 'app/Resources/public',
    views: 'app/Resources/views',
    config: 'app/config',
    dist: 'web',
    tmp: '.tmp'
};

const preparePaths = (source, rest) => {
    if (!rest.length) {
        return paths[source] || source;
    }
    const dirs = flatten(rest).map(dir => {
        const match = dir.match(/^(!+)(.*)$/);
        if (match) {
            const file = path.join(paths[source] || source, match[2]);
            return `${match[1]}${file}`;
        }
        return path.join(paths[source] || source, dir);
    });

    return dirs.length === 1 ? first(dirs) : dirs;
};

export const src = (...rest) => preparePaths(paths.src, rest);
export const bundles = (...rest) => preparePaths(paths.bundles, rest);
export const dist = (...rest) => preparePaths(paths.dist, rest);
export const config = (...rest) => preparePaths(paths.config, rest);
export const tmp = (...rest) => preparePaths(paths.tmp, rest);
export const views = (...rest) => preparePaths(paths.views, rest);
