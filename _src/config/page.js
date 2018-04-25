const head = {
  lang: 'ja',
  charset: 'utf8',

  canonical: 'http://example.com/',

  favicon: '/favicon.ico',
  apple_touch_icon: '/apple-touch-icon.png',

  x_ua_compatible: 'IE=edge',
  robots: '',
  format_detection: 'telephone=no',
  viewport: 'width=device-width,initial-scale=1',

  title: 'common title',
  description: 'common description',
  keywords: 'common keywords',

  css: ['style.css'],
  js: ['lib.js', 'common.js'],

  og: {
    url: 'http://example.com/'
  },
  twitter: {
    url: 'http://example.com/'
  }
};

module.exports = {
  ...head,

  page_name: 'common-page',

  // /^\// -> directory
  // /^$/ -> file
  '$index': {
    title: 'index title',
    description: 'index description',
    keywords: 'index keywords',
    js: [...head.js, 'index.js']
  },

  '$test': {
    title: 'test title',
    description: 'test description',
    keywords: 'test keywords',
    js: 'test.js'
  },

  '/test': {
    title: 'test dir title',
    description: 'test dir description',
    keywords: 'test dir keywords',

    '$index': {
      title: 'test index title',
      description: 'test index description',
      keywords: 'test index keywords',
    },

    '/test': {
      title: 'test test dir title',
      description: 'test test dir description',
      keywords: 'test test dir keywords',

      '$index': {
        title: 'test test index title',
        description: 'test test index description',
        keywords: 'test test index keywords',
      },

      '$test': {
        title: 'test test test title',
        description: 'test test test description',
        keywords: 'test test test keywords',
      }
    }
  }
};

