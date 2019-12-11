export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * FormCheck
   */
  return class FormCheck {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof FormCheck)) {
        return new FormCheck(opts_);
      }

      this.formSelector =  `form`;
      this.buttonSelector = `input[type="submit"], button`;

      this.disabledClassName = 'is-disabled';

      this.dataAttr =  {
        require: `data-form-require`
      };

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let handleFunc = (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`[${this.dataAttr.require}]`);// delegate
        if (e.target === doc || !elem) return;
        this.update();
      };

      doc.addEventListener('change', handleFunc, false);
      doc.addEventListener('keyup', handleFunc, false);
      doc.addEventListener('touchend', handleFunc, false);
    }

    /**
     * update
     */
    update() {
      let formElems = doc.querySelectorAll(this.formSelector);
      _.forEach(formElems, (formElem) => {
        let isEmpty = false;
        let requireElems = formElem.querySelectorAll(`[${this.dataAttr.require}]`);

        _.forEach(requireElems, (requireElem) => {
          let isValid = this.checkValid(requireElem);
          isEmpty = !isValid ? true : false;
          return isValid;
        });

        let buttonElems = formElem.querySelectorAll(this.buttonSelector);
        _.forEach(buttonElems, (buttonElem) => {
          if (isEmpty) {
            buttonElem.parentNode.classList.add(this.disabledClassName);
            buttonElem.classList.add(this.disabledClassName);
          } else {
            buttonElem.parentNode.classList.remove(this.disabledClassName);
            buttonElem.classList.remove(this.disabledClassName);
          }
          buttonElem.disabled = isEmpty ? true : false;
        });
      });
    }

    /**
     * checkValid
     *
     * @param {object} elem
     * @returns {boolean}
     */
    checkValid(elem) {
      if (elem.type == `checkbox` && !elem.checked) {
        return false;
      }

      if (elem.type == `radio`) {
        return this.checkRadioValid(elem);
      }

      if (!elem.value) {
        return false;
      }
      return true;
    }

    /**
     * checkRadioValid
     *
     * @param {object} elem
     * @returns {boolean}
     */
    checkRadioValid(elem) {
      let isChecked = false;
      let groupElems = doc.querySelectorAll(`[name="${elem.name}"]`);
      _.forEach(groupElems, (groupElem) => {
        if (groupElem.checked) {
          _.forEach(groupElems, (groupElem) => {
            groupElem.setAttribute(this.dataAttr.require, '');
          });
          isChecked = true;
          return false;
        }
      });
      return isChecked;
    }

  };

})(window, document);

