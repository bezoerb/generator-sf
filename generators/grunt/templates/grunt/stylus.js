'use strict';
module.exports = {
    compile: {
        files: {
            '.tmp/stylus/main.css': '<%%= paths.app %>/styles/main.styl'
        },
        options: {
            paths: ['bower_components'<% if (frameworkFromNpm) { %>, 'node_modules'<% if (useBootstrap) { %>, 'node_modules/bootstrap-styl'<% }} else if (useBootstrap) { %>, 'bower_components/bootstrap-stylus'<% } %>],
            'include css':true,
            use: [require('nib')],
            dest: '.tmp'
        }
    }
}
