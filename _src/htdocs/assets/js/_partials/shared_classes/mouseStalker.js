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
      this.baseElemSelector = `.${PREFIX}base`;

      this.targetElems = {
        'is-active': 'body'// classname: selector
      };

      this.elemSelector = '.js-mousestalker';
      this.cursorElemSelector = `${this.parentElemSelector}__cursor`;
      this.throttleTime = 10;
      this.cursorRange = 0.15;
      this.cursorDuration = 0.002;

      this.isMouseOver = false;
      this.isMouseSet = false;

      this.mouse = {
        x: 0,
        y: 0
      };
      this.cursor = {
        x: 0,
        y: 0
      };

      this.transformZ = 2;

      this.elemInitializeStyle = [
        `position: fixed;`,
        `top: 0;`,
        `left: 0;`,
        `z-index: 100000;`,
        `width: 100%;`,
        `height: 100%;`,
        `pointer-events: none;`
      ].join(``);

      this.cursorElemInitializeStyle = [
        `position: absolute;`,
        `z-index: 100;`,
        `top: 0;`,
        `left: 0;`,
        `transform: translate3d(0, 0, ${this.transformZ}px);`,
        `pointer-events: none;`
      ].join(``);

      this.animationFrame = false;

      this.isEventInitialize = false;
      this.throttleTimeScroll = this.throttleTime;
      this.debounceTimeResize = this.throttleTime;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let elem = this.getElem(`cursorElem`);
      _.forEach(this.targetElems, (targetElem, name) => {
        this.onMouseLeave(``, elem, name);
      });
      this.setInitializeStyle();

      if (!this.isEventInitialize) return;

      doc.body.addEventListener('mousemove', _.throttle((e) => {
        this.procedure(e);
      }, this.throttleTime), false);

      doc.body.addEventListener('mouseover', (e) => {
        this.documentIn();
      }, false);

      doc.body.addEventListener('mouseleave', (e) => {
        this.documentOut(e);
      }, false);

      win.addEventListener('scroll', _.throttle((e) => {
        this.update();
      }, this.throttleTimeScroll), false);

      win.addEventListener('resize', _.debounce((e) => {
        this.update();
      }, this.debounceTimeResize), false);
    }

    /**
     * getWindowSize
     *
     * @returns {object} width, height
     */
    getWindowSize() {
      let elem = this.getElem(`elem`);
      return {
        width: elem.getBoundingClientRect().width,
        height: elem.getBoundingClientRect().height
      };
    }

    /**
     * start
     */
    start() {
      let elem = this.getElem(`cursorElem`);
      let threshold = 1;

      this.mouse.x - this.cursor.x < threshold && this.mouse.x - this.cursor.x > - threshold
        ? this.cursor.x = this.mouse.x
        : this.cursor.x += (this.mouse.x - this.cursor.x) * this.cursorRange;

      this.mouse.y - this.cursor.y < threshold && this.mouse.y - this.cursor.y > - threshold
        ? this.cursor.y = this.mouse.y
        : this.cursor.y += (this.mouse.y - this.cursor.y) * this.cursorRange;

      FN.anime({
        targets: elem,
        translateX: this.cursor.x,
        translateY: this.cursor.y,
        translateZ: this.transformZ,
        duration: this.cursorDuration
      });
      // FN.gsap.set(elem, {
      //   x: this.cursor.x,
      //   y: this.cursor.y,
      //   z: this.transformZ,
      //   duration: this.cursorDuration,
      //   force3D: true
      // });

      this.requestAnimation(`animationFrame`, `start`);
    }

    /**
     * requestAnimation
     *
     * @param {number} animation
     * @param {function} func
     */
    requestAnimation(animation, func) {
      this[animation] = window.requestAnimationFrame(() => {this[func]()});
    }

    /**
     * cancelAnimation
     *
     * @param {number} animation
     */
    cancelAnimation(animation) {
      window.cancelAnimationFrame(this[animation]);
      this[animation] = 0;
    }

    /**
     * procedure
     *
     * @param {object} e event
     */
    procedure(e) {
      e = e || win.event;
      if (!e.target) return;

      let elem = this.getElem(`cursorElem`);
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      _.forEach(this.targetElems, (targetElem, name) => {
        targetElem = targetElem ?
          e.target.closest(targetElem) : doc;

        if (!this.isMouseOver) {
          this.onMouseLeave(e, elem, name);
          return;
        }

        if (e.target === doc || !targetElem) {
          this.onMouseLeave(e, elem, name);
        } else {
          this.onMouseEnter(e, elem, name);
          this.isMouseSet = true;
        }
      });
    }

    /**
     * documentIn
     */
    documentIn() {
      if (!this.isMouseOver && !this.animationFrame) {
        this.requestAnimation(`animationFrame`, `start`);
      }
      this.isMouseOver = true;
    }

    /**
     * documentOut
     *
     * @param {object} e event
     */
    documentOut(e) {
      if (!e.target) return;
      let elem = this.getElem(`cursorElem`);
      _.forEach(this.targetElems, (targetElem, name) => {
        this.onMouseLeave(e, elem, name);
      });
      this.cancelAnimation(`animationFrame`);
      this.isMouseOver = false;
    }

    /**
     * update
     */
    update() {
      if (!this.isMouseSet) return;
      const elem = doc.elementFromPoint(this.mouse.x, this.mouse.y);

      if (!elem) return;
      this.procedure({
        target: elem,
        clientX: this.mouse.x,
        clientY: this.mouse.y
      });
    }

    /**
     * getElem
     *
     * @returns {object}
     */
    getElem(name) {
      if (!this[name]) {
        this[name] = doc.querySelector(this[`${name}Selector`]);
      }
      return this[name];
    }

    /**
     * setInitializeStyle
     */
    setInitializeStyle() {
      if (!this.elemInitializeStyle && !this.cursorElemInitializeStyle) return;
      let headElem = doc.querySelector('head');
      let styleElem = doc.createElement('style');

      let elemSelector = [
        this.baseElemSelector,
        this.elemSelector
      ].join(` `);

      let cursorElemSelector = [
        this.baseElemSelector,
        this.cursorElemSelector
      ].join(` `);

      styleElem.innerHTML = [
        `${elemSelector} {${this.elemInitializeStyle}}`,
        `${cursorElemSelector} {${this.cursorElemInitializeStyle}}`
      ].join(``);
      headElem.appendChild(styleElem);
    }

    /**
     * onMouseEnter
     *
     * @param {object} e event
     * @param {object} elem
     * @param {string} name
     */
    onMouseEnter(e, elem, name) {
      if (!elem) return;
      elem.classList.add(name);
    }

    /**
     * onMouseLeave
     *
     * @param {object} e event
     * @param {object} elem
     * @param {string} name
     */
    onMouseLeave(e, elem, name) {
      if (!elem) return;
      elem.classList.remove(name);
    }

  };

})(window, document);

