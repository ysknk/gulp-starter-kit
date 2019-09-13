export default ((win, doc) => {
  'use strict';

  const FN = win[NS];
  const ERROR_PAGE_URL = `/error/age.html`;

  /**
   * ageAuth
   */
  return class ageAuth {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof ageAuth)) {
        return new ageAuth(opts_);
      }

      this.wrapId = `age-auth`;
      this.elemSelector = this.wrapId;
      this.openClassName = `is-auth-open`;

      this.htmlElem = doc.querySelector('html');
      this.cpnCode = this.htmlElem.getAttribute(`data-cpn-code`) || ``;
      this.cpnAuth = this.htmlElem.getAttribute(`data-cpn-auth`) || ``;

      this.dataWrap = `mileage_data`
      this.dataType = `Cookie`;// localStorage || Cookie[default]
      this.dataName = `isAgreeAge`;
      this.dataValue = true;
      this.dataExpires = 365;

      this.template = [
        `<div class="${this.elemSelector}">`,
          `<div class="${this.elemSelector}_inner">`,
            `<div class="${this.elemSelector}_lead">`,
              `<p class="${this.elemSelector}_text">このキャンペーンはお酒に関する<br>内容を含んでいます。</p>`,
              `<p class="${this.elemSelector}_text">未成年者の飲酒は法律で禁止されております。</p>`,
              `<p class="${this.elemSelector}_strong">あなたは20歳以上ですか？</p>`,
            `</div>`,
            `<ul class="${this.elemSelector}_buttons">`,
              `<li class="${this.elemSelector}_button -no">`,
                `<a href="javascript:void(0)" onclick="javascript:${NS}.ageAuth.setConfirmNo()">いいえ</a>`,
              `</li>`,
              `<li class="${this.elemSelector}_button -yes">`,
                `<a href="javascript:void(0)" onclick="javascript:${NS}.ageAuth.setConfirmYes()">はい</a>`,
              `</li>`,
            `</ul>`,
          `</div>`,
        `</div>`
      ].join('');

      this.isOpen = false;

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      if (!this.cpnAuth || !this.cpnAuth.match(/^age$/i)) return;
      // エラーページでは認証しない
      if (location.href.match(this.getErrorPageUrl())) return;

      let elem = doc.querySelector(`#${this.wrapId}`);
      if (elem) return;

      let isCheckAge = this.getLocalData(this.dataName);

      // 立ち上げ
      if (!isCheckAge) {
        this.openConfirm(elem);
      }else{
        this.setAgeData();
      }
    }

    /**
     * openConfirm
     *
     * @param {object} elem
     */
    openConfirm(elem) {
      if (this.isOpen) return;
      this.isOpen = true;

      let node = doc.createElement(`div`);
      node.id = this.wrapId;
      node.innerHTML = this.template;

      doc.body.appendChild(node);
      doc.body.classList.add(this.openClassName);

      let event = (e) => {
        e.preventDefault();
      };
      node.removeEventListener('touchmove', event, false);
      node.addEventListener('touchmove', event, false);
    }

    /**
     * setConfirmYes
     */
    setConfirmYes() {
      let elem = doc.querySelector(`#${this.wrapId}`);
      elem.parentNode.removeChild(elem);
      doc.body.classList.remove(this.openClassName);

      this.setAgeData();
    }

    /**
     * setConfirmNo
     */
    setConfirmNo() {
      let url = this.getErrorPageUrl();
      doc.body.classList.remove(this.openClassName);
      location.replace(url);
    }

    /**
     * getErrorPageUrl
     *
     * @returns {string}
     */
    getErrorPageUrl() {
      let dir = this.cpnCode ? `/${this.cpnCode}` : '';
      return `${dir}${ERROR_PAGE_URL}`;
    }

    /**
     * getLocalData
     *
     * @param {string} name
     * @returns {string}
     */
    getLocalData(name) {
      if (this.dataType.match(/^localStorage$/i)) {
        if (!localStorage) return '';
        let data = localStorage.getItem(this.dataWrap);
        return data && JSON.parse(data)[name] || '';
      } else {
        return FN.cookies.get(name) || '';
      }
    }

    /**
     * setLocalData
     *
     * @param {string} name
     * @param {string} value
     * @param {object} options
     */
    setLocalData(name, value, options) {
      if (this.dataType.match(/^localStorage$/i)) {
        if (!localStorage) return;

        let isData = this.getLocalData(this.dataWrap);
        if (isData) return;

        try {
          localStorage.setItem(this.dataWrap, `{"${name}": ${value}}`);
        } catch(e) {
          console.log(e);
        }
      } else {
        FN.cookies.set(name, value, options);
      }
    }

    /**
     * setAgeData
     */
    setAgeData() {
      this.setLocalData(this.dataName, this.dataValue, {
        expires: this.dataExpires
      });
    }

  };

})(window, document);

