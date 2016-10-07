import debugFn from 'debug';
import {Foundation} from 'foundation-sites';
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();
$(document).foundation();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running Foundation:', Foundation.version);

SW.init();
