import debugFn from 'debug';
import $ from 'jquery';
import 'bootstrap';
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running Bootstrap:', $.fn.scrollspy ? '~3.3.0' : false);

SW.init();
