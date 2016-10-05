'use strict';
module.exports = {
    options: {<% if (props.libsass) { %>
        includePaths: ['bower_components'<% if (props.loader === 'browserify' || props.loader === 'webpack') { %>, 'node_modules'<% } %>]<% } else { %>
        loadPath: ['bower_components'<% if (props.loader === 'browserify' || props.loader === 'webpack') { %>, 'node_modules'<% } %>]<% } %>
    },
    all: {
        files: {
            '.tmp/sass/main.css': '<%%= paths.app %>/styles/main.scss'
        }
    }
};
