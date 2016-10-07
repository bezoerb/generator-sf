import debugFn from 'debug';
import $ from 'jquery';
import UI from 'uikit';<
import picturefill from 'picturefill';
import * as SW from './modules/service-worker';

let debug = debugFn('<%= props.safeAppame %>:main');
picturefill();

debug('\'Allo \'Allo');
debug('Running jQuery:', $().jquery);
debug('Running UIkit:', UI.version);

SW.init();
