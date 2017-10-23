/**
 *
 * @author Ben Zörb @bezoerb https://github.com/bezoerb
 * @copyright Copyright (c) 2015 Ben Zörb
 *
 * Licensed under the MIT license.
 * http://bezoerb.mit-license.org/
 * All rights reserved.
 */
/* eslint-env browser */
import debugFn from 'debug';
import appCacheNanny from 'appcache-nanny';

let debug = debugFn('<%= props.safeAppame %>:service-worker');

export function init() {
    // Check to make sure service workers are supported in the current browser,
    // and that the current page is accessed from a secure origin. Using a
    // service worker from an insecure origin will trigger JS console errors. See
    // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
    let isLocalhost = Boolean(window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

    debug('initializing service worker');
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || isLocalhost)) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function (registration) {
                debug('service worker registration', registration);

                // Check to see if there's an updated version of service-worker.js with
                // new files to cache:
                // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-registration-update-method
                if (typeof registration.update === 'function') {
                    debug('service worker update');
                    registration.update();
                }

                // Updatefound is fired if service-worker.js changes.
                registration.onupdatefound = function () {
                    // Updatefound is also fired the very first time the SW is installed,
                    // and there's no need to prompt for a reload at that point.
                    // So check here to see if the page is already controlled,
                    // i.e. whether there's an existing service worker.
                    if (navigator.serviceWorker.controller) {
                        // The updatefound event implies that registration.installing is set:
                        // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
                        var installingWorker = registration.installing;

                        installingWorker.onstatechange = function () {
                            switch (installingWorker.state) {
                                case 'installed':
                                    // At this point, the old content will have been purged and the
                                    // fresh content will have been added to the cache.
                                    // It's the perfect time to display a "New content is
                                    // available; please refresh." message in the page's interface.
                                    break;

                                case 'redundant':
                                    throw new Error('The installing ' +
                                        'service worker became redundant.');

                                default:
                                // Ignore
                            }
                        };
                    }
                };
            }).catch(function (e) {
                debug('Error during service worker registration:', e);
            });
    } else if ('applicationCache' in window) {
        debug('initializing application cache');
        // Start to check for updates every 30s
        appCacheNanny.start();
    }
}
