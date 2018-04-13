module.exports = {
  // /^\// -> directory
  // /^$/ -> file
  '$index': {
    title: 'index title',
    description: 'index description',
    keywords: 'index keywords'
  },
  '$test': {
    title: 'test title',
    description: 'test description',
    keywords: 'test keywords'
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