// options -> /_app/gulpfile.babel.js/task/config.js

module.exports = {

  tasks: {
    styleguide: true,
    iconfont: true,
  },

  /* common */
  common: {
    // lint: false,// true || gulp --lint
    // minify: false,// true || gulp --min

    // convert: {
    //   linefeedcode: 'LF',// CRLF || LF || CR
    //   replace: [
    //     {from: '〜', to: '～'}
    //   ],
    //   find: ['dev', 'pre', 'test'],
    //   encode: {
    //     to: 'utf8'// https://github.com/ashtuchkin/iconv-lite#supported-encodings
    //   }
    // },

    options: {
      // development | production || none
      mode: 'none',
    },
  },

  /* serv @browserSync */
  serv: {
    // options: {
    //   port: 8080
    //   notify: false,
    //   open: 'local',// argv.no = false(ex: gulp watch --no)
    //   startPath: '/',
    //   server: {
    //     baseDir: define.path.dest
    //   }
    // }
  },

  /* html @pug */
  html: {
    path_type: 'absolute',// relative | absolute
    // ex: https://github.com/kangax/html-minifier/
    // minify_options: {},
    // ex: https://github.com/yaniswang/HTMLHint/wiki/Rules
    // lint_options: {},
    // assets_path: '/assets/',//base absolute path
  },

  /* css @stylus */
  css: {
    // autoprefixer_options: {
    //   browsers: ['last 2 versions', '> 2%'],
    // },
    // ex: https://github.com/CSSLint/csslint/wiki/Rules
    // lint_options: {},
  },

  /* js @webpack */
  js: {
    // ex: https://github.com/mishoo/UglifyJS2#minify-options
    // minify_options: {},
    // ex: http://eslint.org/docs/rules/
    // lint_options: {},
  },

  /* img @imagemin */
  img: {
    // plugins: [
    //   pngquant({
    //     quality: '50-100'
    //   }),
    //   mozjpeg({
    //     quality: 85,
    //     progressive: true
    //   }),
    //   $.imagemin.gifsicle(),
    //   $.imagemin.optipng(),
    //   $.imagemin.svgo()
    // ],
    // options: {
    //   interlaced: true,
    //   verbose: true,
    //   progressive: true,
    //   optimizationLevel: 7
    // }
  },

  /* copy */
  copy: { // other filetype
  },

  /* delete */
  delete: { // all
  },

  /* styleguide */
  styleguide: {
    src: [`${define.path.config}tasks/styleguide/src/aigis_config.yml`],
  },

  /* iconfont */
  /* ../tasks/iconfont/src/uF001-hoge1.svg */
  /* ../tasks/iconfont/src/uF002-huga1.svg */
  iconfont: {
    src: [`${define.path.config}tasks/iconfont/**/*.svg`],
    dest: `${define.path.dest}assets/font/`,
    options: {
      startUnicode: 0xF001,
      fontName: 'icon1',
      normalize: true,
      fontHeight: 500,
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff', 'woff2'],
    }
  }

};

