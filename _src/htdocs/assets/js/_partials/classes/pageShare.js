export default ((win, doc) => {

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
      if(!(this instanceof PageShare)) {
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

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let separator = ', ';
      let option = [
        'width=' + this.width,
        'height=' + this.height,
        'personalbar=0',
        'toolbar=0',
        'scrollbars=1',
        'sizable=1'
      ].join(separator);

      doc.addEventListener('click', (e) => {
        let elem = e.target.closest('[' + this.dataAttr.share + ']');// delegate
        if(!elem || e.target === doc) return;

        let og = this.meta(elem);
        let attr = elem.getAttribute(this.dataAttr.share);
        let windowName = attr + '_window';

        let left = Number((win.screen.width - this.width) / 2);
        let top = Number((win.screen.height - this.height) / 2);

        option = option + separator + [
          'left=' + left,
          'top=' + top
        ].join(separator);

        switch(attr) {
          case 'twitter':
            window.open([
              'https://twitter.com/share?',
              'url=',
              og.enc.url,
              '&text=',
              og.enc.description
            ].join(''), windowName, option);
            break;
          case 'facebook':
            window.open([
              'https://www.facebook.com/sharer/sharer.php?u=',
              og.enc.url
            ].join(''), windowName, option);
            break;
          case 'line':
            window.open([
              'https://social-plugins.line.me/lineit/share?',
              'url=',
              og.enc.url,
              '&text=',
              og.enc.description
            ].join(''), windowName, option);
            break;
          default:
            break;
        }
      });
    }

    /**
     * meta
     *
     * @param {object} elem has data tags element
     * @returns {object} meta data
     */
    meta(elem) {
      let data = this.dataAttr;

      let og = {
        url: doc.querySelector('meta[property="og:url"]') || '',
        title: doc.querySelector('meta[property="og:title"]') || '',
        description: doc.querySelector('meta[property="og:description"]') || ''
      };

      let url = elem.getAttribute(data.url) ||
        og.url ? og.url.getAttribute('content') : '';

      let title = elem.getAttribute(data.title) ||
        og.title ? og.title.getAttribute('content') : '';

      let description = elem.getAttribute(data.description) ||
        og.description ? og.description.getAttribute('content') : '';

      return {
        url: url,
        title: title,
        description: description,

        enc: {
          url: encodeURIComponent(url),
          title: encodeURIComponent(title),
          description: encodeURIComponent(description)
        }
      }
    }

  };

})(window, document);
