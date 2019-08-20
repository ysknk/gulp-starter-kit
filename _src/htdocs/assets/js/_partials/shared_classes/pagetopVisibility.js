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

      this.threshold = 0.3;

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
      let scrollPosY =  win.pageYOffset;

      if (winHeight >= bodyHeight) {
        this.onHide();
        return;
      }

      if (scrollPosY >= (winHeight * this.threshold)) {
        this.onShow();
      }else{
        this.onHide();
      }
    }

    /**
     * onHide
     */
    onHide() {
      let elems = doc.querySelectorAll(this.elemSelector);
      _.forEach(elems, (elem) => {
        if (elem.classList.contains(this.hideClassName)) return;
        elem.classList.remove(this.showClassName);
        elem.classList.add(this.hideClassName);
      });
    }

    /**
     * onShow
     */
    onShow() {
      let elems = doc.querySelectorAll(this.elemSelector);
      _.forEach(elems, (elem) => {
        if (elem.classList.contains(this.showClassName)) return;
        elem.classList.remove(this.hideClassName);
        elem.classList.add(this.showClassName);
      });
    }

  };

})(window, document);

