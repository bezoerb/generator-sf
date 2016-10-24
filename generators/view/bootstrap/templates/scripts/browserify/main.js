import debugFn from 'debug';
import $ from 'jquery';
import './shim/bootstrap';
import picturefill from 'picturefill';
import svg4everybody from 'svg4everybody';
import * as SW from './modules/service-worker';
import {msg} from './modules/dummy';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();
svg4everybody();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running Bootstrap:', $.fn.scrollspy ? '~3.3.6' : false);
debug(msg);

SW.init();
