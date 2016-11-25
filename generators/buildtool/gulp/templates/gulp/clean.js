import {prefixDev, prefixDist} from './helper/utils';
import del from 'del';

const mapping = {
    tmp: ['.tmp'],
    scripts: [prefixDist('scripts')],
    styles: [prefixDist('styles')],
    images: [prefixDist('img')],
    build: [
        prefixDev('../../config/filerev.json'),
        prefixDist('appcache-loader.html'),
        prefixDist('service-worker.js'),
        prefixDist('manifest.json'),
        prefixDist('manifest.webapp'),
        prefixDist('browserconfig.xml'),
    ],
};

// Clean output directory
export const clean = target => () => del(mapping[target] || [], {dot: true});
