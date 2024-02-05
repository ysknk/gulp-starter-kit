'use strict';

import defaultPug from 'pug';
import replaceExt from 'replace-ext';

// @author ysknk
const pluginName = 'pug';
const text = {
  'stream': 'Stream not supported',
  'title': pluginName
};

module.exports = (opts_) => {
  opts_ = _.merge({}, opts_);
  opts_.data = _.merge(opts_.data || {}, opts_.locals || {});

  const pug = opts_.pug || opts_.jade || defaultPug;

  const transformStream = new Transform({
    highWaterMark: 256,
    objectMode: true
  });

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
      const data = _.merge({}, opts_.data, file.data || {});
      opts_.filename = file.path;
      file.path = replaceExt(file.path, opts_.client ? '.js' : '.html');

      try {
        const contents = String(file.contents);
        let compiled;

        if (opts_.client) {
          compiled = pug.compileClient(contents, opts_);
        } else {
          compiled = pug.compile(contents, opts_)(data);
        }
        file.contents = new Buffer.from(compiled);
      } catch(e) {
        console.error(e)
        notifier.notify({
          title: pluginName,
          message: e.message,
          sound: false,
          wait: false,
          timeout: 1,
          type: 'info'
        });
        // return callback(new pluginError(pluginName, e));
      }

      callback(null, file);
    }

  };

  return transformStream;

};

