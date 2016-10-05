'use strict';
module.exports = {
    options: {
        browsers: ['> 5%', 'last 2 versions', 'ie 9'],
        map: {
            prev: '.tmp/styles/'
        }
    },
    dist: {
        files: [{
            expand: true,
            cwd: '.tmp/<% if (props.preprocessor === 'none') {%>concat<% } else if (props.preprocessor === 'less') {%>less<% } else if (props.preprocessor === 'sass') { %>sass<% } else if (props.preprocessor === 'stylus') { %>stylus<% } %>/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
        }]
    }
};
