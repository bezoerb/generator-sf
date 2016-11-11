import minimist from 'minimist';
import dotenv from 'dotenv';
import {join} from 'path';
import {existsSync} from 'fs';

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

export const getenv = (key, defaultValue) => (options[key] !== undefined && options[key]) || defaultValue;
export const ENV = getenv('env');
