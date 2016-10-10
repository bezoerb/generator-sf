'use strict';
module.exports = {
    options: {<% if (props.libsass) { %>
        includePaths: [<% if (!props.noBower) { %>'bower_components', <% } %>'node_modules']<% } else { %>
        loadPath: [<% if (!props.noBower) { %>'bower_components', <% } %>'node_modules']<% } %>
    },
    all: {
        files: {
            '.tmp/sass/main.css': '<%%= paths.app %>/styles/main.scss'
        }
    }
};
