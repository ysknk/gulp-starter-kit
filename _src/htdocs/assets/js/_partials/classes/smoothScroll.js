import anime from 'animejs';

import _extend from 'lodash/extend';
import _isObject from 'lodash/isObject';
import _isFunction from 'lodash/isFunction';

export default ((win, doc) => {
  'use strict';

  /**
   * SmoothScroll
   */
  return class SmoothScroll {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if(!(this instanceof SmoothScroll)) {
        return new SmoothScroll(opts_);
      }

      this.baseElem = 'body';

      this.elem = 'a';
      this.topHash = 'top';
      this.excludeClassName = 'no-scroll';
      this.easing = 'easeInOutQuart';
      this.duration = 300;

      _isObject(opts_) && _extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let html = doc.querySelector('html');

      // click to scroll
      doc.addEventListener('click', (e) => {
        let elem = e.target.closest([// delegate
          this.baseElem,
          this.elem
        ].join(' '));

        let href = '';
        let target = '';
        let hash = '';

        if(!elem || e.target === doc) return;

        try {
          href = elem.getAttribute('href');
          target = doc.querySelector(href);
          hash = this.getHash(href);
        }catch(e) {
          return;
        }

        if(!hash || elem.classList.contains(this.excludeClassName)) return;

        if(e) e.preventDefault();
        this.goto((hash === '#' + this.topHash) ?
          html : target);
      }, false);
    }

    /**
     * locationHref
     */
    locationHref() {
      let hash = this.getHash(location.href);
      if(!hash) return;

      setTimeout(() => {
        let elem = doc.querySelector(hash);
        if(!elem) return;
        this.goto(elem);
      }, 100);
    }

    /**
     * getHash
     *
     * @param {string} str url
     * @returns {boolean|string} false or element id
     */
    getHash(str) {
      if(!str) return false;

      let dir = str.split('/');
      let last = dir[dir.length - 1];
      let hash = '';

      if(last.match(/(\#\!)/)) return false;

      if(last.match(/\#(.+)/)) {
        hash = last.match(/#(.+)/)[1];
        return '#' + hash;
      }
    }

    /**
     * updateUrlHash
     *
     * @param {string} hash element src
     */
    updateUrlHash(hash) {
      if(typeof win === 'undefined' ||
        typeof win.history === 'undefined' ||
          typeof win.history.pushState === 'undefined') return;
      win.history.pushState({}, '', hash ? '#' + hash : '');
    }

    /**
     * getOffsetPos
     *
     * @param {object} elem element
     * @returns {object} position x, y
     */
    getOffsetPos(elem) {
      let pos = {x: 0, y: 0};
      while(elem){
        pos.y += elem.offsetTop || 0;
        pos.x += elem.offsetLeft || 0;
        elem = elem.offsetParent;
      }
      return pos;
    }

    /**
     * goto
     *
     * @param {object} elem element
     * @param {function} cb callback
     */
    goto(elem, cb) {
      let elemPos = this.getOffsetPos(elem);
      let scrollPos = {
        y: window.pageYOffset
      };

      _isFunction(this.onBeforeScroll) && this.onBeforeScroll(this);

      if(scrollPos.y == elemPos.y) {
        _isFunction(cb) && cb();
        _isFunction(this.onAfterScroll) && this.onAfterScroll(this);
        return;
      }

      anime({
        targets: scrollPos,
        y: elemPos.y,
        duration: this.duration,
        easing: this.easing,
        update: () => win.scroll(0, scrollPos.y),
        complete: () => {
          _isFunction(cb) && cb();
          _isFunction(this.onAfterScroll) && this.onAfterScroll(this);
        }
      });

      this.updateUrlHash(elem.id);
    }

    /**
     * onBeforeScroll
     *
     * @param {object} obj class object
     */
    onBeforeScroll(obj) {}

    /**
     * onAfterScroll
     *
     * @param {object} obj class object
     */
    onAfterScroll(obj) {}

  };

})(window, document);

