'use strict';

import smoothScroll from './_classes/smoothScroll';

((win, doc) => {

  const html = doc.querySelector('html');
  html.classList.remove('no-js');

  if(!win.lib) win.lib = {};
  win.lib.scroll = new smoothScroll();
  win.addEventListener('load', () => {
    win.lib.scroll.locationHref();
  }, false);

})(window, document);
