'use strict';

// @author ysknk
const pluginName = 'gulp-log';
const text = {
  'stream': 'Stream not supported',
  'publish': 'Publish >>> ',
  'title': pluginName
};

module.exports = (opts_) => {
  opts_ = _.merge({}, {
    title: '',
    logMessage: false
  }, opts_);

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
      title: opts_.title ?
        (text.title + ': ' + opts_.title) : text.title,
      message: relative,
      sound: false,
      wait: false,
      timeout: 1,
      type: 'info'
    });

    if(opts_.logMessage) {
      fancyLog(result);
    }
    cb(null, chunks);
  });
};

