const { existsSync, statSync } = require('fs');
const { join } = require('path');
const { find, isArray } = require('lodash');
const parseurl = require('parseurl');
const phpMiddleare = require('php-proxy-middleware');
const {getenv} = require('./env');
const {dist} = require('./dir');


function php(base = [dist()]) {
    const env = getenv('env');
    const middleware = phpMiddleare({
        address: '127.0.0.1', // which interface to bind to
        ini: {max_execution_time: 60, variables_order: 'EGPCS'}, // eslint-disable-line
        root: dist(),
        router: dist('app.php')
    });

    if (!isArray(base)) {
        base = [base];
    }

    // helper function to check if file exists
    const exists = pathname => find(base, root => {
        const file = join(root, pathname);
        return existsSync(file) && statSync(file).isFile();
    }) !== undefined;

    process.env.SYMFONY_ENV = env;
    process.env.SYMFONY_DEBUG = env !== 'prod';

    return (req, res, next) => {
        const {pathname} = parseurl(req);

        if (/^\/browser-sync\//.test(pathname)<% if (props.loader === 'webpack') { %> || /^\/__webpack_hmr$/.test(pathname)<% } %> || exists(pathname)) {
            next();
        } else {
            middleware(req, res, next);
        }
    };
}

module.exports = {
    php
};
