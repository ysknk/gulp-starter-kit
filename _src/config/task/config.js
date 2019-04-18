// options -> /_app/gulpfile.babel.js/task/config.js

module.exports = {

  tasks: {
    styleguide: true,
    webfont: true,
  },

  /* common */
  common: {
    options: {
      // development | production || none
      mode: 'none'
    }
  },

  /* serv @browserSync */
  serv: {
  },

  /* html @pug */
  html: {
    path_type: 'absolute'// relative | absolute
  },

  /* css @stylus */
  css: {
  },

  /* js @webpack */
  js: {
  },

  /* img @imagemin */
  img: {
  },

  /* copy */
  copy: { // other filetype
  },

  /* styleguide */
  styleguide: {
    src: [`${define.path.config}tasks/styleguide/src/aigis_config.yml`],
  },

  /* webfont */
  /* ../webfont/uF001-hoge1.svg */
  /* ../webfont/uF001-huga1.svg */
  webfont: {
    src: [`${define.path.config}tasks/webfont/**/*.svg`],
    dest: `${define.path.dest}assets/webfont/`,
    options: {
      startUnicode: 0xF001,
      fontName: 'icons1',
      normalize: true,
      fontHeight: 500,
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff'],
    }
  },

};

