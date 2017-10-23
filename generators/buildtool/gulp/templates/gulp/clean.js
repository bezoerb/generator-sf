const {dist, config} = require('./helper/dir');
const del = require('del');

const mapping = {
    tmp: ['.tmp'],
    scripts: [dist('scripts')],
    styles: [dist('styles')],
    images: [dist('img')],
    build: [
        config('../../config/filerev.json'),
        dist('appcache-loader.html'),
        dist('service-worker.js'),
        dist('manifest.json'),
        dist('manifest.webapp'),
        dist('browserconfig.xml')
    ]
};

// Clean output directory
const clean = target => () => del(mapping[target] || [], {dot: true});

module.exports = {
    clean
};
