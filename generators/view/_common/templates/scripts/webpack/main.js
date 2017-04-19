/* eslint-env browser */
import debugFn from 'debug';
import $ from 'jquery';
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';
import {msg} from './modules/dummy';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug(msg);

SW.init();
