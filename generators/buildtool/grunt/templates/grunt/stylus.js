'use strict';
module.exports = {
    compile: {
        files: {
            '.tmp/stylus/main.css': '<%%= paths.app %>/styles/main.styl'
        },
        options: {
            paths: ['bower_components'<% if (props.noBower) { %>, 'node_modules'<% if (props.view === 'bootstrap') { %>, 'node_modules/bootstrap-styl'<% }} else if (props.view === 'bootstrap') { %>, 'bower_components/bootstrap-stylus'<% } %>],
            'include css':true,
            use: [require('nib')],
            dest: '.tmp'
        }
    }
}
