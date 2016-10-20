import webpack from 'webpack';
import gutil from 'gulp-util';
import webpackConfig from '../webpack.config';

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enables ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
const scripts = env => cb => {
    const wpc = webpackConfig[env];
    const config = {
        ...wpc, stats: {
            // Configure the console output
            colors: true,
            modules: true,
            reasons: true,
            errorDetails: true
        }
    };

    webpack(config, (err, stats) => {
        if (err) {
            throw new gutil.PluginError('webpack:build', err);
        }
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        cb();
    });
};

export const scriptsDev = scripts('dev');
export const scriptsProd = scripts('prod');
