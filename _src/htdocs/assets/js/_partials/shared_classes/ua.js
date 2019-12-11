export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Ua
   */
  return class Ua {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Ua)) {
        return new Ua(opts_);
      }

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * isSp
     *
     * @returns {boolean}
     */
    isSp() {
      return this.getDevice().type ? true : false;
    }

    /**
     * isPc
     *
     * @returns {boolean}
     */
    isPc() {
      return !this.isSp();
    }

    /**
     * isTab
     *
     * @returns {boolean}
     */
    isTab() {
      return this.isSp() &&
        this.getDevice().type.match(/^tablet$/i) ? true : false;
    }

    /**
     * getDevice
     *
     * @returns {object}
     */
    getDevice() {
      return FN.uaParser.getDevice();
    }

  };

})(window, document);

