import axios from 'axios';

export default ((win, doc) => {

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
      this.elem = doc.querySelector('html');
      this.loadingClassName = 'is-ajax-loading';
      this.isLoading = false;
      this.config = {
        method: 'get',
        url: '',
        timeout: 5000
      };

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {}

    /**
     * set
     */
    set(elem, config, cb = {success: () => {}, failure: () => {}}) {
      if(this.isLoading || !config || !config.url) return;
      config = _.merge({}, this.config, config)

      this.start(elem);

      axios(config)
        .then((response) => {
          return new Promise((resolve, reject) => {
            return _.isFunction(this.onBeforeSuccess) &&
              this.onBeforeSuccess(resolve, reject, response, this);
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              return _.isFunction(cb.success) &&
                cb.success(resolve, reject, response, this);
            });
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              return _.isFunction(this.onAfterSuccess) &&
                this.onAfterSuccess(resolve, reject, response, this);
            });
          })
        })
        .catch((error) => {
          return new Promise((resolve, reject) => {
            return _.isFunction(this.onBeforeFailure) &&
              this.onBeforeFailure(resolve, reject, error, this);
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              return _.isFunction(cb.failure) &&
                cb.failure(resolve, reject, error, this);
            });
          })
          .then(() => {
            return new Promise((resolve, reject) => {
              return _.isFunction(this.onAfterFailure) &&
                this.onAfterFailure(resolve, reject, error, this);
            });
          })
        })
        .finally(() => {
          this.end(elem);
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
     * onBeforeSuccess
     *
     * @param {function} resolve promise
     * @param {function} reject promise
     * @param {object} response object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onBeforeSuccess(resolve, reject, response, obj) {
      return resolve();
    }

    /**
     * onAfterSuccess
     *
     * @param {function} resolve promise
     * @param {function} reject promise
     * @param {object} response object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onAfterSuccess(resolve, reject, response, obj) {
      return resolve();
    }

    /**
     * onBeforeFailure
     *
     * @param {function} resolve promise
     * @param {function} reject promise
     * @param {object} response object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onBeforeFailure(resolve, reject, error, obj) {
      return resolve();
    }

    /**
     * onAfterFailure
     *
     * @param {function} resolve promise
     * @param {function} reject promise
     * @param {object} response object
     * @param {object} obj class object
     * @returns {object} promise
     */
    onAfterFailure(resolve, reject, error, obj) {
      return resolve();
    }

  };

})(window, document);
