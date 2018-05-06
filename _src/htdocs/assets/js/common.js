'use strict';

import ajax from './_partials/classes/ajax';
import smoothScroll from './_partials/classes/smoothScroll';
import accordion from './_partials/classes/accordion';

const NS = '$';

((win, doc) => {

  const html = doc.querySelector('html');
  html.classList.remove('no-js');

  if(!win[NS]) win[NS] = {};
  if(!win[NS].fn) win[NS].fn = {};

  $.fn.ajax = new ajax();
  $.fn.ajax.onSuccess = (resolve, reject, responce, that) => {
    return resolve();
  };
  $.fn.ajax.onFailure = (resolve, reject, responce, that) => {
    return resolve();
  };

  $.fn.scroll = new smoothScroll();
  win.addEventListener('load', (e) => {
    $.fn.scroll.locationHref();
  }, false);

  $.fn.accordion = new accordion();
  doc.addEventListener("DOMContentLoaded", (e) => {
    $.fn.accordion.readyClose();
  }, false);

})(window, document);
