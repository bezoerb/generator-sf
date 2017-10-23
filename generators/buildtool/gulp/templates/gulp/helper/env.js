const minimist = require('minimist');
const dotenv = require('dotenv');
const {join} = require('path');
const {existsSync} = require('fs');

const envFile = join(__dirname, '../../', '.env');
if (existsSync(envFile)) {
    dotenv.config({path: envFile});
}

const defaultOptions = {
    string: ['env'],
    default: {
        env: process.env.env || 'node'
    }
};

const options = minimist(process.argv.slice(2), defaultOptions);

const getenv = (key, defaultValue) => (options[key] !== undefined && options[key]) || defaultValue;
const ENV = getenv('env');

module.exports = {
    getenv,
    ENV
};
