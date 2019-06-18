export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Accordion
   */
  return class Accordion {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Accordion)) {
        return new Accordion(opts_);
      }

      this.baseElem = 'body';

      this.dataAttr = 'data-accr';
      this.dataAttrClose = 'data-accr-close';
      this.openClassName = 'is-open';
      this.easing = 'easeInOutQuart';
      this.duration = 300;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      // click to open or close
      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let toggleButton = e.target.closest([// delegate
          this.baseElem,
          `[${this.dataAttr}]`
        ].join(' '));

        let closeButton = e.target.closest([// delegate
          this.baseElem,
          `[${this.dataAttrClose}]`
        ].join(' '));

        if (e.target === doc || (!toggleButton && !closeButton)) return;

        if (toggleButton) {
          let data = toggleButton.getAttribute(this.dataAttr);
          let contents = doc.querySelectorAll(data);

          this[this.hasOpen(toggleButton) ?
            'close' : 'open'](toggleButton, contents);

        } else if (closeButton) {
          let data = closeButton.getAttribute(this.dataAttrClose);
          let contents = doc.querySelectorAll(data);

          this.close(closeButton, contents);
        }
      }, false);
    }

    /**
     * setClose
     */
    setClose() {
      let elems = doc.querySelectorAll([
        this.baseElem,
        `[${this.dataAttr}]`
      ].join(' '));

      _.forEach(elems, (elem) => {
        if (!this.hasOpen(elem)) {
          let data = elem.getAttribute(this.dataAttr);
          let contents = doc.querySelectorAll(data);
          _.forEach(contents, (content) => {
            content.style.overflow = 'hidden';
            content.style.height = '0';
          });
        }
      });
    }

    /**
     * open
     *
     * @param {object} btn element
     * @param {object} contents element
     */
    open(btn, contents) {
      let data = btn.getAttribute(this.dataAttrClose)
        || btn.getAttribute(this.dataAttr)
        || null;
      let setButtons = (attr) => {
        let buttons = doc.querySelectorAll(`[${attr}="${data}"]`);
        _.forEach(buttons, (button) => {
          button.classList.add(this.openClassName);
        });
      };

      setButtons(this.dataAttrClose);
      setButtons(this.dataAttr);

      _.forEach(contents, (content) => {
        _.isFunction(this.onBeforeOpen) && this.onBeforeOpen(btn, content);
        FN.anime.remove(content);

        content.classList.add(this.openClassName);

        let height = this.getHeight(content);

        FN.anime({
          targets: content,
          height: [height.now, height.max],
          duration: this.duration,
          easing: this.easing,
          complete: () => {
            if (this.hasOpen(btn)) {
              content.style.overflow = 'visible';
              content.style.height = 'auto';
              _.isFunction(this.onAfterOpen) && this.onAfterOpen(btn, content);
            }
          }
        });
      });
    }

    /**
     * getHeight
     *
     * @param {object} elem
     * @returns {object}
     */
    getHeight(elem) {
      let now = elem.clientHeight;

      elem.style.overflow = 'visible';
      elem.style.height = 'auto';
      let max = elem.getBoundingClientRect().height;
      elem.style.overflow = 'hidden';
      elem.style.height = `${now}px`;

      return {
        now,
        max
      };
    }

    /**
     * close
     *
     * @param {object} btn element
     * @param {object} contents element
     */
    close(btn, contents) {
      let data = btn.getAttribute(this.dataAttrClose)
        || btn.getAttribute(this.dataAttr)
        || null;
      let setButtons = (attr) => {
        let buttons = doc.querySelectorAll(`[${attr}="${data}"]`);
        _.forEach(buttons, (button) => {
          button.classList.remove(this.openClassName);
        });
      };

      setButtons(this.dataAttrClose);
      setButtons(this.dataAttr);

      _.forEach(contents, (content) => {
        _.isFunction(this.onBeforeClose) && this.onBeforeClose(btn, content);
        FN.anime.remove(content);

        content.classList.remove(this.openClassName);
        content.style.overflow = 'hidden';
        content.style.height = `${content.clientHeight}px`;

        FN.anime({
          targets: content,
          height: '0',
          duration: this.duration,
          easing: this.easing,
          complete: () => {
            if (!this.hasOpen(btn)) {
              _.isFunction(this.onAfterClose) && this.onAfterClose(btn, content);
            }
          }
        });
      });
    }

    /**
     * hasOpen
     *
     * @param {object} elem element
     * @returns {boolean}
     */
    hasOpen(elem) {
      return elem.classList.contains(this.openClassName);
    }

    /**
     * onBeforeOpen
     *
     * @param {object} elem btn element
     * @param {object} contents contents element
     */
    onBeforeOpen(elem, contents) {}

    /**
     * onAfterOpen
     *
     * @param {object} elem btn element
     * @param {object} contents contents element
     */
    onAfterOpen(elem, contents) {}

    /**
     * onBeforeClose
     *
     * @param {object} elem btn element
     * @param {object} contents contents element
     */
    onBeforeClose(elem, contents) {}

    /**
     * onAfterClose
     *
     * @param {object} elem btn element
     * @param {object} contents contents element
     */
    onAfterClose(elem, contents) {}

  };

})(window, document);

