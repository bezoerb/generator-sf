const gulp = require('gulp');
const {src, tmp} = require('./helper/dir');
const {ENV} = require('./helper/env');
const gulpLoadPlugins = require('gulp-load-plugins');<% if (props.preprocessor === 'stylus') { %>
const nib = require('nib');<% } %>
const $ = gulpLoadPlugins();

// Compile and automatically prefix stylesheets
const styles = bs => () => {<% if (props.preprocessor === 'sass' && !props.libsass) { %>
    const stream = $.rubySass(src('styles/main.scss'), {
            sourcemap: true,
            precision: 10,
            loadPath: ['node_modules']
        })
    <% } else { %>
    const stream = gulp.src(src('styles/main.<% if (props.preprocessor === 'sass') { %>scss<% } else if (props.preprocessor === 'less') { %>less<% } else if (props.preprocessor === 'stylus') { %>styl<% } else { %>css<% } %>'))
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
        .pipe($.autoprefixer())
        // Concatenate and minify styles
        .pipe($.if('*.css', $.cssnano({safe: true})))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(tmp('styles')))
        .pipe($.size({title: 'styles'}));

    if (ENV !== 'prod') {
        return stream.pipe($.if('*.css', bs.stream()));
    }

    return stream;
};

module.exports = {
    styles
};