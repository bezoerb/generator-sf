module.exports = function (grunt, options) {
    var reduce = require('lodash/reduce');
    var size = require('lodash/size');
    var fs = require('fs-extra');
    var path = require('path');
    var slash = require('slash');
    var php = require('php-proxy-middleware');<% if (props.critical || props.uncss) { %>
    var getPort = require('get-port');
    <% } %>

    // helper
    function getMiddleware(target) {
        if (target === 'dist') {
            process.env['SYMFONY_ENV'] = 'prod';
            process.env['SYMFONY_DEBUG'] = 0;
        } else {
            process.env['SYMFONY_ENV'] = 'node';
            process.env['SYMFONY_DEBUG'] = 1;
        }
        return php({
            address: '127.0.0.1', // which interface to bind to
            ini: {max_execution_time: 60, variables_order: 'EGPCS'},
            root: options.paths.dist,
            router: path.join(options.paths.dist, 'app.php')
        });
    }

    return {
        default: [
            'availabletasks'
        ],
        css: function (target) {
            grunt.task.run([
                'clean:css',<% if (props.preprocessor === 'less') { %>
                'less',<% } else if (props.preprocessor === 'stylus') { %>
                'stylus',<% } else if (props.preprocessor === 'sass') { %>
                'sass',<% } else if (props.preprocessor === 'none') { %>
                'concat:css',<% } %>
                'autoprefixer'
            ]);
            if (target === 'dist') {
                <% if (props.uncss || props.critical) { %>// configure routes inside gruntfile if you'd like to use <% if (props.critical) { %>critical <% } if (props.critical && props.uncss) { %>and <% } if (props.uncss) { %>uncss<% } %>
                grunt.task.run(size(options.routes) ? ['fetch',<% if (props.critical) { %> 'critical',<% } if (props.uncss) { %> 'uncss',<% } %> 'cssmin'] : ['cssmin']);<% } else {
                %>grunt.task.run('cssmin');<% } %>
            } else if (target === 'assets') {
                grunt.task.run(['copy:assets-css']);
            }
        },
        js: function (<% if (props.loader === 'jspm' || props.loader === 'browserify') { %>target<% } %>) {
            grunt.task.run([
                'clean:js'<% if (props.loader === 'webpack') { %>,
                'webpack'<% } else if (props.loader === 'jspm') { %>,
                'exec:jspm'<% } %>
            ]);<% if (props.loader === 'jspm' || props.loader === 'browserify') { %>
            if (target === 'dist') {
                grunt.task.run([<% if (props.loader === 'jspm') {
                    %>'uglify:dist'<% } else if (props.loader === 'browserify') {
                    %>'browserify:dist','uglify:dist'<% } %>]);
            } else {
                grunt.task.run([<% if (props.loader === 'jspm'){
                    %>'copy:assets-js'<% } else if (props.loader === 'browserify') {
                    %>'browserify:dev','copy:assets-js'<% } %>]);
            }<% } %>
        },
        img: function (target) {
            grunt.task.run(['clean:img', 'svgstore', 'svgmin:icons']);

            if (target === 'dist') {
                grunt.task.run([
                    'imagemin',
                    'svgmin:dist'
                ]);
            } else {
                grunt.task.run(['copy:assets-img']);
            }
        },
        rev: [
            'filerev',
            'revdump',
            'usemin'
        ],
        'generate-service-worker': [
            'copy:sw-scripts',
            'sw-precache:dist',
            // fallback for browsers not supporting service workers
            'appcache'
        ],
        assets: [
            'js:assets',
            'css:assets',
            'img:assets',
            'copy:sw-scripts',
            'rev',
            'copy:dist',
            'clean:tmp',
            'generate-service-worker'
        ],
        build: [
            'test',
            'js:dist',
            'css:dist',
            'img:dist',
            'copy:sw-scripts',
            'rev',
            'copy:dist',
            'clean:tmp',
            'generate-service-worker'
        ],
        test: [
            'eslint',
            'karma',
            'phpunit'
        ],<% if (props.critical || props.uncss) { %>
        fetch: function(){
            var done = this.async();

            getPort().then(function(port){
                grunt.connectMiddleware = getMiddleware();
                grunt.config.set('connect.fetch.options.port', port);
                grunt.task.run(['connect', 'http']);
                done();
            });
        },<% } %>
        revdump: function(){
            var file = 'app/config/rev-manifest.json';
            fs.outputJsonSync(file, reduce(grunt.filerev.summary, function(acc,val,key){
                acc[slash(key.replace('web/',''))] = slash(val.replace('web/',''));
                return acc;
            },{}));
        },
        serve: function(target) {
            // clean tmp
            grunt.task.run(['clean:tmp']);

            if (target === 'dist') {
                grunt.task.run(['exec:sfclprod','build']);
            } else {
                target = 'dev';
                grunt.task.run(['svgstore', 'svgmin:icons', 'css:serve'<% if (props.loader === 'browserify') { %>, 'browserify:dev'<% } %>]);
            }

            // start php middleware
            grunt.bsMiddleware = getMiddleware(target);

            grunt.task.run([
                'browserSync:'+ target, // Using the php middleware
                'watch'                 // Any other watch tasks you want to run
            ]);
        }
    };
};
