import parseurl from 'parseurl';
import phpMiddleare from 'php-proxy-middleware';
import {getenv} from './env';
import {dist} from './dir';

export function php() {
    const env = getenv('env');
    const middleware = phpMiddleare({
        address: '127.0.0.1', // which interface to bind to
        ini: {max_execution_time: 60, variables_order: 'EGPCS'}, // eslint-disable-line
        root: dist(),
        router: dist('app.php')
    });

    process.env.SYMFONY_ENV = env;
    process.env.SYMFONY_DEBUG = env !== 'prod';

    return (req, res, next) => {
        const urlObj = parseurl(req);
        if (!/\.\w{2,}$/.test(urlObj.pathname) || /\.php/.test(urlObj.pathname)) {
            middleware(req, res, next);
        } else {
            next();
        }
    };
}
