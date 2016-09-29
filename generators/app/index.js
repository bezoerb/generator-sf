'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
    initializing: function () {
        this.composeWith('generator:symfony', {
            arguments: ['app']
        }, {
            local: require.resolve('../symfony')
        });

        this.composeWith('generator:grunt', {
            arguments: ['app']
        }, {
            local: require.resolve('../grunt')
        });

        this.composeWith('generator:view', {
            arguments: ['app']
        }, {
            local: require.resolve('../view')
        });
    }
});
