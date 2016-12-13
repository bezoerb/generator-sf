'use strict';
/**
 * Render all controller pages to .tmp/html for later use with <% if (props.critical) { %>critical<% } if (props.critical && props.uncss) { %> & <% } if (props.uncss) { %>uncss<% } %>
 */
module.exports = {
    dist: {
        options: {
            functions: {
                asset: function (arg) { return arg; },
            },
            base: '<%%= paths.app %>/../views',
            namespaces: { web: '<%%= paths.dist %>/' }
        },
        files: [{
            data: {
                // You could add 'mock' template variables here
                // if they are required to render an appropriate
                // html structure for uncss/critical
            },
            expand: true,
            cwd: '<%%= paths.app %>/../views',
            src: ['controller/**/*.twig'], // Match twig templates but not partials
            dest: '.tmp/html',
            ext: '.html'   // index.twig + datafile.json => index.html,
        }]
    }
};
