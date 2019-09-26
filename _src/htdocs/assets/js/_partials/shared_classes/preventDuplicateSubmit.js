export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * PreventDuplicateSubmit
   */
  return class PreventDuplicateSubmit {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof PreventDuplicateSubmit)) {
        return new PreventDuplicateSubmit(opts_);
      }

      this.buttonSelector = `.js-submit`;// add input tag

      this.isSubmit = false;
      this.transitionTimeout = (1000 * 2);

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.isSubmit = false;

      if ('onpageshow' in win) {
        win.addEventListener('pageshow', (e) => {
          try {
            if (e && e.persisted && this.isSubmit) {
              this.isSubmit = false;
            }
          } catch(e) {}
        });
      }

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`${this.buttonSelector}`);// delegate
        if (e.target === doc || !elem) return;

        if (!this.isSubmit) {
          this.isSubmit = true;
          setTimeout(() => {
            this.isSubmit = false;
          }, this.transitionTimeout);
        } else {
          e.preventDefault();
        }
      }, false);
    }

  };

})(window, document);

