export default ((win, doc) => {
  `use strict`;

  const FN = win[NS];

  // common state
  let isOpen = false;
  let isChange = false;

  /**
   *  Modal
   */
  return class Modal {

    /**
     * constructor
     *
     * @param {object} opts_
     */
    constructor(opts_) {
      if(!(this instanceof Modal)) {
        return new Modal(opts_);
      }

      this.baseElem = `body`;

      this.isFixed = true;
      this.isSetHeight = false;
      this.styles = {
        display: `block`,
        top: 0,
        left: 0,
        zIndex: 99999,
        width: `100%`,
        height: `100%`,
        // background: `#fff`,
        opacity: 0
      };

      this.wrapperElem = `#wrapper`;
      this.alignRightElem = `.js-fixed-right`;

      this.name = {
        modal: `modal`,
        close: `modal__close`,
        container: `modal__container`,
        wrapper: `modal__wrapper`,
        outer: `modal__outer`,
        inner: `modal__inner`,
        content: `modal__content`,

        notScroller: `js-not-scroller`,
      };

      this.dataAttr = {
        open: `data-modal-open`,
        close: `data-modal-close`,
        template: `data-modal-template`,
        name: `data-modal-name`
      };

      this.separater = {
        page: `--`
      };

      this.state = {
        open: `is-open`,
        close: `is-close`
      };

      this.animate = {
        open: {
          duration: 300,
          easing: `easeInOutQuart`
        },
        close: {
          duration: 300,
          easing: `easeInOutQuart`
        }
      };

      this.template = [``,
        `<div id="${this.name.wrapper}" data-modal-close="" onclick="">`,
          `<div id="${this.name.outer}">`,
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
      ].join(``);

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
      ].join(` `);

      let close = [
        this.baseElem,
        `[${this.dataAttr.close}]`
      ].join(` `);

      // // let isClick = false;

      // let isModal = false;
      // let isOpen = false;
      // let isClose = false;

      // doc.addEventListener(`mousedown`, (e) => {
      //   if(!e.target || !e.target.closest) return;

      //   let openElem = e.target.closest(open);// delegate
      //   let closeElem = e.target.closest(close);// delegate
      //   let modalElem = e.target.closest(`#${this.name.content}`);// delegate

      //   if(e.target === doc || (!openElem && !closeElem && !modalElem)) return;

      //   // isClick = true;
      //   // setTimeout(() => {
      //   //   isClick = false;
      //   // }, 1000);

      //   // cancel
      //   if(modalElem) {
      //     isModal = true;
      //     isOpen = false;
      //     isClose = false;

      //   // open
      //   }else if(openElem) {
      //     isOpen = openElem;
      //     isModal = false;
      //     isClose = false;

      //   // close
      //   }else if(closeElem) {
      //     isClose = closeElem;
      //     isModal = false;
      //     isOpen = false;

      //   }else{
      //     isModal = false;
      //     isOpen = false;
      //     isClose = false;
      //   }
      // }, false);

      // doc.addEventListener(`mouseup`, (e) => {
      //   if(!e.target || !e.target.closest) return;
      //   // if(!isClick) return;

      //   let openElem = e.target.closest(open);// delegate
      //   let closeElem = e.target.closest(close);// delegate
      //   let modalElem = e.target.closest(`#${this.name.content}`);// delegate

      //   if(e.target === doc || (!openElem && !closeElem && !modalElem)) {
      //     isModal = false;
      //     isOpen = false;
      //     isClose = false;
      //     return;
      //   }

      //   if(isModal && isModal == modalElem) {
      //     e.preventDefault();
      //     e.stopPropagation();
      //   }else if(isOpen && isOpen == openElem) {
      //     this.open(isOpen);
      //   }else if(isClose && isClose == closeElem) {
      //     this.close(isClose);
      //   }
      // }, false);

      doc.addEventListener(`click`, (e) => {
        if(!e.target || !e.target.closest) return;
        let openElem = e.target.closest(open);// delegate
        let closeElem = e.target.closest(close);// delegate
        let modalElem = e.target.closest(`#${this.name.content}`);// delegate
        if((!openElem && !closeElem && !modalElem) || e.target === doc) return;
        // cancel
        if(modalElem) {
          e.preventDefault();
          e.stopPropagation();
        // open
        }else if(openElem) {
          this.open(openElem);
        // close
        }else if(closeElem) {
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
      if(isChange) return;

      if(this.hasOpen(elem)) {
        this.close(elem);
        return;
      }
      let modal = doc.getElementById(this.name.modal);

      let template = elem.getAttribute(this.dataAttr.template);
      template = doc.querySelector(template);

      let html = _.template(template.innerHTML);
      let data = elem.getAttribute(this.dataAttr.open) || ``;

      let parseData = null;
      try {
        parseData = JSON.parse(data);
      }catch(e) {}

      // let parseData = data && JSON.parse(data) ? JSON.parse(data) : null;
      parseData = this.getPager(elem, parseData);

      if(!modal) modal = this.createModal();
      let content = doc.getElementById(this.name.content);

      modal.className = ``;
      if(!modal.classList.contains(template.id)) {
        modal.classList.add(template.id, this.name.notScroller);
      }
      modal.classList.add(this.state.open);
      elem.classList.add(this.state.open);

      if(isOpen) {
        this.changeContent(html, parseData);
      }else{
        if(this.isFixed) {
          this.fixedOpen();
        }

        _.isFunction(this.onBeforeOpen) && this.onBeforeOpen(this);
        opts && _.isFunction(opts.onBeforeOpen) && opts.onBeforeOpen(this);

        content.innerHTML = html({
          modal: this,
          data: parseData
        });

        this.imgLoadEnd(modal, () => {
          FN.anime.remove(modal);

          modal.style.position = this.isFixed ?
            `fixed` : `absolute`;
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
     * showContent
     *
     * @param {string} html
     * @param {object} opts options
     */
    showContent(html, opts) {
      let content = doc.getElementById(this.name.content);

      FN.anime.remove(content);
      content.innerHTML = html;

      _.isFunction(this.onBeforeOpen) && this.onBeforeOpen(this);
      opts && _.isFunction(opts.onBeforeOpen) && opts.onBeforeOpen(this);

      this.imgLoadEnd(content, () => {
        content.style.display = `block`;

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

      if(this.isFixed) {
        this.fixedClose();
      }

      _.isFunction(this.onBeforeClose) && this.onBeforeClose(this);
      opts && _.isFunction(opts.onBeforeClose) && opts.onBeforeClose(this);

      this.getPrevElem().classList.remove(this.state.open);
      elem.classList.remove(this.state.open);

      this.animate.close.complete = () => {
        _.forEach(this.styles, (value, key) => {
          modal.style[key] = ``;
        });

        modal.style.display = `none`;
        modal.style.position = ``;
        content.innerHTML = ``;
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
        content.innerHtml = ``;
        content.style.dispaly = `none`;
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
      let imgLoad = ``;
      try {
        imgLoad = imagesLoaded(elem);
      }catch(e) {}

      if(imgLoad) {
        imgLoad.on(`always`, () => {
          setTimeout(() => {
            _.isFunction(cb) && cb();
          }, 0);
        });

        imgLoad.on(`fail`, () => {
          setTimeout(() => {
            _.isFunction(cb) && cb();
          }, 0);
        });
      }else{
        _.isFunction(cb) && cb();
      }
    }

    /**
     * fixedOpen
     */
    fixedOpen() {
      let wrapper = doc.querySelector(this.wrapperElem);
      if(!wrapper) return;

      let scrollY = win.pageYOffset || doc.documentElement.scrollTop;
      this.setScrollTop(scrollY);

      wrapper.style.position = `fixed`;
      wrapper.style.width = `100%`;
      wrapper.style.top = `${-1 * scrollY}px`;

      doc.querySelector(`html`).classList.add(this.state.open);
    }

    /**
     * fixedClose
     */
    fixedClose() {
      let wrapper = doc.querySelector(this.wrapperElem);
      if(!wrapper) return;

      doc.querySelector(`html`).classList.remove(this.state.open);

      wrapper.style.position = ``;
      wrapper.style.width = ``;
      wrapper.style.top = ``;

      doc.querySelector(`html`).scrollTop = this.getScrollTop();
      doc.querySelector(`body`).scrollTop = this.getScrollTop();
    }

    /**
     * update
     */
    update() {
      let modal = doc.getElementById(this.name.modal);
      if(!modal) return;

      if(this.isSetHeight) {
        this.setHeight();
      }
      this.setAlign();
      this.setPosTop();
    }

    /**
     * setHeight
     */
    setHeight() {
      let modal = doc.getElementById(this.name.modal);

      let resizeTimer = false;
      let func = () => {
        if(resizeTimer !== false) {
          clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(() => {
          modal.style.height = doc.body.clinetHeight;
        }, 20);
      };

      func();
    }

    /**
     * setAlign
     */
    setAlign() {
      let wrapper = doc.getElementById(this.name.wrapper);
      if(!wrapper) return;

      let resizeTimer = false;
      let alignRight = wrapper.querySelectorAll([
        this.baseElem,
        this.alignRightElem
      ].join(` `));

      if(!alignRight.length) return;

      let func = () => {
        if(resizeTimer !== false) {
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
      };

      func();
    }

    /**
     * setPosTop
     */
    setPosTop() {
      let wrapper = doc.getElementById(this.name.wrapper);
      if(!wrapper) return;

      setTimeout(() => {
        wrapper.scrollTop = 0;
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
      if(!data) return;

      let name = elem.getAttribute(this.dataAttr.name);
      let split = name ? name.split(this.separater.page) : ``;
      let prefix = split[0] + this.separater.page;
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
     * createModal
     *
     * @returns {object} elem modal
     */
    createModal() {
      let elem = doc.querySelector(this.baseElem);
      let modal = doc.createElement(`div`);

      modal.id = this.name.modal;
      elem.appendChild(modal);

      modal.innerHTML = this.template;

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

  }

})(window, document);

