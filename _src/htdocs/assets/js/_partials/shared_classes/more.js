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
        elems: `data-more-elems`,

        labelShow: `data-more-label-show`,
        labelHide: `data-more-label-hide`
      };

      this.wrapSelector = ``;

      this.showClassName = `is-show`;
      this.initClassName = `is-init`;

      this.hideClassName = `is-hide`;

      this.notMoreClassName = `not-more`;

      this.isLoading = false;

      this.defaultLabel = `もっと見る`;

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
      this.listInitialize();

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest([// delegate
          `[${this.dataAttr.elems}]`
        ].join(' '));
        if (e.target === doc || !elem) return;

        if (this.isLoading) return;
        this.isLoading = true;

        if (this.isShow()) {
          this.showNextItems();
        } else {
          this.listInitialize();
          this.gotoTop();
        }

        this.isLoading = false;
      }, false);
    }

    /**
     * gotoTop
     */
    gotoTop() {
      let elem = this.getWrapElem();
      if (!elem) return;
      FN.scroll.goto(elem);
    }

    /**
     * listInitialize
     */
    listInitialize() {
      this.setIsInit(true);

      let baseElem = this.getElem();
      if (!baseElem) return;

      let text = this.getLabel(this.dataAttr.labelShow)
        || this.defaultLabel;
      if (text) {
        baseElem.classList.remove(this.hideClassName);
        baseElem.classList.add(this.showClassName);
        this.changeButtonLabel(text, this.dataAttr.labelShow);
      }

      this.setPage(0);

      this.initAllItem();
      this.showNextItems();
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

      if (this.getInitCount() >= elems.length) {
        this.onError(() => {
          let wrapElem = this.getWrapElem();
          if (!wrapElem) return;
          wrapElem.classList.add(this.notMoreClassName);
        });
      }

      // initcount と countが合わない場合
      if (!isInit && this.getInitCount() != this.getCount()) {
        let diffcount = (this.getInitCount() - this.getCount()) + this.getInitCount();
        count.start = count.start - this.getInitCount() + diffcount;
        count.limit = count.limit - this.getInitCount() + diffcount;
      }

      for(var i = count.start; count.limit > i; i++) {
        let elem = elems[i];
        let nextElem = elems[i + 1];

        if (!elem) {
          this.onListEnd();
          break;
        }

        this.showItem(elem);

        if (!nextElem) {
          this.onListEnd();
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
      let elemCount = buttonElem
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
      buttonElem.parentNode.parentNode.removeChild(buttonElem.parentNode);
    }

    /**
     * changeButtonLabel
     *
     * @param {string} label
     * @param {string} data
     */
    changeButtonLabel(label, data) {
      let elem = this.getLabelElem(data);
      if (!elem) return;
      elem.innerHTML = label;
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
     * getWrapElem
     *
     * @returns {object}
     */
    getWrapElem() {
      return this.wrapSelector
        ? doc.querySelector(this.wrapSelector)
        : ``;
    }

    /**
     * getLabel
     *
     * @returns {string}
     */
    getLabel(data) {
      let elem = this.getLabelElem(data);
      if (!elem) return '';
      return elem.getAttribute(data) || '';
    }

    /**
     * getLabelElem
     *
     * @returns {object}
     */
    getLabelElem(data) {
      if (!this.getElem()) return;
      return this.getElem().querySelector(`[${data || this.dataAttr.labelShow}]`);
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
     * onListEnd
     */
    onListEnd(cb) {
      let elem = this.getElem();
      let text = this.getLabel(this.dataAttr.labelHide);
      if (text) {
        elem.classList.remove(this.showClassName);
        elem.classList.add(this.hideClassName);
        this.changeButtonLabel(text, this.dataAttr.labelHide);
        _.isFunction(cb) && cb();
        return;
      }

      this.removeButton();
      _.isFunction(cb) && cb();
    }

    /**
     * isShow
     *
     * @returns {boolean}
     */
    isShow() {
      let elem = this.getElem();
      return elem.classList.contains(this.hideClassName)
        ? false : true;
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

