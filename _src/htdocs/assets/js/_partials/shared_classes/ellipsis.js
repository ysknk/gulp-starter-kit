export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Ellipsis
   * <p data-ellipsis>hoge</p>
   */
  return class Ellipsis {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Ellipsis)) {
        return new Ellipsis(opts_);
      }

      this.initializeClassName = 'is-initialize';

      // config initialize
      this.lineLimit = 3;
      this.ellipsisLabel = '…';

      this.customTag = 'ellipsis';
      this.dataAttr = 'data-ellipsis';

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * updateAll
     */
    updateAll() {
      let elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      if (!elems || !elems.length) return;

      _.forEach(elems, (elem) => {
        this.update(elem);
      });
    }

    /**
     * update
     *
     * @param {object} elem
     */
    update(elem) {
      if (this.hasInitialize(elem)) return;
      elem.classList.add(this.initializeClassName);

      let data = this.getData(elem);

      let elemText = elem.innerHTML;
      let baseElem = this.createBaseElem(elem);
      let baseHeight = baseElem.getBoundingClientRect().height;

      let lineLimit = data.lineLimit || this.lineLimit;
      let ellipsisLabel = data.ellipsisLabel || this.ellipsisLabel;

      let limitHeight = (baseHeight * lineLimit);

      if (elem.clientHeight > limitHeight) {
        elem.style.position = 'relative';
        elem.style.height = `${limitHeight}px`;
        elem.style.overflow = 'hidden';

        let html = this.optimText({
          elem: baseElem,
          label: ellipsisLabel,
          limit: limitHeight
        }, [...elemText]);
        baseElem.parentNode.removeChild(baseElem);
        elem.innerHTML = html;

        elem.style.position = '';
        elem.style.height = '';
        elem.style.overflow = '';
      } else {
        baseElem.parentNode.removeChild(baseElem);
      }
    }

    /**
     * optimText
     *
     * @param {object} obj elem, label, limit
     * @param {array} text
     * @param {number} removeCount=1
     * @returns {string} html
     */
    optimText(obj, text, removeCount = 1) {
      let joinText = (text.slice(0, text.length - removeCount).join(``));
      obj.elem.innerHTML = joinText + obj.label;

      // 2倍以上の高さがあれば 1/4 カット
      if ((obj.elem.clientHeight / obj.limit) >= 2) {
        let cutLength = ([...joinText].length / 4);// 全て半角英数だとしても消し込みすぎないように
        this.optimText(obj, [...joinText], (cutLength - (cutLength % 1)));
      } else if (obj.elem.clientHeight > obj.limit) {
        this.optimText(obj, [...joinText]);
      }
      return obj.elem.innerHTML;
    }

    /**
     * createBaseElem
     *
     * @param {object} elem
     * @returns {object}
     */
    createBaseElem(elem) {
      let node = elem.querySelector(this.customTag) || '';
      if (node) {return node;}

      node = doc.createElement(this.customTag);
      node.style.display = 'block';
      node.style.position = 'absolute';
      node.style.width = '100%';
      node.style.top = '-99999px';
      node.style.left = '-99999px';
      node.style.zIndex = -100;
      node.style.visibility = 'hidden';
      node.style.pointerEvents  = 'none';

      node.innerHTML = 'a';

      elem.appendChild(node);
      return node;
    }

    /**
     * getData
     *
     * @param {object} elem
     * @returns {object}
     */
    getData(elem) {
      let data = elem.getAttribute(this.dataAttr);
      if (!data) return false;

      return JSON.parse(data);
    }

    /**
     * hasInitialize
     *
     * @param {object} elem element
     * @returns {boolean}
     */
    hasInitialize(elem) {
      return elem.classList.contains(this.initializeClassName);
    }

  };

})(window, document);

