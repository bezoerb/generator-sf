import debugFn from 'debug';
import $ from 'jquery';
import Foundation from './shim/foundation';
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';
import {msg} from './modules/dummy';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();
$(document).foundation();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running Foundation:', Foundation.version);
debug(msg);

SW.init();
