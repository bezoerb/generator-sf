/* eslint-env browser */
import debugFn from 'debug';
import $ from 'jquery';
import {Foundation} from 'foundation-sites';
import picturefill from 'picturefill';
import svg4everybody from 'svg4everybody';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();
svg4everybody();
$(document).foundation();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running Foundation:', Foundation.version);

SW.init();
