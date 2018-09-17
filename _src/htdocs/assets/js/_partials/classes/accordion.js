import anime from 'animejs';

import _extend from 'lodash/extend';
import _forEach from 'lodash/forEach';
import _isObject from 'lodash/isObject';
import _isFunction from 'lodash/isFunction';

export default ((win, doc) => {
  'use strict';

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
      if(!(this instanceof Accordion)) {
        return new Accordion(opts_);
      }

      this.baseElem = 'body';

      this.dataAttr = 'data-accr';
      this.dataAttrClose = 'data-accr-close';
      this.openClassName = 'is-open';
      this.easing = 'easeInOutQuart';
      this.duration = 300;

      _isObject(opts_) && _extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      // click to open or close
      doc.addEventListener('click', (e) => {
        let toggleButton = e.target.closest([// delegate
          this.baseElem,
          `[${this.dataAttr}]`
        ].join(' '));

        let closeButton = e.target.closest([// delegate
          this.baseElem,
          `[${this.dataAttrClose}]`
        ].join(' '));

        if((!toggleButton && !closeButton) || e.target === doc) return;

        if(toggleButton) {
          let data = toggleButton.getAttribute(this.dataAttr);
          let contents = doc.querySelectorAll(data);

          this[this.hasOpen(toggleButton) ?
            'close' : 'open'](toggleButton, contents);

        }else if(closeButton) {
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

      _forEach(elems, (elem) => {
        if(!this.hasOpen(elem)) {
          let data = elem.getAttribute(this.dataAttr);
          let contents = doc.querySelectorAll(data);
          _forEach(contents, (content) => {
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
      btn.classList.add(this.openClassName);
      _isFunction(this.onBeforeOpen) && this.onBeforeOpen(btn, contents);

      _forEach(contents, (content) => {
        anime.remove(content);

        content.classList.add(this.openClassName);

        let nowHeight = content.clientHeight;
        content.style.overflow = 'visible';
        content.style.height = 'auto';

        let maxHeight = content.clientHeight;
        content.style.overflow = 'hidden';
        content.style.height = nowHeight;

        anime({
          targets: content,
          height: [nowHeight, maxHeight],
          duration: this.duration,
          easing: this.easing,
          complete: () => {
            if(this.hasOpen(btn)) {
              content.style.overflow = 'visible';
              content.style.height = 'auto';
              _isFunction(this.onAfterOpen) && this.onAfterOpen(btn, contents);
            }
          }
        });
      });
    }

    /**
     * close
     *
     * @param {object} btn element
     * @param {object} contents element
     */
    close(btn, contents) {
      btn.classList.remove(this.openClassName);
      _isFunction(this.onBeforeClose) && this.onBeforeClose(btn, contents);

      _forEach(contents, (content) => {
        anime.remove(content);

        content.classList.remove(this.openClassName);
        content.style.overflow = 'hidden';

        anime({
          targets: contents,
          height: '0',
          duration: this.duration,
          easing: this.easing,
          complete: () => {
            if(!this.hasOpen(btn)) {
              _isFunction(this.onAfterClose) && this.onAfterClose(btn, contents);
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

