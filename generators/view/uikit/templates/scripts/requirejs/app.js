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
    var UI = require('uikit');

    exports.init = function init() {
        debug('\'Allo \'Allo');
        debug('Running jQuery:', $().jquery);
        debug('Running UIkit:', UI.version);

        serviceWorker.init();
    };
});
