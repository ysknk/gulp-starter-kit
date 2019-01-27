export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  /**
   * PageShare
   */
  return class PageShare {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof PageShare)) {
        return new PageShare(opts_);
      }
      this.dataAttr = {
        share: 'data-share',
        url: 'data-url',
        title: 'data-title',
        description: 'data-description'
      };
      this.width = 650;
      this.height = 470;

      this.twitterShareUrl = 'https://twitter.com/share?';
      this.facebookShareUrl = 'https://www.facebook.com/sharer/sharer.php?';
      this.LineShareUrl = 'https://social-plugins.line.me/lineit/share?';

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let elem = e.target.closest(`[${this.dataAttr.share}]`);// delegate
        if (e.target === doc || !elem) return;

        this.open(elem);
      }, false);
    }

    /**
     * open
     *
     * @param {object} elem
     */
    open(elem) {
      let og = this.getMeta(elem);
      let attr = elem.getAttribute(this.dataAttr.share);
      let windowName = `${attr}_window`;

      let left = Number((win.screen.width - this.width) / 2);
      let top = Number((win.screen.height - this.height) / 2);

      let separator = ',';
      let option = [
        `width=${this.width}`,
        `height=${this.height}`,
        'personalbar=0',
        'toolbar=0',
        'scrollbars=1',
        'sizable=1',
        `left=${left}`,
        `top=${top}`
      ].join(separator);

      switch(attr) {
        case 'twitter':
          window.open(`${this.twitterShareUrl}url=${og.enc.url}&text=${og.enc.description}`, windowName, option);
          break;
        case 'facebook':
          window.open(`${this.facebookShareUrl}u=${og.enc.url}`, windowName, option);
          break;
        case 'line':
          window.open(`${this.LineShareUrl}url=${og.enc.url}`, windowName, option);
          break;
        default:
          break;
      }
    }

    /**
     * getMeta
     *
     * @param {object} elem has data tags element
     * @returns {object} meta data
     */
    getMeta(elem) {
      let url = this.getMetaOg(elem, 'url');
      let title = this.getMetaOg(elem, 'title');
      let description = this.getMetaOg(elem, 'description');

      return {
        url: url,
        title: title,
        description: description,

        enc: {
          url: encodeURIComponent(url),
          title: encodeURIComponent(title),
          description: encodeURIComponent(description)
        }
      };
    }

    /**
     * getMetaOg
     *
     * @param {object} elem
     * @param {string} property og:***
     * @returns {string} content
     */
    getMetaOg(elem, property) {
      let ogTag = doc.querySelector(`meta[property="og:${property}"]`) || '';
      let content = elem.getAttribute(this.data[property]) ||
        (ogTag ? ogTag.getAttribute('content') : '');

      return content;
    }

  };

})(window, document);

