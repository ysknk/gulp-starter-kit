export default ((win, doc) => {
  `use strict`;

  const FN = win[NS];

  const ERROR_MESSAGE = `通信中にエラーが発生しました。しばらく時間をおいてから、もう一度お試しください。`;

  /**
   * Ajax
   */
  return class Ajax {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if(!(this instanceof Ajax)) {
        return new Ajax(opts_);
      }
      this.elem = doc.querySelector(`html`);
      this.loadingClassName = `is-ajax-loading`;
      this.errorClassName = `is-ajax-error`;
      this.isLoading = false;
      this.message = {
        failure: {
          common: ERROR_MESSAGE,
          timeout: ERROR_MESSAGE,
          notfound: ERROR_MESSAGE
        }
      };
      this.config = {
        method: `get`,
        url: ``,
        timeout: 5000
      };

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * set
     *
     * @param {object} elem
     * @param {object} config axios
     * @param {object} cb callback functions
     * @returns {object} promise
     */
    set(elem, config, cb = {onSuccess: () => {}, onFailure: () => {}}) {
      if(this.isLoading || !config || !config.url) return;
      config = _.merge({}, this.config, config)

      this.start(elem);

      return FN.axios(config)
        .then((response) => {
          return new Promise((resolve, reject) => {
            _.isFunction(cb.onSuccess) && cb.onSuccess(response, this);
            _.isFunction(this.onSuccess) && this.onSuccess(response, this);
            this.end(elem);
            return resolve;
          })
        })
        .catch((error) => {
          return new Promise((resolve, reject) => {
            _.isFunction(cb.onFailure) && cb.onFailure(error, this);
            _.isFunction(this.onFailure) && this.onFailure(error, this);
            this.end(elem);
            return resolve;
          })
        });
    }

    /**
     * start
     *
     * @param {object} elem
     */
    start(elem) {
      this.isLoading = true;
      if(elem) {
        elem.classList.add(this.loadingClassName);
      }
      if(this.elem) {
        this.elem.classList.add(this.loadingClassName);
      }
    }

    /**
     * end
     *
     * @param {object} elem
     */
    end(elem) {
      if(elem) {
        elem.classList.remove(this.loadingClassName);
      }
      if(this.elem) {
        this.elem.classList.remove(this.loadingClassName);
      }
      this.isLoading = false;
    }

    /**
     * onSuccess
     *
     * @param {object} response object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onSuccess(response, obj) {}

    /**
     * onFailure
     *
     * @param {object} error object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onFailure(error, obj) {}

  };

})(window, document);

