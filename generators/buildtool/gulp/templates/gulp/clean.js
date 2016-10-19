import {prefixDist} from './helper/utils';
import del from 'del';

// Clean output directory
export const clean = () => del([
    '.tmp',
    prefixDist('styles'),
    prefixDist('scripts'),
    prefixDist('img')
], {dot: true});
