const path = require('path');
const {flatten, first} = require('lodash');

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

module.exports = {
    src: (...rest) => preparePaths(paths.src, rest),
    bundles: (...rest) => preparePaths(paths.bundles, rest),
    dist: (...rest) => preparePaths(paths.dist, rest),
    config: (...rest) => preparePaths(paths.config, rest),
    tmp: (...rest) => preparePaths(paths.tmp, rest),
    views: (...rest) => preparePaths(paths.views, rest)
};