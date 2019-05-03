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
      this.targetDate = `2019-7-10 13:00`;

      this.endClassName = `is-countdown-end`;

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
     * setEnd
     */
    setEnd() {
      let html = doc.querySelector(`html`);
      html.classList.add(this.endClassName);
    }

    /**
     * setHTML
     */
    setHTML() {
      let time = this.getDiffTimes();
      _.forEach(this.elems, (elem) => {
        let attr = elem.getAttribute(this.dataAttr.units);
        let value = time[attr];
        if (elem.getAttribute(this.dataAttr.value) == value) return;
        elem.setAttribute(this.dataAttr.value, value);
        elem.innerHTML = value;
      });
    }

    /**
     * updateTime
     */
    updateTime() {
      setTimeout(() => {
        if (this.isEnd()) {
          this.setEnd();
        } else {
          this.setHTML();
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
      return (!diffTime || diffTime <= 0) ? true : false;
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

      days = this.setZeroPadding(days, '0', 2);
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

