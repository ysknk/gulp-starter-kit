export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * pagetopVisibility
   */
  return class pagetopVisibility {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof pagetopVisibility)) {
        return new pagetopVisibility(opts_);
      }

      this.elemSelector = `a[href="#top"]`;

      this.showClassName = `is-show`;
      this.hideClassName = `is-hide`;

      this.threshold = 0.6;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * update
     */
    update() {
      let elems = doc.querySelectorAll(this.elemSelector);
      let bodyElem = doc.body;
      let bodyHeight = bodyElem.getBoundingClientRect().height;
      let winHeight = win.innerHeight;
      let scrollPosY = win.pageYOffset;

      if (winHeight >= bodyHeight) {
        this.onElemsHide(elems);
        return;
      }

      if (scrollPosY >= (winHeight * this.threshold)) {
        this.onElemsShow(elems);
      }else{
        this.onElemsHide(elems);
      }
    }

    /**
     * onElemsHide
     *
     * @param {object} elems
     */
    onElemsHide(elems) {
      _.forEach(elems, (elem) => {
        if (elem.classList.contains(this.hideClassName)) return;
        this.onElemHide(elem);
      });
    }

    /**
     * onElemHide
     *
     * @param {object} elem
     */
    onElemHide(elem) {
      elem.classList.remove(this.showClassName);
      elem.classList.add(this.hideClassName);
    }

    /**
     * onElemsShow
     *
     * @param {object} elems
     */
    onElemsShow(elems) {
      _.forEach(elems, (elem) => {
        if (elem.classList.contains(this.showClassName)) return;
        this.onElemShow(elem);
      });
    }

    /**
     * onElemShow
     *
     * @param {object} elem
     */
    onElemShow(elem) {
      elem.classList.remove(this.hideClassName);
      elem.classList.add(this.showClassName);
    }

  };

})(window, document);

