export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * MouseStalker
   */
  return class MouseStalker {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof MouseStalker)) {
        return new MouseStalker(opts_);
      }

      // this.baseElem = 'body';
      this.baseElem = `.${PREFIX}base`;

      this.targetElem = ``;
      this.elem = '.js-mousestalker';
      this.activeClassName = 'is-active';
      this.throttleTime = 30;
      this.throttleTimeScroll = 30;
      this.throttleTimeResize = 30;
      this.debounceTime = this.throttleTime;

      this.initializeStyle = [
        `position: fixed;`,
        `top: 0;`,
        `left: 0;`,
        `z-index: 100000;`,
        `transform: translate3d(0, 0, 1px);`,
        `transition: all 0.2s ease-out;`,
        `pointer-events: none;`
      ].join(``);

      this.isMouseSet = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let elem = doc.querySelector(this.elem);
      this.onMouseLeave(``, elem);
      this.setInitializeStyle();

      doc.addEventListener('mousemove', _.throttle((e) => {
        this.procedure(e);
      }, this.throttleTime), false);

      doc.addEventListener('mousemove', _.debounce((e) => {
        this.procedure(e);
      }, this.debounceTime), false);

      doc.addEventListener('scroll', _.throttle((e) => {
        this.update();
      }, this.throttleTimeScroll), false);

      doc.addEventListener('resize', _.throttle((e) => {
        this.update();
      }, this.throttleTimeResize), false);

      // 画面外
      doc.addEventListener('mouseleave', _.debounce((e) => {
        if (!e.target) return;
        let elem = doc.querySelector(this.elem);
        this.onMouseLeave(e, elem);
      }, this.debounceTime), false);
    }

    /**
     * procedure
     *
     * @param {object} e event
     */
    procedure(e) {
      if (!e.target) return;
      let targetElem = this.targetElem ?
        e.target.closest(this.targetElem) : doc;

      let elem = doc.querySelector(this.elem);
      elem.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 1px)`;
      this.setMousePos(e.clientX, e.clientY);

      if (e.target === doc || !targetElem) {
        this.onMouseLeave(e, elem);
      } else {
        this.onMouseEnter(e, elem);
        this.isMouseSet = true;
      }
    }

    /**
     * update
     */
    update() {
      if (!this.isMouseSet) return;
      const mousePos = this.getMousePos();
      if (!mousePos || !mousePos.x || !mousePos.y) return;
      const elem = doc.elementFromPoint(mousePos.x, mousePos.y);
      if (!elem) return;
      this.procedure({
        target: elem,
        clientX: mousePos.x,
        clientY: mousePos.y
      });
    }

    /**
     * getMousePos
     *
     * @returns {object} x, y
     */
    getMousePos() {
      return this.mousePos || false;
    }

    /**
     * setMousePos
     *
     * @param {number} x
     * @param {number} y
     * @returns {object} x, y
     */
    setMousePos(x, y) {
      this.mousePos = {x, y};
    }

    /**
     * setInitializeStyle
     */
    setInitializeStyle() {
      if (!this.initializeStyle) return;
      let headElem = doc.querySelector('head');
      let styleElem = doc.createElement('style');
      let elemSelector = [this.baseElem, this.elem].join(` `);
      styleElem.innerHTML = `${elemSelector} {${this.initializeStyle}}`;
      headElem.appendChild(styleElem);
    }

    /**
     * onMouseEnter
     *
     * @param {object} e event
     * @param {object} elem
     */
    onMouseEnter(e, elem) {
      if (!elem) return;
      elem.classList.add(this.activeClassName);
    }

    /**
     * onMouseLeave
     *
     * @param {object} e event
     * @param {object} elem
     */
    onMouseLeave(e, elem) {
      if (!elem) return;
      // elem.style.transform = ``;
      elem.classList.remove(this.activeClassName);
    }

  };

})(window, document);

