export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Temp
   */
  return class Temp {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Temp)) {
        return new Temp(opts_);
      }

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
    }

  };

})(window, document);

