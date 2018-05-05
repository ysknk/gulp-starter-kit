'use strict';

import closest from './_partials/_polyfill/closest';

import ua from 'ua-parser-js';
import axios from 'axios';
import anime from 'animejs';
import _ from 'lodash';

const NS = '$';

((win, doc) => {

  if(!win[NS]) win[NS] = {};
  if(!win[NS].fn) win[NS].fn = {};

  _.extend(win[NS].fn, {
    ua,
    axios,
    anime,
    _,
  });

})(window, document);
