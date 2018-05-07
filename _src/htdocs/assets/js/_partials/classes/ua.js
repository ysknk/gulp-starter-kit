import uaParserJs from 'ua-parser-js';

const uaParser = new uaParserJs();

export default ((win, doc) => {

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

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {}

    /**
     * isMobile
     *
     * @returns {boolean}
     */
    isMobile() {
      return this.getDevice().type ? true : false;
    }

    /**
     * isDesktop
     *
     * @returns {boolean}
     */
    isDesktop() {
      return !this.isMobile();
    }

    /**
     * isTablet
     *
     * @returns {boolean}
     */
    isTablet() {
      return this.getDevice().type &&
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
