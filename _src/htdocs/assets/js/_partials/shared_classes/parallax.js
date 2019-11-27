export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Parallax
   * <div data-parallax='{"move": "Y", "dir": false, "power": 0.2, "range": 0.2, "prop": "y"}'>hoge</div>
   */
  return class Parallax {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Parallax)) {
        return new Parallax(opts_);
      }

      this.dataAttr = `data-parallax`;

      this.options = {
        move: "Y",// translate${move}
        dir: true,// + or -
        power: 0.5,
        range: 0.4,
        prop: ""// default transform
      };

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    // initialize() {}

    /**
     * update
     */
    update() {
      let elems = doc.querySelectorAll(`[${this.dataAttr}]`);
      let windowData = this.getWindowData();

      _.forEach(elems, (elem, i) => {
        let data = this.getParseData(elem);
        data = _.merge({}, this.options, data);

        let targetData = this.getTargetData(elem);

        let power = 0;
        let perPower = 0;
        let isSetTransform = false;

        // 画面内
        if (targetData.bottom >= windowData.top &&
            windowData.bottom >= targetData.top) {

          let windowMiddle = windowData.top + (windowData.height / 2);
          let targetMiddle = targetData.top + (targetData.height / 2);
          let range = (windowData.height * data.range);

          let bottomRange = (windowMiddle + range);
          let topRange = (windowMiddle - range);

          // 中央よりも上？下？
          if (bottomRange >= targetMiddle && topRange <= targetMiddle) {
            if (windowMiddle >= targetMiddle) {
              power = (targetMiddle - windowMiddle);
            } else if (windowMiddle <= targetMiddle){
              power = (targetMiddle - windowMiddle);
            }
            perPower = ((power / range) * 100) * data.rate;
            isSetTransform = true;
          }
        // 上部限界
        } else if (targetData.bottom >= windowData.top) {
          perPower = 100 * data.rate;
          isSetTransform = true;
        // 下部限界
        } else if (windowData.bottom >= targetData.top) {
          perPower = -(100 * data.rate);
          isSetTransform = true;
        }

        if (isSetTransform) {
          perPower = data.dir ? perPower : -perPower;
          if (data.prop) {
            if (data.prop === `opacity`) {
              elem.style[data.prop] = `${perPower / 100}`;
            } else {
              elem.style[data.prop] = `${perPower}%`;
            }
          } else {
            elem.style.transform = `translate${data.move.toUpperCase()}(${perPower}%)`;
          }
        }

      });
    }

    /**
     * getParseData
     *
     * @param {object} elem
     * @returns {object}
     */
    getParseData(elem) {
      let data = elem.getAttribute(this.dataAttr) || '';
      let parseData = null;

      if (!data) return;

      try {
        parseData = JSON.parse(data);
      } catch(e) {
        if (console.warn) {
          console.warn(e);
        } else {
          console.log(e);
        }
      }
      return parseData;
    }

    /**
     * getTargetData
     *
     * @param {object} elem target
     * @returns {object}
     */
    getTargetData(elem) {
      let top = this.getOffsetPos(elem).y
                || elem.getBoundingClientRect().y + this.getWindowData().top
                || 0;
      let height = elem.getBoundingClientRect().height;

      return {
        top,
        height,
        bottom: (top + height)
      };
    }

    /**
     * getWindowData
     *
     * @returns {object}
     */
    getWindowData() {
      let top = win.pageYOffset;
      let height = win.innerHeight;

      return {
        top,
        height,
        bottom: (top + height)
      };
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

