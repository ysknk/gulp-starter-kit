export default ((win, doc) => {
  'use strict';

  const PREFIX = 'site-';
  if (!win['PREFIX']) win['PREFIX'] = PREFIX;

  const NS = '$';
  if (!win['NS']) win['NS'] = NS;
  if (!win[NS]) win[NS] = {};

  // lodash minimal add
  if (!win['_']) win['_'] = {};
  win['_'] = {
    merge: require('lodash/merge'),
    extend: require('lodash/extend'),
    forEach: require('lodash/forEach'),
    template: require('lodash/template'),
    isObject: require('lodash/isObject'),
    isFunction: require('lodash/isFunction'),
    throttle: require('lodash/throttle'),
    debounce: require('lodash/debounce'),
    orderBy: require('lodash/orderBy')
  };

})(window, document);

