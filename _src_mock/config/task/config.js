// options -> /_app/gulpfile.babel.js/task/config.js

module.exports = {

  /* run flg */
  // tasks: {
  //   custom: true
  // },

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
  }//,

  /* custom */
  //custom: {}

};

