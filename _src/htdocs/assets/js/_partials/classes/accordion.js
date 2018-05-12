import anime from 'animejs';

export default ((win, doc) => {

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
      this.dataAttr = 'data-accr';
      this.openClassName = 'is-open';
      this.easing = 'easeInOutQuart';
      this.duration = 300;

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      // click to open or close
      doc.addEventListener('click', (e) => {
        let elem = e.target.closest('[' + this.dataAttr + ']');// delegate
        if(!elem || e.target === doc) return;

        let data = elem.getAttribute(this.dataAttr);
        let contents = doc.querySelectorAll(data);

        this[this.hasOpen(elem) ?
          'close' : 'open'](elem, contents);
      }, false);
    }

    /**
     * readyClose
     */
    readyClose() {
      // close
      let elems = doc.querySelectorAll('[' + this.dataAttr + ']');
      _.each(elems, (elem) => {
        if(!this.hasOpen(elem)) {
          let data = elem.getAttribute(this.dataAttr);
          let contents = doc.querySelectorAll(data);
          _.each(contents, (content) => {
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
      _.isFunction(this.onBeforeOpen) && this.onBeforeOpen(this);

      _.each(contents, (content) => {
        anime.remove(content);

        content.classList.add(this.openClassName);

        let oldHeight = content.clientHeight;
        content.style.overflow = 'visible';
        content.style.height = 'auto';

        let maxHeight = content.clientHeight;
        content.style.overflow = 'hidden';
        content.style.height = oldHeight;

        anime({
          targets: content,
          height: [oldHeight, maxHeight],
          duration: this.duration,
          easing: this.easing,
          complete: () => {
            if(this.hasOpen(btn)) {
              content.style.overflow = 'visible';
              content.style.height = 'auto';
              _.isFunction(this.onAfterOpen) && this.onAfterOpen(this);
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
      _.isFunction(this.onBeforeClose) && this.onBeforeClose(this);

      _.each(contents, (content) => {
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
              _.isFunction(this.onAfterClose) && this.onAfterClose(this);
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
      return elem.classList.contains(this.openClassName)
    }

    /**
     * onBeforeOpen
     *
     * @param {object} obj class object
     */
    onBeforeOpen(obj) {}

    /**
     * onAfterOpen
     *
     * @param {object} obj class object
     */
    onAfterOpen(obj) {}

    /**
     * onBeforeClose
     *
     * @param {object} obj class object
     */
    onBeforeClose(obj) {}

    /**
     * onAfterClose
     *
     * @param {object} obj class object
     */
    onAfterClose(obj) {}

  };

})(window, document);
