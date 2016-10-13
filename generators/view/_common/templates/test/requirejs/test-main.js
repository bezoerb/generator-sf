'use strict';
var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '../').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    baseUrl: '/base/bower_components',
    paths: {
        main: '../app/Resources/public/scripts/main',
        app: '../app/Resources/public/scripts/app',
        modules: '../app/Resources/public/scripts/modules',
        jquery: 'jquery/dist/jquery',
        loglevel: 'loglevel/dist/loglevel.min'<% if (props.view === 'foundation') { %>,
        foundation: 'foundation/js/foundation',
        'foundation/core': 'foundation/js/foundation/foundation',
        'foundation/abide': 'foundation/js/foundation/foundation.abide',
        'foundation/accordion': 'foundation/js/foundation/foundation.accordion',
        'foundation/alert': 'foundation/js/foundation/foundation.alert',
        'foundation/clearing': 'foundation/js/foundation/foundation.clearing',
        'foundation/dropdown': 'foundation/js/foundation/foundation.abide',
        'foundation/equalizer': 'foundation/js/foundation/foundation.equalizer',
        'foundation/interchange': 'foundation/js/foundation/foundation.interchange',
        'foundation/joyride': 'foundation/js/foundation/foundation.joyride',
        'foundation/magellan': 'foundation/js/foundation/foundation.magellan',
        'foundation/offcanvas': 'foundation/js/foundation/foundation.offcanvas',
        'foundation/orbit': 'foundation/js/foundation/foundation.orbit',
        'foundation/reveal': 'foundation/js/foundation/foundation.reveal',
        'foundation/slider': 'foundation/js/foundation/foundation.slider',
        'foundation/tab': 'foundation/js/foundation/foundation.tab',
        'foundation/tooltip': 'foundation/js/foundation/foundation.tooltip',
        'foundation/topbar': 'foundation/js/foundation/foundation.topbar'<% } else if (props.view === 'bootstrap' && props.preprocessor !== 'sass') { %>,
        bootstrap: 'bootstrap/dist/js/bootstrap',
        'bootstrap/affix': 'bootstrap/js/affix',
        'bootstrap/alert': 'bootstrap/js/alert',
        'bootstrap/button': 'bootstrap/js/button',
        'bootstrap/carousel': 'bootstrap/js/carousel',
        'bootstrap/collapse': 'bootstrap/js/collapse',
        'bootstrap/dropdown': 'bootstrap/js/dropdown',
        'bootstrap/modal': 'bootstrap/js/modal',
        'bootstrap/popover': 'bootstrap/js/popover',
        'bootstrap/scrollspy': 'bootstrap/js/scrollspy',
        'bootstrap/tab': 'bootstrap/js/tab',
        'bootstrap/tooltip': 'bootstrap/js/tooltip',
        'bootstrap/transition': 'bootstrap/js/transition'<% } else if (props.view === 'bootstrap') { %>,
        bootstrap: 'bootstrap-sass-official/assets/javascripts/bootstrap',
        'bootstrap/affix': 'bootstrap-sass-official/assets/javascripts/bootstrap/affix',
        'bootstrap/alert': 'bootstrap-sass-official/assets/javascripts/bootstrap/alert',
        'bootstrap/button': 'bootstrap-sass-official/assets/javascripts/bootstrap/button',
        'bootstrap/carousel': 'bootstrap-sass-official/assets/javascripts/bootstrap/carousel',
        'bootstrap/collapse': 'bootstrap-sass-official/assets/javascripts/bootstrap/collapse',
        'bootstrap/dropdown': 'bootstrap-sass-official/assets/javascripts/bootstrap/dropdown',
        'bootstrap/modal': 'bootstrap-sass-official/assets/javascripts/bootstrap/modal',
        'bootstrap/popover': 'bootstrap-sass-official/assets/javascripts/bootstrap/popover',
        'bootstrap/scrollspy': 'bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy',
        'bootstrap/tab': 'bootstrap-sass-official/assets/javascripts/bootstrap/tab',
        'bootstrap/tooltip': 'bootstrap-sass-official/assets/javascripts/bootstrap/tooltip',
        'bootstrap/transition': 'bootstrap-sass-official/assets/javascripts/bootstrap/transition'<% } %>
    },
    shim: {<% if (props.view === 'uikit') { %>
        uikit: ['jquery']<% } else if (props.view === 'foundation') { %>
        foundation: { exports: 'Foundation', deps: ['jquery'] },
        'foundation/core': { exports: 'Foundation', deps: ['jquery'] },
        'foundation/abide': { exports: 'Foundation.libs.abide', deps: ['foundation/core'] },
        'foundation/accordion': { exports: 'Foundation.libs.accordion', deps: ['foundation/core'] },
        'foundation/alert': { exports: 'Foundation.libs.alert', deps: ['foundation/core'] },
        'foundation/clearing': { exports: 'Foundation.libs.clearing', deps: ['foundation/core'] },
        'foundation/dropdown': { exports: 'Foundation.libs.dropdown', deps: ['foundation/core'] },
        'foundation/equalizer': { exports: 'Foundation.libs.equalizer', deps: ['foundation/core'] },
        'foundation/interchange': { exports: 'Foundation.libs.interchange', deps: ['foundation/core'] },
        'foundation/joyride': { exports: 'Foundation.libs.joyride', deps: ['foundation/core'] },
        'foundation/magellan': { exports: 'Foundation.libs.magellan', deps: ['foundation/core'] },
        'foundation/offcanvas': { exports: 'Foundation.libs.offcanvas', deps: ['foundation/core'] },
        'foundation/orbit': { exports: 'Foundation.libs.orbit', deps: ['foundation/core'] },
        'foundation/reveal': { exports: 'Foundation.libs.reveal', deps: ['foundation/core'] },
        'foundation/slider': { exports: 'Foundation.libs.slider', deps: ['foundation/core'] },
        'foundation/tab': { exports: 'Foundation.libs.tab', deps: ['foundation/core'] },
        'foundation/tooltip': { exports: 'Foundation.libs.tooltip', deps: ['foundation/core'] },
        'foundation/topbar': { exports: 'Foundation.libs.topbar', deps: ['foundation/core'] }<% } else if (props.view === 'bootstrap') { %>
        bootstrap: { exports: '$', deps: ['jquery'] },
        'bootstrap/affix': { exports: '$.fn.affix', deps: ['jquery'] },
        'bootstrap/alert': { exports: '$.fn.alert', deps: ['jquery'] },
        'bootstrap/button': { exports: '$.fn.button', deps: ['jquery'] },
        'bootstrap/carousel': { exports: '$.fn.carousel', deps: ['jquery'] },
        'bootstrap/collapse': { exports: '$.fn.collapse', deps: ['jquery'] },
        'bootstrap/dropdown': { exports: '$.fn.dropdown', deps: ['jquery'] },
        'bootstrap/modal': { exports: '$.fn.modal', deps: ['jquery'] },
        'bootstrap/popover': { exports: '$.fn.popover', deps: ['jquery'] },
        'bootstrap/scrollspy': { exports: '$.fn.scrollspy', deps: ['jquery'] },
        'bootstrap/tab': { exports: '$.fn.tab', deps: ['jquery'] },
        'bootstrap/tooltip': { exports: '$.fn.tooltip', deps: ['jquery'] },
        'bootstrap/transition': { exports: '$.fn.transition', deps: ['jquery'] }<% } %>
    },
    packages: [

    ]
});

require(allTestFiles,window.__karma__.start);
