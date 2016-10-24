import debugFn from 'debug';
import $ from 'jquery';
import UI from 'uikit';
import picturefill from 'picturefill';
import svg4everybody from 'svg4everybody';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();
svg4everybody();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running UIkit:', UI.version);

SW.init();
