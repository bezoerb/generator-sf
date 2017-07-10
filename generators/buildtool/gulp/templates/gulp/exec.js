import {exec} from 'child_process';
import {ENV} from './helper/env';

export const sfcl = (env = ENV) => cb =>
    exec(`php <% if (props.symfony.version >= 3 ) { %>bin<% } else { %>app<% } %>/console --env ${env} cache:clear`, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
