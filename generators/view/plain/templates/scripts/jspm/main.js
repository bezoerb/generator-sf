import debugFn from 'debug';
import $ from 'jquery';
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);

SW.init();
