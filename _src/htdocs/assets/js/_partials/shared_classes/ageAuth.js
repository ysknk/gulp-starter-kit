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

      this.htmlElem = doc.querySelector('html');
      this.cpnCode = this.htmlElem.getAttribute(`data-cpn-code`);

      this.cookieName = `age_auth`;
      this.cookieValue = `over20`;
      this.cookieExpires = 365;

      this.template = [
        `<div class="${this.elemSelector}">`,
          `<div class="${this.elemSelector}_text">`,
            `<p>このキャンペーンはお酒に関する<br>内容を含んでいます。</p>`,
            `<p>未成年者の飲酒は法律で禁止されております。</p>`,
            `<p>あなたは20歳以上ですか？</p>`,
          `</div>`,
          `<ul class="${this.elemSelector}_buttons">`,
            `<li class="${this.elemSelector}_button -no">`,
              `<a href="javascript:void(0)" onclick="javascript:${NS}.ageAuth.setConfirmNo()">いいえ</a>`,
            `</li>`,
            `<li class="${this.elemSelector}_button -yes">`,
              `<a href="javascript:void(0)" onclick="javascript:${NS}.ageAuth.setConfirmYes()">はい</a>`,
            `</li>`,
          `</ul>`,
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
      // エラーページでは認証しない
      if (location.href.match(this.getErrorPageUrl())) return;

      let elem = doc.querySelector(`#${this.wrapId}`);
      if (elem) return;

      let isCheckAge = this.getCookie(this.cookieName);

      // 立ち上げ
      if (!isCheckAge) {
        this.openConfirm(elem);
      }else{
        this.setAgeCookie();
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
    }

    /**
     * setConfirmYes
     */
    setConfirmYes() {
      let elem = doc.querySelector(`#${this.wrapId}`);
      elem.parentNode.removeChild(elem);

      this.setAgeCookie();
    }

    /**
     * setConfirmNo
     */
    setConfirmNo() {
      let url = this.getErrorPageUrl();
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
     * getCookie
     *
     * @param {string} name
     * @returns {string}
     */
    getCookie(name) {
      return FN.cookies.get(name) || '';
    }

    /**
     * setCookie
     *
     * @param {string} name
     * @param {string} value
     * @param {object} options
     */
    setCookie(name, value, options) {
      FN.cookies.set(name, value, options);
    }

    /**
     * setAgeCookie
     *
     */
    setAgeCookie() {
      this.setCookie(this.cookieName, this.cookieValue, {
        expires: this.cookieExpires
      });
    }

  };

})(window, document);

