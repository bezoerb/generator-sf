'use strict';
module.exports = {
    options: {
        plugins: [
            {removeViewBox: false},
            {removeUselessStrokeAndFill: false},
            {cleanupIDs: false}
        ]
    },
    dist: {
        files: [{
            expand: true,
            cwd: '<%%= paths.app %>/img',
            src: '{,*/}*.svg',
            dest: '<%%= paths.dist %>/img'
        }]
    },
    icons: {
        files: [{
            expand: true,
            cwd: '.tmp/views/common',
            src: ['svg-icons.html.twig'],
            dest: '<%%= paths.app %>/../views/common'
        }]
    }
};
