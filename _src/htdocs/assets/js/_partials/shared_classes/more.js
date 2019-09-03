export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * more
   */
  return class more {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof more)) {
        return new more(opts_);
      }

      this.dataAttr = {
        count: `data-more-count`,
        elems: `data-more-elems`,
      };

      this.showClassName = `is-show`;
      this.initClassName = `is-init`;
      this.isLoading = false;
      this.page = 0;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let baseElem = this.getElem();
      if (!baseElem) return;

      this.initAllItem();
      this.showNextItems();

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest([// delegate
          `[${this.dataAttr.elems}]`
        ].join(' '));
        if (e.target === doc || !elem) return;

        if (this.isLoading) return;
        this.isLoading = true;

        this.showNextItems();

        this.isLoading = false;
      }, false);
    }

    /**
     * initAllItem
     */
    initAllItem() {
      let elems = this.getItemElems();
      _.forEach(elems, (elem) => {
        this.initItem(elem);
      });
    }

    /**
     * initItem
     *
     * @param {object} elem
     */
    initItem(elem) {
      if (!elem) return;
      elem.classList.add(this.initClassName);
      elem.classList.remove(this.showClassName);
    }

    /**
     * showItem
     *
     * @param {object} elem
     */
    showItem(elem) {
      elem.classList.add(this.showClassName);
    }

    /**
     * showItems
     *
     * @param {number} page
     */
    showItems(page) {
      let buttonElem = this.getElem();
      if (!buttonElem) return;
      let elems = this.getItemElems();
      let count = this.getCalculateCount();

      if (count.start > elems.length) {
        this.onError(() => {
          this.decrementPage();
        });
      }

      for(var i = count.start; count.limit > i; i++) {
        let elem = elems[i];
        let nextElem = elems[i + 1];

        if (!elem) {
          this.onError();
          break;
        }

        this.showItem(elem);

        if (!nextElem) {
          this.onError();
          break;
        }
      }
    }

    /**
     * showNextItems
     */
    showNextItems() {
      this.incrementPage();
      this.showItems(this.getPage());
    }

    /**
     * getCalculateCount
     */
    getCalculateCount() {
      let buttonElem = this.getElem();
      let count = buttonElem.getAttribute(this.dataAttr.count);
      let nowPage = this.getPage();
      return {
        start: (nowPage - 1) * count,
        limit: nowPage * count
      };
    }

    /**
     * removeButton
     */
    removeButton() {
      let buttonElem = this.getElem();
      if (!buttonElem) return;
      buttonElem.parentNode.removeChild(buttonElem);
    }

    /**
     * getElem
     *
     * @returns {object}
     */
    getElem() {
      return doc.querySelector(`[${this.dataAttr.elems}]`);
    }

    /**
     * getItemElems
     *
     * @returns {object}
     */
    getItemElems() {
      if (!this.itemElemsSelector) {
        let elem = this.getElem();
        this.itemElemsSelector = elem.getAttribute(this.dataAttr.elems);
      }
      if (!this.itemElems) {
        this.itemElems = doc.querySelectorAll(this.itemElemsSelector);
      }
      return this.itemElems;
    }

    /**
     * onError
     */
    onError(cb) {
      this.removeButton();
      _.isFunction(cb) && cb();
    }

    /**
     * getPage
     *
     * @returns {number}
     */
    getPage() {
      return this.page;
    }

    /**
     * incrementPage
     */
    incrementPage() {
      this.page++;
    }

    /**
     * decrementPage
     */
    decrementPage() {
      this.page--;
    }

  };

})(window, document);

