'use strict';
/**
 * Creates critical path css for all html pages inside the .tmp folder generated by the html task.
 */
module.exports = {
    options: {
        base: '.tmp/html',
        targetFolder: '<%%= paths.dist %>',
        minify: true,
        css: ['.tmp/styles/main.css']
    },
    all: {
        files: [
            {expand: true, dot: true, cwd: '.tmp/html', dest: '<%%= paths.dist %>/styles/critical/', src: ['**/*.html'], ext: '.css'}
        ]
    }
};
