/**
 *
 * @author Ben Zörb @bezoerb https://github.com/bezoerb
 * @copyright Copyright (c) 2015 Ben Zörb
 *
 * Licensed under the MIT license.
 * http://bezoerb.mit-license.org/
 * All rights reserved.
 */
define(function (require, exports) {
    'use strict';
    var $ = require('jquery');
    var serviceWorker = require('./modules/service-worker');
    var debug = require('visionmedia-debug')('<%= props.safeAppame %>:main');

    exports.init = function () {
        debug('\'Allo \'Allo');
        debug('Running jQuery:', $().jquery);

        serviceWorker.init();
    };
});
