'use strict';

// @author ysknk
const pluginName = 'clean';
const text = {
  'stream': 'Stream not supported',
  'action': 'Clean >>> ',
  'title': pluginName
};

module.exports = (opts_) => {
  opts_ = _.merge({}, {
    title: '',
    logMessage: true
  }, opts_);

  let transformStream = new Transform({
    highWaterMark: 512,
    objectMode: true
  });

  /**
   * checkFile
   *
   * @param {string} filepath
   * @returns {boolean}
   */
  function checkFile(filepath) {
    try {
      fs.statSync(filepath);
      return true
    } catch(err) {
      if(err.code === 'ENOENT') {
        return false;
      }
    }
  }

  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = (file, encoding, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new pluginError(pluginName, text.stream));
    }

    if (file.isBuffer()) {
      let relative = `${opts_.dest}${file.relative}`;
      let path = colors.bold(colors.red(relative));
      let result = `${text.action}${path}`;

      if (checkFile(relative)) {
        del.sync(relative, {force: true});

        notifier.notify({
          title: opts_.title ?
            (text.title + ': ' + opts_.title) : text.title,
          message: relative,
          sound: false,
          wait: false,
          timeout: 1,
          type: 'info'
        });

        if (opts_.logMessage) {
          fancyLog(result);
        }
      }

      callback(null, file);
    }
  };

  return transformStream;

};

