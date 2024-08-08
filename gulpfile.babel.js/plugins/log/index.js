'use strict';

import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

// @author ysknk
const pluginName = 'log';
const text = {
  'stream': 'Stream not supported',
  'action': 'Publish >>> ',
  'title': pluginName
};

module.exports = (opts_) => {
  opts_ = _.merge({}, {
    title: '',
    logMessage: false
  }, opts_);

  let transformStream = new Transform({
    highWaterMark: 512,
    objectMode: true
  });

  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = (file, encoding, callback) => {
    if(file.isNull()) {
      return callback(null, file);
    }

    if(file.isStream()) {
      return callback(new pluginError(pluginName, text.stream));
    }

    if(file.isBuffer()) {
      let relative = file.relative.replace(/\\/g, '/');
      let path = colors.bold(colors.magenta(relative));
      let result = `${text.action}${path}`;

      notifier.notify({
        title: opts_.title ?
          (text.title + ': ' + opts_.title) : text.title,
        message: relative,
        sound: false,
        wait: false,
        timeout: 1,
        actions: `Close`,
        closeLabel: ``,
        type: 'info'
      });

      if (opts_.logMessage) {
        fancyLog(result);
      }

      callback(null, file);
    }

  };

  return transformStream;

};

