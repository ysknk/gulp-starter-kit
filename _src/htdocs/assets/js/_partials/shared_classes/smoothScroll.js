export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

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
      if (!(this instanceof SmoothScroll)) {
        return new SmoothScroll(opts_);
      }

      this.baseElem = 'body';

      this.elem = 'a';
      this.pageTopHash = 'top';
      this.excludeClassName = 'no-scroll';
      this.pushHistoryClassName = 'push-hisotry-scroll';
      this.isScrollingClassName = `is-scrolling`;
      this.easing = 'easeInOutQuart';
      this.duration = 500;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let html = doc.querySelector('html');

      // click to scroll
      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest([// delegate
          this.baseElem,
          this.elem
        ].join(' '));

        if (e.target === doc || !elem) return;

        let href = '';
        let target = '';
        let hash = '';

        try {
          href = elem.getAttribute('href');
          target = doc.querySelector(href);
          hash = this.getHash(href);
        } catch(e) {
          return;
        }

        if (!hash || elem.classList.contains(this.excludeClassName)) return;
        let isPushHistory = elem.classList.contains(this.pushHistoryClassName);
        if (e) e.preventDefault();

        this.goto(((hash === `#${this.pageTopHash}`)
          ? html
          : target),
          isPushHistory
        );
      }, false);
    }

    /**
     * locationHref
     */
    locationHref() {
      let hash = this.getHash(location.href);
      if (!hash) return;

      setTimeout(() => {
        let elem = doc.querySelector(hash);
        if (!elem) return;
        this.goto(elem, false);
      }, 100);
    }

    /**
     * getHash
     *
     * @param {string} str url
     * @returns {boolean|string} false or element id
     */
    getHash(str) {
      if (!str) return false;

      let dir = str.split('/');
      let last = dir[dir.length - 1];
      let hash = '';

      if (last.match(/(\#\!)/)) return false;

      if (last.match(/\#(.+)/) && !last.match(/\##/)) {
        hash = last.match(/#(.+)/)[1];
        return `#${hash}`;
      }
    }

    /**
     * updateUrlHash
     *
     * @param {string} hash element src
     */
    updateUrlHash(hash) {
      if (typeof win === 'undefined'
        || typeof win.history === 'undefined'
        || typeof win.history.pushState === 'undefined') return;
      win.history.pushState({}, '', hash ? `#${hash}` : '');
    }

    /**
     * getOffsetPos
     *
     * @param {object} elem element
     * @returns {object} position x, y
     */
    getOffsetPos(elem) {
      let pos = {x: 0, y: 0};
      while (elem) {
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
     * @param {boolean} setHistory
     * @param {function} cb callback
     */
    goto(elem, setHistory, cb) {
      let baseElem = doc.querySelector(this.baseElem);
      let elemPos = this.getOffsetPos(elem);
      let scrollPos = {
        y: win.pageYOffset,
        x: win.pageXOffset
      };

      let callback = () => {
        baseElem.classList.remove(this.isScrollingClassName);
        _.isFunction(cb) && cb();
        _.isFunction(this.onAfterScroll) && this.onAfterScroll(this);
      };

      _.isFunction(this.onBeforeScroll) && this.onBeforeScroll(this);

      if (scrollPos.y === elemPos.y) {
        callback();
        return;
      }

      baseElem.classList.add(this.isScrollingClassName);

      FN.anime({
        targets: scrollPos,
        y: elemPos.y,
        duration: this.duration,
        easing: this.easing,
        update: () => win.scroll(scrollPos.x, scrollPos.y),
        complete: () => {
          callback();
        }
      });

      if (setHistory) {
        this.updateUrlHash(elem.id);
      }
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

