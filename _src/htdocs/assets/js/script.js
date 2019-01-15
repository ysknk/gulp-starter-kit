import variable from './_partials/globals/variable';

import animationEnd from './_partials/polyfill/animationEnd';
import closest from './_partials/polyfill/closest';
import styles from './_partials/polyfill/styles';
import uaParserJs from 'ua-parser-js';

import axios from 'axios';
import anime from 'animejs';
import cookies from 'js-cookie';
// import _ from 'lodash';//look for globals/variable

import ua from './_partials/shared_classes/ua';
import mediaQuery from './_partials/shared_classes/mediaQuery';
import ajax from './_partials/shared_classes/ajax';
import smoothScroll from './_partials/shared_classes/smoothScroll';
import accordion from './_partials/shared_classes/accordion';
import modal from './_partials/shared_classes/modal';
import tab from './_partials/shared_classes/tab';
import pageShare from './_partials/shared_classes/pageShare';
import expander from './_partials/shared_classes/expander';
import ellipsis from './_partials/shared_classes/ellipsis';

/**
 * common initialize
 */
((win, doc) => {
  'use strict';

  const FN = win[NS];

  const UA_PARSER = new uaParserJs();
  FN.uaParser = UA_PARSER;
  FN.axios = axios;
  FN.anime = anime;

  let html = doc.querySelector('html');
  html.classList.remove('no-js');

  // ua
  FN.ua = new ua();

  // html class
  if(FN.ua.isPc()) {
    html.classList.add('ua-pc');
  }
  if(FN.ua.isSp() && !FN.ua.isTab()) {
    html.classList.add('ua-sp');
  }
  if(FN.ua.isTab()) {
    html.classList.add('ua-tab');
  }

  // mediaquery
  FN.mediaQuery = new mediaQuery();

  // ajax
  FN.ajax = new ajax();

  // scroll
  FN.scroll = new smoothScroll();
  FN.scroll.initialize();

  // accordion
  FN.accordion = new accordion();
  FN.accordion.initialize();

  // modal
  FN.modal = new modal();
  FN.modal.initialize();

  // tab
  FN.tab = new tab();
  FN.tab.initialize();

  // pageShare
  FN.pageShare = new pageShare();
  FN.pageShare.initialize();

  // expander
  FN.expander = new expander();
  FN.expander.initialize();

  // ellipsis
  FN.ellipsis = new ellipsis();

  /**
   * event procedure
   */
  doc.addEventListener('DOMContentLoaded', (e) => {
    FN.mediaQuery.check();
    FN.accordion.setClose();
    FN.tab.setActive();
    FN.expander.updateAll();
    FN.ellipsis.updateAll();
  }, false);

  win.addEventListener('load', (e) => {
    FN.scroll.locationHref();
  }, false);

  win.addEventListener('resize', (e) => {
    FN.mediaQuery.check();
  }, false);

})(window, document);

