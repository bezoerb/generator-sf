'use strict';
module.exports = {
    app: {
        options: {
            configuration: '<% if (props.symfony.version < 3) { %>app/<% } %>phpunit.xml.dist',
            bin: '<% if (props.symfony.version >= 3) { %>vendor/<% } %>bin/phpunit',
            followOutput: true,
            color: true
        }
    }
};
