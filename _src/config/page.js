const head = {
  lang: 'ja',
  charset: 'utf8',

  // canonical: 'http://example.com/',

  // favicon: '/favicon.ico',
  // apple_touch_icon: '/apple-touch-icon.png',

  x_ua_compatible: 'IE=edge',
  robots: '',
  format_detection: 'telephone=no',
  viewport: 'width=device-width,initial-scale=1',

  title: 'common title',
  description: 'common description',
  keywords: 'common keywords',

  css: ['style.css'],
  js: ['script.js'],

  // og: {
  //   url: 'http://example.com/'
  // },
  // twitter: {
  //   url: 'http://example.com/'
  // }
};

module.exports = {
  ...head,

  p: 'site-', // class_name prefix

  page_name: 'common-page',

  // /^\// -> directory
  // /^$/ -> file
  '$index': {
    title: 'index title',
    description: 'index description',
    keywords: 'index keywords',
    js: [...head.js, 'pages/index.js'],
    page_name: 'index-page'
  },
};

