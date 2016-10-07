import debugFn from 'debug';
import $ from 'jquery';
import UIkit from './shim/uikit';
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';
import {msg} from './modules/dummy';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running UIkit:', UIkit.version);
debug(msg);

SW.init();
