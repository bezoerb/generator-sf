import gulp from 'gulp';
import {prefixDev} from './helper/utils';
import {ENV} from './helper/env';
import gulpLoadPlugins from 'gulp-load-plugins';<% if (props.preprocessor === 'stylus') { %>
import nib from 'nib';<% } %>
const $ = gulpLoadPlugins();

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// Compile and automatically prefix stylesheets
export const styles = bs => () => {<% if (props.preprocessor === 'sass' && !props.libsass) { %>
    const stream = $.rubySass(prefixDev('styles/main.scss'), {
            sourcemap: true,
            precision: 10,
            loadPath: ['node_modules']
        })
    <% } else { %>
    const stream = gulp.src(prefixDev('styles/main.<% if (props.preprocessor === 'sass') { %>scss<% } else if (props.preprocessor === 'less') { %>less<% } else if (props.preprocessor === 'stylus') { %>styl<% } else { %>css<% } %>'))
        .pipe($.sourcemaps.init())
        <% if (props.preprocessor === 'sass') { %>.pipe($.sass({
            precision: 10,
            includePaths: ['node_modules']
        }).on('error', $.sass.logError))<% } else if (props.preprocessor === 'less') { %>.pipe($.less({
            paths: ['node_modules']
        }))<% } else if (props.preprocessor === 'stylus') { %>
        .pipe($.stylus({
            include: ['node_modules'<% if (props.view === 'bootstrap') { %>, 'node_modules/bootstrap-styl'<% } else if (props.view === 'bootstrap') { %>, 'bower_components/bootstrap-stylus'<% } %>],
            'include css':true,
            use: [nib]
        }))<% } %>
    <% } %>
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano({safe: true})))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest('.tmp/styles'))
        .pipe($.size({title: 'styles'}));

    if (ENV !== 'prod') {
        return stream.pipe($.if('*.css', bs.stream()));
    }

    return stream;
};
