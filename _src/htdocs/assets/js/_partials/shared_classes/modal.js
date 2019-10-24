export default ((win, doc) => {
  'use strict';

  const FN = win[NS];

  // common state
  let isOpen = false;
  let isChange = false;

  /**
   *  Modal
   *  <a href="javascript:void(0)" data-modal-open="" data-modal-template="#modal-template">button</a>
   *  <script id="modal-template" type="text/template">
   *    <p>modal content</p>
   *  </script>
   */
  return class Modal {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if (!(this instanceof Modal)) {
        return new Modal(opts_);
      }

      this.baseElem = 'body';

      this.isFixed = true;
      this.isSetHeight = false;
      this.styles = {
        display: 'block',
        top: 0,
        left: 0,
        zIndex: 99999,
        width: '100%',
        height: '100%',
        // background: '#fff',
        opacity: 0
      };

      this.wrapperElem = '#wrapper';
      this.alignRightElem = '.js-fixed-right';

      this.name = {};
      this.name.modal = `${PREFIX}modal`;
      this.name.close = `${this.name.modal}_close`;
      this.name.container = `${this.name.modal}_container`;
      this.name.wrapper = `${this.name.modal}_wrapper`;
      this.name.outer = `${this.name.modal}_outer`;
      this.name.background = `${this.name.modal}_background`;
      this.name.inner = `${this.name.modal}_inner`;
      this.name.content = `${this.name.modal}_content`;

      this.name.notScroller = 'js-not-scroller';

      this.dataAttr = {
        open: 'data-modal-open',
        close: 'data-modal-close',
        template: 'data-modal-template',
        name: 'data-modal-name'
      };

      this.separater = {
        page: '--'
      };

      this.state = {
        open: 'is-modal-open',
        close: 'is-modal-close'
      };

      this.animate = {
        open: {
          duration: 300,
          easing: 'easeInOutQuart'
        },
        close: {
          duration: 300,
          easing: 'easeInOutQuart'
        }
      };

      this.template = ['',
        `<div id="${this.name.wrapper}">`,
          `<div id="${this.name.outer}">`,
            `<div id="${this.name.background}" data-modal-close="" onclick=""></div>`,
            `<div id="${this.name.inner}">`,

              `<div id="${this.name.container}">`,
                `<div id="${this.name.close}">`,
                  `<a href="javascript:void(0)" data-modal-close="" onclick=""></a>`,
                `</div>`,
                `<div id="${this.name.content}"></div>`,
              `</div>`,
            `</div>`,
          `</div>`,
        `</div>`
      ].join('');

      _.isObject(opts_) && _.extend(this, opts_);

      // this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let open = [
        this.baseElem,
        `[${this.dataAttr.open}]`
      ].join(' ');

      let close = [
        this.baseElem,
        `[${this.dataAttr.close}]`
      ].join(' ');

      doc.addEventListener('click', (e) => {
        if (!e.target || !e.target.closest) return;
        let openElem = e.target.closest(open);// delegate
        let closeElem = e.target.closest(close);// delegate

        let isElemUndefined = (!openElem && !closeElem);

        if (e.target === doc || isElemUndefined) return;

        // open
        if (openElem) {
          this.open(openElem);
        // close
        } else if (closeElem) {
          this.close(closeElem);
        }
      }, false);
    }

    /**
     * open
     *
     * @param {object} btn element
     * @param {object} opts options
     */
    open(elem, opts) {
      if (isChange) return;

      if (this.hasOpen(elem)) {
        this.close(elem);
        return;
      }

      let template = this.getTemplateElem(elem, opts);
      let modal = this.getModal(template);
      let html = _.template(template.innerHTML);
      let parseData = this.getParseData(elem, opts);

      modal.classList.add(this.state.open);
      elem.classList.add(this.state.open);

      if (isOpen) {
        this.changeContent(html, parseData);
      } else {
        if (this.isFixed) {
          this.fixedOpen();
        } else {
          this.update();
        }

        let content = doc.getElementById(this.name.content);
        content.innerHTML = html({
          modal: this,
          data: parseData
        });

        this.setPosTop();

        _.isFunction(this.onBeforeOpen) && this.onBeforeOpen(this);
        opts && _.isFunction(opts.onBeforeOpen) && opts.onBeforeOpen(this);

        this.imgLoadEnd(modal, () => {
          FN.anime.remove(modal);

          modal.style.position = this.isFixed ? 'fixed' : 'absolute';
          _.forEach(this.styles, (value, key) => {
            modal.style[key] = value;
          });

          this.animate.open.complete = () => {
            _.isFunction(this.onAfterOpen) && this.onAfterOpen(this);
            opts && _.isFunction(opts.onAfterOpen) && opts.onAfterOpen(this);
          };

          setTimeout(() => {
            FN.anime({
              targets: modal,
              opacity: 1,
              ...this.animate.open
            });
          }, 0);
        });
      }

      isOpen = true;
      this.setPrevElem(elem);
    }

    /**
     * getTemplateElem
     *
     * @param {object} elem
     * @param {object} opts
     * @returns {object}
     */
    getTemplateElem(elem, opts) {
      let template = opts && opts.template
        ? opts.template
        : elem.getAttribute(this.dataAttr.template);
      return doc.querySelector(template);
    }

    /**
     * getParseData
     *
     * @param {object} elem
     * @param {object} opts
     * @returns {object}
     */
    getParseData(elem, opts) {
      let data = elem.getAttribute(this.dataAttr.open) || '';
      let parseData = null;

      if (opts && opts.data) {
        parseData = opts.data;
      } else if (!data) {
        return;
      }

      if (!parseData) {
        try {
          parseData = JSON.parse(data);
        }catch(e) {
          if (console.warn) {
            console.warn(e);
          } else {
            console.log(e);
          }
        }
      }

      return this.getPager(elem, parseData);
    }

    /**
     * showContent
     *
     * @param {string} html
     * @param {object} opts options
     */
    showContent(html, opts) {
      let content = doc.getElementById(this.name.content);

      FN.anime.remove(content);
      content.innerHTML = html;

      this.setPosTop();

      _.isFunction(this.onBeforeOpen) && this.onBeforeOpen(this);
      opts && _.isFunction(opts.onBeforeOpen) && opts.onBeforeOpen(this);

      this.imgLoadEnd(content, () => {
        content.style.display = 'block';

        this.animate.open.complete = () => {
          _.isFunction(this.onAfterOpen) && this.onAfterOpen(this);
          opts && _.isFunction(opts.onAfterOpen) && opts.onAfterOpen(this);
        };
        FN.anime({
          targets: content,
          opacity: 1,
          ...this.animate.open
        });
      });
    }

    /**
     * close
     *
     * @param {object} elem btn
     * @param {object} opts options
     */
    close(elem, opts) {
      let modal = doc.getElementById(this.name.modal);
      let content = doc.getElementById(this.name.content);

      if (this.isFixed) {
        this.fixedClose();
      }

      _.isFunction(this.onBeforeClose) && this.onBeforeClose(this);
      opts && _.isFunction(opts.onBeforeClose) && opts.onBeforeClose(this);

      this.getPrevElem().classList.remove(this.state.open);
      elem.classList.remove(this.state.open);

      this.animate.close.complete = () => {
        _.forEach(this.styles, (value, key) => {
          modal.style[key] = '';
        });

        modal.style.display = 'none';
        modal.style.position = '';
        content.innerHTML = '';
        isOpen = false;

        _.isFunction(this.onAfterClose) && this.onAfterClose(this);
        opts && _.isFunction(opts.onAfterClose) && opts.onAfterClose(this);
      };

      FN.anime.remove(modal);
      modal.classList.remove(this.state.open);
      modal.classList.add(this.state.close);

      FN.anime({
        targets: modal,
        opacity: 0,
        ...this.animate.close
      });
    }

    /**
     * hideContent
     *
     * @param {object} elem btn
     * @param {object} opts options
     */
    hideContent(elem, opts) {
      isChange = true;
      let content = doc.getElementById(this.name.content);

      elem.classList.remove(this.state.open);

      _.isFunction(this.onBeforeClose) && this.onBeforeClose(this);
      opts && _.isFunction(opts.onBeforeClose) && opts.onBeforeClose(this);

      this.animate.close.complete = () => {
        content.innerHtml = '';
        content.style.dispaly = 'none';
        isChange = false;

        _.isFunction(this.onAfterClose) && this.onAfterClose(this);
        opts && _.isFunction(opts.onAfterClose) && opts.onAfterClose(this);
      };

      FN.anime.remove(content);
      FN.anime({
        targets: content,
        opacity: 0,
        ...this.animate.close
      });
    }

    /**
     * changeContent
     *
     * @param {object} template html template
     * @param {object} data json parse
     */
    changeContent(template, data) {
      let prev = this.getPrevElem();
      this.hideContent(prev, {
        onAfterClose: () => {
          this.showContent(template({
            modal: this,
            data: data
          }));
        }
      });
    }

    /**
     * imgLoadEnd
     *
     * @param {object} elem modal
     * @param {function} cb callback
     */
    imgLoadEnd(elem, cb) {
      let imgLoad = '';
      try {
        imgLoad = imagesLoaded(elem);
      }catch(e) {}

      if (imgLoad) {
        imgLoad.on('always', () => {
          setTimeout(() => {
            _.isFunction(cb) && cb();
          }, 0);
        });

        imgLoad.on('fail', () => {
          setTimeout(() => {
            _.isFunction(cb) && cb();
          }, 0);
        });
      } else {
        _.isFunction(cb) && cb();
      }
    }

    /**
     * fixedOpen
     */
    fixedOpen() {
      let wrapper = doc.querySelector(this.wrapperElem);
      if (!wrapper) return;

      let scrollY = win.pageYOffset || doc.documentElement.scrollTop;
      this.setScrollTop(scrollY);

      wrapper.style.position = 'fixed';
      wrapper.style.right = '0';
      wrapper.style.left = '0';
      wrapper.style.width = '100%';
      wrapper.style.top = `${-1 * scrollY}px`;

      doc.querySelector('html').classList.add(this.state.open);
    }

    /**
     * fixedClose
     */
    fixedClose() {
      let wrapper = doc.querySelector(this.wrapperElem);
      if (!wrapper) return;

      let html = doc.querySelector('html');

      html.classList.remove(this.state.open);

      wrapper.style.position = '';
      wrapper.style.right = '';
      wrapper.style.left = '';
      wrapper.style.width = '';
      wrapper.style.top = '';

      html.scrollTop = this.getScrollTop();
      doc.body.scrollTop = this.getScrollTop();
    }

    /**
     * update
     */
    update() {
      let modal = doc.getElementById(this.name.modal);
      if (!modal) return;

      if (this.isSetHeight) {
        this.setHeight();
      }
      this.setAlign();
    }

    /**
     * setHeight
     */
    setHeight() {
      let modal = doc.getElementById(this.name.modal);

      let resizeTimer = false;
      (() => {
        if (resizeTimer !== false) {
          clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(() => {
          modal.style.height = `${doc.body.clientHeight}px`;
        }, 20);
      })();
    }

    /**
     * setAlign
     */
    setAlign() {
      let wrapper = doc.getElementById(this.name.wrapper);
      if (!wrapper) return;

      let alignRight = wrapper.querySelectorAll([
        this.baseElem,
        this.alignRightElem
      ].join(' '));
      if (!alignRight.length) return;

      let resizeTimer = false;
      (() => {
        if (resizeTimer !== false) {
          clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(() => {
          let innerWidth = window.innerWidth;
          let modalWidth = wrapper.clientWidth;

          let diffWidth = innerWidth - modalWidth;

          _.forEach(alignRight, (elem) => {
            elem.style.marginRight = `${diffWidth}px`;
          });
        }, 100);
      })();
    }

    /**
     * setPosTop
     */
    setPosTop() {
      let modalElem = doc.getElementById(this.name.modal);
      let wrapperElem = doc.getElementById(this.name.wrapper);
      let outerElem = doc.getElementById(this.name.outer);

      setTimeout(() => {
        if (modalElem) {
          modalElem.scrollTop = 0;
        }
        if (wrapperElem) {
          wrapperElem.scrollTop = 0;
        }
        if (outerElem) {
          outerElem.scrollTop = 0;
        }
      }, 0);
    }

    /**
     * getPager
     *
     * @param {object} elem btn
     * @param {object} data json parse
     * @returns {object} data
     */
    getPager(elem, data) {
      if (!data) return;

      let name = elem.getAttribute(this.dataAttr.name);
      let split = name ? name.split(this.separater.page) : '';
      let prefix = `${split[0]}${this.separater.page}`;
      let num = split && split[1] ? parseInt(split[1]) : undefined;

      data.prev = `[${this.dataAttr.name}=${(prefix + (num - 1))}]`;
      data.next = `[${this.dataAttr.name}=${(prefix + (num + 1))}]`;

      let prev = doc.querySelector(data.prev);
      let next = doc.querySelector(data.next);

      data.prev = prev ? data.prev : false;
      data.next = next ? data.next : false;

      let pager = {
        prev: prev || false,
        now: elem,
        next: next || false,
      };

      data.pager = pager;

      return data;
    }

    /**
     * getModal
     *
     * @param {object} template
     * @returns {object} elem modal
     */
    getModal(template) {
      let modal = doc.getElementById(this.name.modal) || '';
      if (!modal) {
        let elem = doc.querySelector(this.baseElem);
        modal = doc.createElement(`div`);

        modal.id = this.name.modal;
        elem.appendChild(modal);

        modal.innerHTML = this.template;
      }

      modal.className = '';
      if (!modal.classList.contains(template.id)) {
        modal.classList.add(template.id, this.name.notScroller);
      }

      return modal;
    }

    /**
     * setPrevElem
     *
     * @param {object} elem
     */
    setPrevElem(elem) {
      this.prevElem = elem;
    }

    /**
     * getPrevElem
     *
     * @returns {object} elem
     */
    getPrevElem() {
      return this.prevElem;
    }

    /**
     * setScrollTop
     *
     * @param {number} num scrollTop
     */
    setScrollTop(num) {
      this.scrollTop = num;
    }

    /**
     * getScrollTop
     *
     * @returns {number} scrollTop
     */
    getScrollTop() {
      return this.scrollTop;
    }

    /**
     * hasOpen
     *
     * @param {object} elem element
     * @returns {boolean}
     */
    hasOpen(elem) {
      return elem.classList.contains(this.state.open);
    }

    /**
     * onBeforeOpen
     *
     * @param {object} obj
     */
    onBeforeOpen(obj) {}

    /**
     * onAfterOpen
     *
     * @param {object} obj
     */
    onAfterOpen(obj) {}

    /**
     * onBeforeClose
     *
     * @param {object} obj
     */
    onBeforeClose(obj) {}

    /**
     * onAfterClose
     *
     * @param {object} obj
     */
    onAfterClose(obj) {}

  };

})(window, document);

