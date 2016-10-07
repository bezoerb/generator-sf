import gulp from 'gulp';
import path from 'path';
import {Server} from 'karma';
import phpunit from 'gulp-phpunit';

gulp.task('karma', (cb) => {
    new Server({
        configFile: path.join(__dirname, '../test/karma.conf.js'),
        singleRun: true
    }, cb).start();
});


gulp.task('phpunit', () =>
    gulp.src('app/phpunit.xml.dist')
        .pipe(phpunit('bin/phpunit',{
            configurationFile: 'app/phpunit.xml.dist',
            colors: false
        }))
);

