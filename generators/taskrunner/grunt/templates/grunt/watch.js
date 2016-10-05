'use strict';
module.exports = {
    styles: {
        files: ["<%%= paths.app %>/styles/{,*/}*.<% if (props.preprocessor === 'less') { %>less<% } else if (props.preprocessor === 'stylus') { %>styl<% } else if (props.preprocessor === 'sass') { %>{scss,sass}<% } else if (props.preprocessor === 'none') { %>css<% } %>"],
        tasks: ["<% if (props.preprocessor === 'less') { %>less<% } else if (props.preprocessor === 'stylus') { %>stylus<% } else if (props.preprocessor === 'sass') { %>sass<% } else if (props.preprocessor === 'none') { %>concat:css<% } %>','autoprefixer"]
    },
    scripts: {
        files: ['<%%= paths.app %>/scripts/**/*.js'],
        tasks: ['eslint']
    }
};
