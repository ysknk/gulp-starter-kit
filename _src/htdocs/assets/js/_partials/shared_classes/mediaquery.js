export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   *  MediaQuery
   */
  return class MediaQuery {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof MediaQuery)) {
        return new MediaQuery(opts_);
      }

      this.baseElem = 'body';

      this.point = [
        {
          name: 'layout-sp',
          src: {
            __DEFAULT__: 'data-sp-src'
          },
          size: {
            max: 750
          }
        },
        {
          name: 'layout-pc',
          src: {
            __DEFAULT__: 'data-pc-src'
          },
          size: {
            min: 751
          }
        }
      ];

      this.html = doc.querySelector('html');

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      this.update();
    }

    /**
     * update
     */
    update() {
      let width = this.getWidth();
      let beforePoint = this.getCurrentPoint() || undefined;

      _.forEach(this.point, (point, i) => {
        // minがなければmax以下全て
        if (!point.size.min && point.size.max >= width) {
          this.setCurrentPoint({config: point, num: i});
        // maxがなければどこまでも
        } else if (!point.size.max && point.size.min <= width) {
          this.setCurrentPoint({config: point, num: i});
        // minより大きく、maxより小さい
        } else if (point.size.max >= width && point.size.min <= width) {
          this.setCurrentPoint({config: point, num: i});
        // その他
        } else {
          this.html.classList.remove(point.name);
        }
      });

      let currentPoint = this.getCurrentPoint();
      if (!beforePoint && currentPoint ||
        beforePoint.config.name != currentPoint.config.name) {
        this.html.classList.add(currentPoint.config.name);
        this.setImgSrc(currentPoint);
        _.isFunction(this.onChange) && this.onChange(this);
      }
    }

    /**
     * setImgSrc
     *
     * @param {object} point break point object
     */
    setImgSrc(point) {
      if (!point) return;

      if (this.html.classList.contains(point.config.name)) {
        for(var key in point.config.src) {
          let elems = doc.querySelectorAll([
            this.baseElem,
            `[${point.config.src[key]}]`
          ].join(' '));

          _.forEach(elems, (elem) => {
            if (key != '__DEFAULT__' && !elem.classList.contains(key)) return;
            let data = this.point[point.num].src[key];
            if (!elem.src || !elem.src.match(elem.getAttribute(data))) {
              elem.src = elem.getAttribute(data);
            }
          });
        }
      }
    }

    /**
     * getWidth
     *
     * @returns {number} window width
     */
    getWidth() {
      return parseInt(this.html.getBoundingClientRect().width);
    }

    /**
     * getCurrentPoint
     *
     * @returns {object} break point
     */
    getCurrentPoint() {
      return this.currentPoint || false;
    }

    /**
     * setCurrentPoint
     *
     * @param {object} config
     */
    setCurrentPoint(config) {
      this.currentPoint = config;
    }

    /**
     * onChange
     *
     * @param {object} obj class object
     */
    onChange(obj) {}

  };

})(window, document);

