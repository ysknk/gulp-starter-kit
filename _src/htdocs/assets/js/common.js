import ua from './_partials/classes/ua';
import mediaQuery from './_partials/classes/mediaQuery';
import ajax from './_partials/classes/ajax';
import smoothScroll from './_partials/classes/smoothScroll';
import accordion from './_partials/classes/accordion';
import modal from './_partials/classes/modal';
import tab from './_partials/classes/tab';
import pageShare from './_partials/classes/pageShare';

((win, doc) => {
  'use strict';

  const NS = '$';

  const html = doc.querySelector('html');
  html.classList.remove('no-js');

  if(!win[NS]) win[NS] = {};
  if(!win[NS].fn) win[NS].fn = {};

  // ua
  $.fn.ua = new ua();

  // html class
  if($.fn.ua.isPc()) {
    html.classList.add('ua-pc');
  }
  if($.fn.ua.isSp() && !$.fn.ua.isTab()) {
    html.classList.add('ua-sp');
  }
  if($.fn.ua.isTab()) {
    html.classList.add('ua-tab');
  }

  // mediaquery
  $.fn.mediaQuery = new mediaQuery();

  // ajax
  $.fn.ajax = new ajax();
  $.fn.ajax.onSuccess = (resolve, reject, response, obj) => {
    return resolve();
  };
  $.fn.ajax.onFailure = (resolve, reject, response, obj) => {
    return resolve();
  };

  // scroll
  $.fn.scroll = new smoothScroll();
  $.fn.scroll.initialize();

  // accordion
  $.fn.accordion = new accordion();
  $.fn.accordion.initialize();

  // modal
  $.fn.modal = new modal();
  $.fn.modal.initialize();

  // tab
  $.fn.tab = new tab();
  $.fn.tab.initialize();

  // pageShare
  $.fn.pageShare = new pageShare();
  $.fn.pageShare.initialize();

  doc.addEventListener('DOMContentLoaded', (e) => {
    $.fn.mediaQuery.check();
    $.fn.accordion.setClose();
    $.fn.tab.setActive();
  }, false);

  win.addEventListener('load', (e) => {
    $.fn.scroll.locationHref();
  }, false);

  win.addEventListener('resize', (e) => {
    $.fn.mediaQuery.check();
  }, false);

})(window, document);

