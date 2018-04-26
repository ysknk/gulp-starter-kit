'use strict';

import closest from './_polyfill/closest';

import ua from 'ua-parser-js';
import axios from 'axios';
import anime from 'animejs';
import _ from 'lodash';

((win, doc) => {

  if(!win.lib) win.lib = {};
  _.extend(win.lib, {
    ua,
    axios,
    anime,
    _,
  });

})(window, document);
