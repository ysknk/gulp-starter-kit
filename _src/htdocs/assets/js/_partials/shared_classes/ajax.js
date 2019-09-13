export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  const ERROR_MESSAGE = '通信中にエラーが発生しました。しばらく時間をおいてから、もう一度お試しください。';

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
      if (!(this instanceof Ajax)) {
        return new Ajax(opts_);
      }
      this.elem = doc.querySelector('html');
      this.loadingClassName = 'is-ajax-loading';
      this.errorClassName = 'is-ajax-error';
      this.isLoading = {};
      this.message = {
        failure: {
          common: ERROR_MESSAGE,
          timeout: ERROR_MESSAGE,
          notfound: ERROR_MESSAGE
        }
      };
      this.config = {
        id: 'request',
        method: 'get',
        url: '',
        timeout: 5000,

        successDuration: 0,
        failureDuration: 0
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
    set(elem, config, cb = {
      onSuccess: () => {},
      onFailure: () => {}
    }) {
      config = _.merge({}, this.config, config);
      if (!config || !config.url) return;
      if (!this.isLoading[config.id]) this.isLoading[config.id] = false;
      if (this.isLoading[config.id]) return;

      let startDate = new Date();
      let startTime = startDate.getTime();

      this.start(elem, config);

      return FN.axios(config)
        .then((response) => {
          let duration = this.getCalcurateProcTime(
            startTime,
            config.successDuration
          );

          setTimeout(() => {
            _.isFunction(cb.onSuccess) && cb.onSuccess(response, this);
            _.isFunction(this.onSuccess) && this.onSuccess(response, this);
            this.end(elem, config);
          }, duration);
        })
        .catch((error) => {
          let duration = this.getCalcurateProcTime(
            startTime,
            config.failureDuration
          );

          setTimeout(() => {
            _.isFunction(cb.onFailure) && cb.onFailure(error, this);
            _.isFunction(this.onFailure) && this.onFailure(error, this);
            this.end(elem, config);
          }, duration);
        });
    }

    /**
     * getCalcurateProcTime
     *
     * @param {number} startTime
     * @param {number} baseTime
     */
    getCalcurateProcTime(startTime, baseTime) {
      let endDate = new Date();
      let endTime = endDate.getTime();
      let procTime = endTime - startTime;
      return (baseTime - procTime) > 0
        ? baseTime - procTime
        : 0;
    }

    /**
     * start
     *
     * @param {object} elem
     * @param {object} config
     */
    start(elem, config) {
      this.isLoading[config.id] = true;
      if (elem) {
        elem.classList.add(this.loadingClassName);
      }
      if (this.elem) {
        this.elem.classList.add(this.loadingClassName);
      }
    }

    /**
     * end
     *
     * @param {object} elem
     * @param {object} config
     */
    end(elem, config) {
      if (elem) {
        elem.classList.remove(this.loadingClassName);
      }
      if (this.elem) {
        this.elem.classList.remove(this.loadingClassName);
      }
      this.isLoading[config.id] = false;
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

