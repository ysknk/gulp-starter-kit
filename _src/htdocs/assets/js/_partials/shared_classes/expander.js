export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Expander
   * <div class="js-expander">
   *   <div class="js-expander_outer">
   *     <div class="js-expander_inner">hoge</div>
   *   </div>
   *   <div class="r-expander" data-expander="{&quot;content&quot;: &quot;.js-expander&quot;}"><span class="r-expander_fade"></span><a class="js-expander_button" href="javascript:void(0)"></a></div>
   * </div>
   */
  return class Expander {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Expander)) {
        return new Expander(opts_);
      }

      this.duration = 300;
      this.easing = 'easeInOutQuart';

      this.baseSelector = 'body';
      this.elemSelector = '.js-expander';
      this.outerSelector = `${this.elemSelector}_outer`;
      this.innerSelector = `${this.elemSelector}_inner`;
      this.buttonSelector = `${this.elemSelector}_button`;

      this.initializeClassName = 'is-initialize';
      this.openClassName = 'is-open';
      this.openedClassName = 'is-opened';

      this.isInitializeScroll = false;
      this.isCloseScroll = false;

      // config initialize
      this.lineLimit = 6;
      this.expandLabel = '続きを読む';
      this.collapseLabel = 'もっと少なく読む';

      this.customTag = 'expander';
      this.dataAttr = 'data-expander';

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`${this.baseSelector} [${this.dataAttr}]`);
        if (e.target === doc || !elem) return;

        this[this.hasOpen(elem) ?
          'close' : 'open'](elem);
      }, false);
    }

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
      if (elem.classList.contains(this.initializeClassName)) return;
      elem.classList.add(this.initializeClassName);

      let data = this.getData(elem);
      let childElems = this.getChildElems(data.content);
      if (!childElems) return;

      this.simpleClose(elem);

      let innerHeight = childElems.innerElem.clientHeight;
      let outerHeight = childElems.outerElem.clientHeight;

      // not expander initialize
      if (innerHeight < outerHeight) {
        elem.style.display = 'none';
        childElems.outerElem.style.height = '';
        childElems.outerElem.style.overflow = '';
        childElems.buttonElem.innerHTML = '';
      }
    }

    /**
     * simpleClose
     * not animation
     *
     * @param {object} elem
     */
    simpleClose(elem) {
      let data = this.getData(elem);
      let childElems = this.getChildElems(data.content);
      if (!childElems) return;

      childElems.outerElem.style.height = `${data.lineLimit || this.lineLimit}em`;
      childElems.outerElem.style.overflow = 'hidden';
      childElems.buttonElem.innerHTML = data.expandLabel || this.expandLabel;

      if (this.isInitializeScroll && this.hasOpen(elem)) {
        let contentPos = this.getOffsetPos(childElems.contentElem);
        if (contentPos.y) {
          win.scrollTo(0, contentPos.y);
        }
      }

      elem.style.display = 'block';
      elem.classList.remove(this.openClassName);
      elem.classList.remove(this.openedClassName);
    }

    /**
     * close
     *
     * @param {object} elem
     */
    close(elem) {
      let data = this.getData(elem);
      let childElems = this.getChildElems(data.content);
      if (!childElems) return;

      let lineLimit = data.lineLimit || this.lineLimit;
      let expandLabel = data.expandLabel || this.expandLabel;

      // 1emの高さを取得
      let baseElem = this.createBaseElem(childElems.outerElem);
      let baseHeight = baseElem.getBoundingClientRect().height;
      let limitHeight = (baseHeight * lineLimit);

      FN.anime.remove(childElems.outerElem);

      childElems.outerElem.style.overflow = 'hidden';

      if (this.hasOpen(elem)) {
        elem.classList.remove(this.openClassName);
        elem.classList.remove(this.openedClassName);
        childElems.buttonElem.innerHTML = expandLabel;

        let contentPos = this.getOffsetPos(childElems.contentElem);
        if (this.isCloseScroll && contentPos.y) {
          FN.scroll.goto(childElems.contentElem);
        }
      }

      FN.anime({
        targets: childElems.outerElem,
        height: [`${limitHeight}`],
        duration: this.duration,
        easing: this.easing,
        complete: () => {
          if (!this.hasOpen(elem)) {
            childElems.outerElem.style.height = `${lineLimit}em`;
          }
        }
      });
    }

    /**
     * simpleOpen
     * not animation
     *
     * @param {object} elem
     */
    simpleOpen(elem) {
      if (this.hasOpen(elem)) return;

      let data = this.getData(elem);
      let childElems = this.getChildElems(data.content);
      if (!childElems) return;

      childElems.outerElem.style.height = '';
      childElems.outerElem.style.overflow = '';
      childElems.buttonElem.innerHTML = data.collapseLabel || this.collapseLabel;
      elem.style.display = 'block';
      elem.classList.add(this.openClassName);
      elem.classList.add(this.openedClassName);
    }

    /**
     * open
     *
     * @param {object} elem
     */
    open(elem) {
      if (this.hasOpen(elem)) return;

      let data = this.getData(elem);
      let childElems = this.getChildElems(data.content);
      if (!childElems) return;

      let collapseLabel = data.collapseLabel || this.collapseLabel;

      FN.anime.remove(childElems.outerElem);
      elem.classList.add(this.openClassName);
      childElems.buttonElem.innerHTML = collapseLabel;

      let height = this.getHeight(childElems.outerElem);

      FN.anime({
        targets: childElems.outerElem,
        height: [height.now, height.max],
        duration: this.duration,
        easing: this.easing,
        complete: () => {
          if (this.hasOpen(elem)) {
            elem.classList.add(this.openedClassName);
            childElems.outerElem.style.overflow = 'visible';
            childElems.outerElem.style.height = 'auto';
          }
        }
      });
    }

    /**
     * getHeight
     *
     * @param {object} elem
     * @returns {object}
     */
    getHeight(elem) {
      let now = elem.clientHeight;

      elem.style.overflow = 'visible';
      elem.style.height = 'auto';
      let max = elem.clientHeight;
      elem.style.overflow = 'hidden';
      elem.style.height = now;

      return {
        now,
        max
      };
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
      node.style.lineHeight = 1;
      node.style.pointerEvents  = 'none';

      node.innerHTML = 'a';

      elem.appendChild(node);
      return node;
    }

    /**
     * getChildElems
     *
     * @param {object} elem
     * @returns {object or boolean} elems or false
     */
    getChildElems(elem) {
      let contentElem = doc.querySelector(elem);
      let elems = {
        contentElem,
        outerElem: contentElem.querySelector(this.outerSelector),
        innerElem: contentElem.querySelector(this.innerSelector),
        buttonElem: contentElem.querySelector(this.buttonSelector)
      };

      if (!elems.outerElem ||
        !elems.innerElem ||
          !elems.outerElem ||
            !elems.buttonElem) return false;

      return elems;
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
     * hasOpen
     *
     * @param {object} elem
     * @returns {boolean}
     */
    hasOpen(elem) {
      return elem.classList.contains(this.openClassName);
    }

    /**
     * getOffsetPos
     *
     * @param {object} elem element
     * @returns {object} position x, y
     */
    getOffsetPos(elem) {
      let pos = {x: 0, y: 0};
      while(elem){
        pos.y += elem.offsetTop || 0;
        pos.x += elem.offsetLeft || 0;
        elem = elem.offsetParent;
      }
      return pos;
    }

  };

})(window, document);

