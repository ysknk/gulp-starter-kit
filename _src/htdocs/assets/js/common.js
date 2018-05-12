'use strict';

import ua from './_partials/classes/ua';
import ajax from './_partials/classes/ajax';
import smoothScroll from './_partials/classes/smoothScroll';
import accordion from './_partials/classes/accordion';
import pageShare from './_partials/classes/pageShare';

const NS = '$';

((win, doc) => {

  const html = doc.querySelector('html');
  html.classList.remove('no-js');

  if(!win[NS]) win[NS] = {};
  if(!win[NS].fn) win[NS].fn = {};

  // ua
  $.fn.ua = new ua();
  if($.fn.ua.isDesktop()) {
    html.classList.add('ua-desktop');
  }
  if($.fn.ua.isMobile()) {
    html.classList.add('ua-mobile');
  }
  if($.fn.ua.isTablet()) {
    html.classList.add('ua-tablet');
  }

  // ajax
  $.fn.ajax = new ajax();
  $.fn.ajax.onSuccess = (resolve, reject, responce, that) => {
    return resolve();
  };
  $.fn.ajax.onFailure = (resolve, reject, responce, that) => {
    return resolve();
  };

  // scroll
  $.fn.scroll = new smoothScroll();

  // accordion
  $.fn.accordion = new accordion();

  // pageShare
  $.fn.pageShare = new pageShare();

  doc.addEventListener("DOMContentLoaded", (e) => {
    $.fn.accordion.readyClose();
  }, false);

  win.addEventListener('load', (e) => {
    $.fn.scroll.locationHref();
  }, false);


})(window, document);
