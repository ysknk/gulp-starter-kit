export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * Countdown
   * @requires moment.js
   */
  return class Countdown {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Countdown)) {
        return new Countdown(opts_);
      }

      this.dateFormat = `YYYY-M-D H:m`;
      this.targetDate = `2100-12-31 00:00`;

      this.showType = `text`;// text or background

      this.endClassName = `is-countdown-end`;
      this.initClassName = `is-countdown-init`;

      this.dataAttr = {
        date: `data-countdown-date`,
        units: `data-countdown-units`,
        value: `data-countdown-value`
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
      this.date = doc.querySelector(`[${this.dataAttr.date}]`);
      this.elems = doc.querySelectorAll(`[${this.dataAttr.units}]`);

      if (this.date) {
        this.targetDate = this.date.getAttribute(this.dataAttr.date);
      }

      if (this.isEnd()) {
        this.setEnd();
      } else {
        this.updateTime();
      }
    }

    /**
     * getEnd
     *
     * @returns {boolean}
     */
    getEnd() {
      let html = doc.querySelector(`html`);
      return html.classList.contains(this.endClassName);
    }

    /**
     * setEnd
     */
    setEnd() {
      let html = doc.querySelector(`html`);
      if (!html.classList.contains(this.initClassName)) {
        html.classList.add(this.endClassName);
      }
    }

    /**
     * setInit
     */
    setInit() {
      let html = doc.querySelector(`html`);
      if (!html.classList.contains(this.initClassName)) {
        html.classList.add(this.initClassName);
      }
    }

    /**
     * setValues
     */
    setValues() {
      let time = this.getDiffTimes();
      _.forEach(this.elems, (elem) => {
        this.setHTML(time, elem);
      });
      this.setInit();
    }

    /**
     * setHTML
     *
     * @param {string} time
     * @param {object} elem
     */
    setHTML(time, elem) {
      let attr = elem.getAttribute(this.dataAttr.units);
      let value = time[attr];
      if (elem.getAttribute(this.dataAttr.value) == value) return;
      elem.setAttribute(this.dataAttr.value, value);

      switch(this.showType) {
        case `text`:
          elem.innerHTML = value;
          break;

        case `background`:
          let valueElems = elem.querySelectorAll(`[${this.dataAttr.value}]`);
          let splits = value.split(``);

          if (valueElems && valueElems.length) {
            _.forEach(splits, (split, i) => {
              valueElems[i].setAttribute(this.dataAttr.value, split);
            });
          }else{
            elem.innerHTML = ``;
            _.forEach(splits, (split, i) => {
              let span = doc.createElement(`span`);
              span.setAttribute(this.dataAttr.value, split);
              elem.appendChild(span);
            });
          }
          break;
      };
    }

    /**
     * updateTime
     */
    updateTime() {
      setTimeout(() => {
        if (this.isEnd()) {
          this.setEnd();
        } else {
          this.setValues();
          this.updateTime();
        }
      }, 1000);
    }

    /**
     * isEnd
     *
     * @returns {boolean}
     */
    isEnd() {
      let diffTime = this.getTargetDate().diff(FN.moment());
      return (this.getEnd() || !diffTime || diffTime <= 0) ? true : false;
    }

    /**
     * getTargetDate
     *
     * @returns {object} moment
     */
    getTargetDate() {
      return FN.moment(this.targetDate, this.dateFormat);
    }

    /**
     * getDiffTimes
     *
     * @returns {object} days, hours, mins, secs
     */
    getDiffTimes() {
      let diffTime = this.getTargetDate().diff(FN.moment());
      let duration = FN.moment.duration(diffTime);

      let days = Math.floor(duration.asDays());
      // let days = duration.days();
      let hours = duration.hours();
      let mins = duration.minutes();
      let secs = duration.seconds();

      days = this.setZeroPadding(days, '00', 3);
      hours = this.setZeroPadding(hours, '0', 2);
      mins = this.setZeroPadding(mins, '0', 2);
      secs = this.setZeroPadding(secs, '0', 2);

      return {
        days,
        hours,
        mins,
        secs
      };
    }

    /**
     * setZeroPadding
     *
     * @param {number} num
     * @param {string} pad padding
     * @param {number} digit
     * @returns {string}
     */
    setZeroPadding(num, pad = '0', digit = 2) {
      return (pad + num).slice(-digit);
    }

  };

})(window, document);

