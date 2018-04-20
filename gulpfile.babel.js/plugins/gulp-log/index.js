'use strict';

// @author ysknk
const pluginName = 'gulp-log';
const text = {
  'stream': 'Stream not supported',
  'publish': 'Publish >>> ',
  'title': pluginName
};

module.exports = (options) => {
  let opts = _.merge({}, {
    title: '',
    logMessage: false
  }, options);

  /**
   * through.obj
   *
   * @param {object} chunks vinly objects
   * @param {function} enc transform function
   * @param {function} cb flush function
   * @returns {object} vinly objects
   */
  return through.obj((chunks, enc, cb) => {
    if(chunks.isNull()) {
      cb(null, chunks);
    }

    if(chunks.isStream()){
      return cb(new pluginError(pluginName, text.stream));
    }

    let relative = chunks.relative.replace(/\\/g, '/');
    let path = colors.bold(colors.magenta(relative));
    let result = text.publish + path;

    notifier.notify({
      title: opts.title ?
        (text.title + ': ' + opts.title) : text.title,
      message: relative,
      sound: false,
      wait: false,
      timeout: 1,
      type: 'info'
    });

    if(opts.logMessage) {
      fancyLog(result);
    }
    cb(null, chunks);
  });
};
