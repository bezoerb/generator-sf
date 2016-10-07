import gulp from 'gulp';
import {exec} from 'child_process';

gulp.task('sfcl', (cb) =>
    exec('php app/console cache:clear', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    })
);
