import variable from './_partials/globals/variable';

import reqAnimationFrame from './_partials/polyfills/requestAnimationFrame';
import animationEnd from './_partials/polyfills/animationEnd';
import closest from './_partials/polyfills/closest';
import styles from './_partials/ponifills/styles';
import detectUseStyle from './_partials/ponifills/detectUseStyle';	

import uaParserJs from 'ua-parser-js';
import axios from 'axios';
import anime from 'animejs';
// import gsap from 'gsap';
// import cookies from 'js-cookie';
// import moment from 'moment-timezone';

// import _ from 'lodash';//look for globals/variable

import ua from './_partials/shared_classes/ua';
import mediaQuery from './_partials/shared_classes/mediaQuery';
import ajax from './_partials/shared_classes/ajax';
import smoothScroll from './_partials/shared_classes/smoothScroll';
import accordion from './_partials/shared_classes/accordion';
import modal from './_partials/shared_classes/modal';
import tab from './_partials/shared_classes/tab';
// import pageShare from './_partials/shared_classes/pageShare';
// import expander from './_partials/shared_classes/expander';
// import ellipsis from './_partials/shared_classes/ellipsis';
// import countdown from './_partials/shared_classes/countdown';
// import anchorNav from './_partials/shared_classes/anchorNav';
// import parallax from './_partials/shared_classes/parallax';
import intersection from './_partials/shared_classes/intersection';
// import preventDuplicateSubmit from './_partials/classes/preventDuplicateSubmit';
// import mouseStalker from './_partials/shared_classes/mouseStalker';

/**
 * common initialize
 */
((win, doc) => {
  'use strict';

  const FN = win[NS];

  FN.uaParser = new uaParserJs();
  FN.axios = axios;
  FN.anime = anime;
  // FN.gsap = gsap;
  // FN.cookies = cookies;

  // moment.tz.setDefault('Asia/Tokyo');
  // FN.moment = moment;

  // ua
  FN.ua = new ua();

  const html = doc.querySelector('html');
  html.classList.remove('no-js');

  // html class
  if (FN.ua.isPc()) {
    html.classList.add('ua-pc');
  }
  if (FN.ua.isSp() && !FN.ua.isTab()) {
    html.classList.add('ua-sp');
  }
  if (FN.ua.isTab()) {
    html.classList.add('ua-tab');
  }

  // if (!detectUseStyle('position', 'sticky')) {
  //   html.classList.add('no-sticky');
  // }
  
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
  // FN.pageShare = new pageShare();
  // FN.pageShare.initialize();

  // expander
  // FN.expander = new expander();
  // FN.expander.initialize();

  // ellipsis
  // FN.ellipsis = new ellipsis();

  // countdown
  // FN.countdown = new countdown();

  // anchorNav
  // FN.anchorNav = new anchorNav();

  // parallax
  // FN.parallax = new parallax();

  // intersection
  FN.intersection = new intersection();

  // preventDuplicateSubmit
  // FN.preventDuplicateSubmit = new preventDuplicateSubmit();

  // mouseStalker
  // FN.mouseStalker = new mouseStalker();
  // FN.mouseStalker.initialize();

  /**
   * event procedure
   */
  doc.addEventListener('DOMContentLoaded', (e) => {
    FN.mediaQuery.update();
    FN.accordion.setClose();
    FN.tab.setActive();
    // FN.expander.updateAll();
    // FN.ellipsis.updateAll();
    // FN.countdown.update();
    // FN.anchorNav.update();
    // FN.parallax.update();
    FN.intersection.initialize();
    FN.intersection.update();
  }, false);

  win.addEventListener('load', (e) => {
    FN.scroll.locationHref();
  }, false);

  win.addEventListener('resize', (e) => {
    FN.mediaQuery.update();
    // FN.modal.update();
    // FN.parallax.update();
  }, false);

  win.addEventListener('resize', _.debounce((e) => {
    // FN.anchorNav.update();
    FN.intersection.update();
  }, 100), false);

  // win.addEventListener('scroll', (e) => {
  // }, false);

  win.addEventListener('scroll', _.throttle((e) => {
    // FN.modal.update();
    // FN.anchorNav.update();
    // FN.parallax.update();
    FN.intersection.update();
  }, 100), true);

})(window, document);

