'use strict';

import smoothScroll from './_partials/_classes/smoothScroll';
import accordion from './_partials/_classes/accordion';

const NS = '$';

((win, doc) => {

  const html = doc.querySelector('html');
  html.classList.remove('no-js');

  if(!win[NS]) win[NS] = {};
  if(!win[NS].fn) win[NS].fn = {};

  $.fn.scroll = new smoothScroll();
  win.addEventListener('load', (e) => {
    $.fn.scroll.locationHref();
  }, false);

  $.fn.accordion = new accordion();
  doc.addEventListener("DOMContentLoaded", (e) => {
    $.fn.accordion.readyClose();
  }, false);

})(window, document);
