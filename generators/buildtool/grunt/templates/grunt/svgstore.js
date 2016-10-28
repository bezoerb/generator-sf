'use strict';
module.exports = {
    options: {
        prefix : 'icon-'
    },
    icons: {
        files: {
            '.tmp/img/icons.svg': ['<%%= paths.app %>/img/svg-icons/*.svg']
        }
    }
};
