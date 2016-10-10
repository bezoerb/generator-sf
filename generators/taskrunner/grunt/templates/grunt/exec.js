'use strict';
module.exports = {
    sfclprod: 'php <% if (props.symfony.version >= 3 ) { %>bin<% } else { %>app<% } %>/console cache:clear',
    sfcl: 'php <% if (props.symfony.version >= 3 ) { %>bin<% } else { %>app<% } %>/console cache:clear'<% if (props.loader === 'jspm') { %>,
    jspm: 'node_modules/.bin/jspm bundle-sfx scripts/main .tmp/scripts/main.js'<% } %>
};
