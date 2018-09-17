import uaParserJs from 'ua-parser-js';

import _extend from 'lodash/extend';
import _isObject from 'lodash/isObject';

const uaParser = new uaParserJs();

export default ((win, doc) => {
  'use strict';

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
      if(!(this instanceof Ua)) {
        return new Ua(opts_);
      }

      _isObject(opts_) && _extend(this, opts_);

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
      return uaParser.getDevice();
    }

  };

})(window, document);

