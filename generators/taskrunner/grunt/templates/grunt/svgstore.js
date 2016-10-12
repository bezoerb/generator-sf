'use strict';
module.exports = {
    options: {
        prefix : 'icon-'
    },
    icons: {
        files: {
            '.tmp/views/common/svg-icons.html.twig': ['<%%= paths.app %>/img/svg-icons/*.svg']
        }
    }
};
