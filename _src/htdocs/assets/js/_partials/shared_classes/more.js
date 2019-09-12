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
        initcount: `data-more-initcount`,
        count: `data-more-count`,
        elems: `data-more-elems`
      };

      this.showClassName = `is-show`;
      this.initClassName = `is-init`;

      this.isLoading = false;

      this.initcount = 5;
      this.count = 5;
      this.page = 0;

      this.isInit = true;

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

      let isInit = this.getIsInit();

      let elems = this.getItemElems();
      var count = this.getCalculateCount(page);

      // initcount と countが合わない場合
      if (!isInit) {
        if (this.getInitCount() != this.getCount()) {
          var diffcount = (this.getInitCount() - this.getCount()) + this.getInitCount();
          count.start = count.start - this.getInitCount() + diffcount;
          count.limit = count.limit - this.getInitCount() + diffcount;
        }
      }

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
     * getCountNumber
     *
     * @returns {number}
     */
    getCountNumber() {
      var count = this.getCount()

      if (this.getIsInit()) {
        this.setIsInit(false);
        count = this.getInitCount();
      }

      return count;
    }

    /**
     * getCount
     *
     * @returns {number}
     */
    getCount() {
      let buttonElem = this.getElem();
      var elemCount = buttonElem
        && buttonElem.getAttribute(this.dataAttr.count);
      return elemCount || this.count;
    }

    /**
     * getInitCount
     *
     * @returns {number}
     */
    getInitCount() {
      let buttonElem = this.getElem();
      let elemCount = buttonElem
        && buttonElem.getAttribute(this.dataAttr.initcount);
      return elemCount || this.initcount;
    }

    /**
     * getCalculateCount
     *
     * @param {number} page
     * @returns {object}
     */
    getCalculateCount(page) {
      let count = this.getCountNumber();
      let nowPage = page || this.getPage();
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
     * setPage
     *
     * @param {number} page
     */
    setPage(page) {
      this.page = page;
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
     * setIsInit
     *
     * @param {boolean} bool
     */
    setIsInit(bool) {
      this.isInit = bool;
    }

    /**
     * getIsInit
     *
     * @returns {boolean}
     */
    getIsInit() {
      return this.isInit;
    }

    /**
     * incrementPage
     *
     * @returns {number}
     */
    incrementPage() {
      return this.page++;
    }

    /**
     * decrementPage
     *
     * @returns {number}
     */
    decrementPage() {
      return this.page--;
    }

  };

})(window, document);

