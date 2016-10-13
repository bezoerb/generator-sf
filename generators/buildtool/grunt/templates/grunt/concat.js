'use strict';
module.exports = {
    css: {
        src: [<% if (props.view === 'bootstrap') { %>
            '<% if (props.noBower) { %>node_modules<% } else { %>bower_components<% } %>/bootstrap/dist/css/bootstrap.css',<% } else if (props.view === 'uikit') { %>
            '<% if (props.noBower) { %>node_modules/uikit/dist/<% } else { %>bower_components/uikit/<% } %>css/uikit.almost-flat.css',<% } else { %>
            'bower_components/sass-bootstrap-glyphicons/css/bootstrap-glyphicons.css',<% } if (props.view === 'foundation') { %>
            '<% if (props.noBower) { %>node_modules<% } else { %>bower_components<% } %>/foundation-sites/dist/foundation.css',<% } %>
           '<%%= paths.app %>/styles/{,*/}*.css'
        ],
        dest: '.tmp/concat/main.css'
    }
};
