const {exec} = require('child_process');
const {ENV} = require('./helper/env');

const sfcl = (env = ENV) => cb =>
    exec(`php app/console --env ${env} cache:clear`, (err, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    
module.exports = {
    sfcl
};
