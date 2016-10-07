/* jshint -W098,-W079 */
var require = {
    baseUrl: '/bower_components',
    paths: {
        main: '../app/Resources/public/scripts/main',
        app: '../app/Resources/public/scripts/app',
        modules: '../app/Resources/public/scripts/modules',
        jquery: 'jquery/dist/jquery',
        'visionmedia-debug': 'visionmedia-debug/dist/debug',
        foundation: 'foundation-sites/dist/foundation'
    },
    shim: {
        foundation: { exports: 'Foundation', deps: [ 'jquery' ]
    },
    packages: [

    ]
};
