import anime from 'animejs';

export default ((win, doc) => {

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
      this.isFixed = true;
      this.styles = {
        display: 'block',
        top: 0,
        left: 0,
        zIndex: 99999,
        width: '100%',
        height: '100%',
        background: '#fff',
        opacity: 0
      };
      this.elem = {
        wrapper: '#wrapper',
        alignRight: '.js-fixed-right'
      };
      this.name = {
        modal: 'modal',
        close: 'modal-close',
        container: 'modal-container',
        wrapper: 'modal-wrapper',
        content: 'modal-content'
      };
      this.data = {
        open: 'data-modal-open',
        close: 'data-modal-close',
        template: 'data-modal-template',
        name: 'data-modal-name'
      };
      this.separation = {
        page: '--'
      };
      this.state = {
        open: 'is-open',
        close: 'is-close'
      };
      this.animate = {
        open: {
          duration: 300,
          easing: 'easeInOutQuart',
          complete: (opts) => {}
        },
        close: {
          duration: 300,
          easing: 'easeInOutQuart',
          complete: (opts) => {}
        }
      };
      this.callback = {
        open: (opts) => {},
        close: (opts) => {}
      };

      _.isObject(opts_) && _.extend(this, opts_);

      this.initialize();
    }

    /**
     * initialize
     */
    initialize() {
      let open = '[' + this.data.open + ']';
      let close = '[' + this.data.close + ']';

      // cancel
      doc.addEventListener("DOMContentLoaded", (e) => {
        doc.body.addEventListener('click', (e) => {
          let elem = e.target.closest('#' + this.name.content);// delegate
          if(!elem || e.target === doc) return;

          e.preventDefault();
          e.stopPropagation();
        });
      });

      // open
      doc.addEventListener('click', (e) => {
        let elem = e.target.closest(open);// delegate
        if(!elem || e.target === doc) return;

        this.open(elem);
      });

      // close
      doc.addEventListener('click', (e) => {
        let elem = e.target.closest(close);// delegate
        if(!elem || e.target === doc) return;

        this.close(elem);
      });

      // resize, scroll
      let updateFunc = () => {
        this.update();
      };

      win.addEventListener('resize', updateFunc);
      win.addEventListener('scroll', updateFunc);
    }

    /**
     * open
     *
     * @param {object} btn element
     */
    open(elem) {
      if(isChange) return;

      if(this.hasOpen(elem)) {
        this.close(elem);
        return;
      }

      let modal = doc.getElementById(this.name.modal);

      let template = elem.getAttribute(this.data.template);
      template = doc.querySelector(template);

      let html = _.template(template.innerHTML);
      let data = elem.getAttribute(this.data.open);

      let parseData = data ? JSON.parse(data) : null;
      parseData = this.getPager(elem, parseData);

      if(!modal) modal = this.createModal();
      let content = doc.getElementById(this.name.content);

      modal.className = '';
      if(!modal.classList.contains(template.id)) {
        modal.classList.add(template.id, 'js-not-scroller');
      }
      modal.classList.add(this.state.open);
      elem.classList.add(this.state.open);

      if(isOpen) {
        this.changeContent(html, parseData);
      }else{
        if(this.isFixed) {
          this.fixedOpen();
        }

        content.innerHTML = html({
          'modal': this,
          'data': parseData
        });

        this.imgLoadEnd(modal, () => {
          anime.remove(modal);

          modal.style.position = this.isFixed ?
            'fixed' : 'absolute';
          _.each(this.styles, (value, key) => {
            modal.style[key] = value;
          });

          anime({
            targets: modal,
            opacity: 1,
            ...this.animate.open
          });
        });
      }

      isOpen = true;
      this.setPrevElem(elem);
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
        'callback': () => {
          this.showContent(template({
            'modal': this,
            'data': data
          }));
        }
      });
    }

    /**
     * fixedOpen
     */
    fixedOpen() {
      let wrapper = doc.querySelector(this.elem.wrapper);

      let scrollY = win.pageYOffset || doc.documentElement.scrollTop;
      this.setScrollTop(scrollY);

      wrapper.style.position = 'fixed';
      wrapper.style.width = '100%';
      wrapper.style.top = `${-1 * scrollY}px`;

      doc.querySelector('html').classList.add(this.state.open);
    }

    /**
     * fixedClose
     */
    fixedClose() {
      let wrapper = doc.querySelector(this.elem.wrapper);

      doc.querySelector('html').classList.remove(this.state.open);

      wrapper.style.position = '';
      wrapper.style.width = '';
      wrapper.style.top = '';

      doc.querySelector('html').scrollTop = this.getScrollTop();
      doc.querySelector('body').scrollTop = this.getScrollTop();
    }

    /**
     * update
     */
    update() {
      // this.setHeight()
      this.setAlign();
      this.setPosTop();
    }

    /**
     * setHeight
     */
    setHeight() {
      let modal = doc.getElementById(this.name.modal);
      let content = doc.getElementById(this.name.content);

      let resizeTimer = false;

      if(!modal || !content) return;

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
      let alignRight = wrapper.querySelectorAll(this.elem.alignRight);

      if(!alignRight.length) return;

      let func = () => {
        if(resizeTimer !== false) {
          clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(() => {
          let innerWidth = window.innerWidth;
          let modalWidth = wrapper.clientWidth;

          let diffWidth = innerWidth - modalWidth;

          _.each(alignRight, (elem) => {
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
     * close
     *
     * @param {object} elem btn
     */
    close(elem) {
      let modal = doc.getElementById(this.name.modal);
      let content = doc.getElementById(this.name.content);

      if(this.isFixed) {
        this.fixedClose();
      }

      this.getPrevElem().classList.remove(this.state.open);
      elem.classList.remove(this.state.open);

      this.animate.close.complete = () => {

        _.each(this.styles, (value, key) => {
          modal.style[key] = '';
        });
        modal.style.display = 'none';
        modal.style.position = '';
        content.innerHTML = '';
        isOpen = false;
      };

      anime.remove(modal);
      modal.classList.remove(this.state.open);
      modal.classList.add(this.state.close);

      anime({
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

      this.animate.close.complete = () => {
        content.innerHtml = '';
        content.style.dispaly = 'none';
        opts &&
          _.isFunction(opts.callback) &&
            opts.callback();
        isChange = false;
      };

      anime.remove(content);
      anime({
        targets: content,
        opacity: 0,
        ...this.animate.close
      });
    }

    /**
     * showContent
     *
     * @param {string} html
     */
    showContent(html) {
      let content = doc.getElementById(this.name.content);

      anime.remove(content);
      content.innerHTML = html;

      this.imgLoadEnd(content, () => {
        content.style.display = 'block';
        anime({
          targets: content,
          opacity: 1,
          ...this.animate.open
        });
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

      if(imgLoad) {
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
      }else{
        _.isFunction(cb) && cb();
      }
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

      let name = elem.getAttribute(this.data.name);
      let split = name ? name.split(this.separation.page) : '';
      let prefix = split[0] + this.separation.page;
      let num = split && split[1] ? parseInt(split[1]) : undefined;

      data.prev = '[' + this.data.name + '='  + (prefix + (num - 1)) + ']';
      data.next = '[' + this.data.name + '='  + (prefix + (num + 1)) + ']';

      let prev = doc.querySelector(data.prev);
      let next = doc.querySelector(data.next);

      data.prev = prev ? data.prev : false;
      data.next = next ? data.next : false;

      let pager = {
        'prev': prev || false,
        'now': elem,
        'next': next || false,
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
      let elem = doc.createElement('div');
      elem.id = this.name.modal;
      doc.body.appendChild(elem);

      elem.innerHTML = `
        <div id="${this.name.wrapper}" data-modal-close="" onclick="">
          <div id="${this.name.container}">
            <div id="${this.name.close}">
              <a href="javascript:void(0)" data-modal-close="" onclick="">CLOSE</a>
            </div>
            <div id="${this.name.content}"></div>
          </div>
        </div>
      `;

      return elem;
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
      return elem.classList.contains(this.state.open)
    }

  }

})(window, document);
