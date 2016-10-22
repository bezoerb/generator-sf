import {exec} from 'child_process';

export const sfcl = env => cb =>
    exec(`php app/console --env ${env} cache:clear`,  (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });


