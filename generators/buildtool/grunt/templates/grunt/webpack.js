'use strict';
module.exports = {
    options: require('../webpack.config').prod,
    dist: {
        keepalive: false,
        stats: {
            // Configure the console output
            colors: true,
            modules: true,
            reasons: true,
            errorDetails: true
        }
    }
};
