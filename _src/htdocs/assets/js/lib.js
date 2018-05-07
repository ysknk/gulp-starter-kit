'use strict';

import closest from './_partials/polyfill/closest';

import uaParserJs from 'ua-parser-js';
import axios from 'axios';
import anime from 'animejs';
import _ from 'lodash';

const uaParser = new uaParserJs();

const NS = '$';

((win, doc) => {

  if(!win[NS]) win[NS] = {};
  if(!win[NS].fn) win[NS].fn = {};

  _.extend(win[NS].fn, {
    uaParser,
    axios,
    anime,
    _,
  });

})(window, document);
