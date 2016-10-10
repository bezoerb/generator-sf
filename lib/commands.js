var Promise = require('bluebird');
var spawn = require('cross-spawn');
var _ = require('lodash');
var path = require('path');
var findUp = require('find-up');

function composer(args, opts) {
    return findUp('composer.phar', opts).then(function (fp) {
        return new Promise(function (resolve, reject) {
            var cmd = 'composer';
            if (fp) {
                args.unshift(fp);
                cmd = 'php';
            }
            spawn(cmd, args, {stdio: 'inherit'}).on('error', reject).on('exit', resolve);
        }.bind(this));
    });
}

function jspm(args, opts) {
    var cwd = path.resolve(opts && opts.cwd || '');
    var cmd = path.join(cwd, 'node_modules', '.bin', 'jspm');

    return new Promise(function (resolve, reject) {
        spawn(cmd, args, {stdio: 'inherit'}).on('error', reject).on('exit', resolve);
    });
}

module.exports = {
    composer: composer,
    jspm: jspm
};


