'use strict';

import iconv from 'iconv-lite';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

// @author ysknk
const pluginName = 'useful';
const text = {
  'stream': 'Stream not supported'
};
const defaultEncode = 'utf8';

module.exports = (opts_) => {
  opts_ = _.merge({}, {
    trimheadline: true,
    linefeedcode: 'LF',

    replace: [],
    find: [],

    encode: {
      from: defaultEncode,
      to: defaultEncode,
      iconv: iconv
    }
  }, opts_);

  if (!opts_.encode.from) {
    opts_.encode.from = defaultEncode;
  }

  if (!opts_.encode.iconv) {
    opts_.encode.iconv = iconv ?
      iconv : {decode: {}, encode: {}};
  }

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
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new pluginError(pluginName, text.stream));
    }

    if (file.isBuffer()) {
      let encodeFrom = opts_.encode.from;
      let encodeTo = opts_.encode.to;

      let filename = file.relative;
      let contents = file.contents.toString(encodeFrom);

      let replace = opts_.replace;
      let find = opts_.find;

      let matchList = [];

      // trim head line
      if (opts_.trimheadline) {
        contents = contents.replace(/^(\r\n|\n\r|\n|\r)/, '');
      }

      if (replace && replace.length || find && find.length) {
        // replace
        if (replace.length) {
          _.forEach(replace, (content) => {
            let ex = new RegExp('(' + content.from + ')', 'g');
            let isMatch = contents.match(ex);
            if (isMatch) {
              contents = contents.replace(ex, content.to);
              matchList.push([
                colors.yellow([
                  '  replace*' + isMatch.length,
                  '"' + content.from + '"',
                  'to',
                  '"' + content.to + '"'
                ].join(' '))
              ].join(' '));
            }
          });
        }

        // find
        if (find.length) {
          _.forEach(find, (content) => {
            let ex = new RegExp('(' + content + ')', 'g');
            let isMatch = contents.match(ex);
            if (isMatch) {
              matchList.push([
                colors.yellow([
                  '  find*' + isMatch.length,
                  '"' + content + '"'
                ].join(' '))
              ].join(' '));
            }
          });
        }

        // show match logs
        if (matchList.length) {
          fancyLog('- ' + colors.blue(filename));
          _.forEach(matchList, (list) => {
            fancyLog(list);
          });
        }
      }

      // line feed code
      let code = new RegExp('(\n|\r\n|\r)', 'g');
      let change = '';

      if (opts_.linefeedcode.match(/^CRLF$/i)) {
        change = '\r\n';
      } else if(opts_.linefeedcode.match(/^CR$/i)) {
        change = '\r';
      } else if(opts_.linefeedcode.match(/^LF$/i)) {
        change = '\n';
      } else {
        // default
        change = '\n';
      }
      contents = contents.replace(code, change);
      file.contents = new Buffer.from(contents);

      // encode
      if (encodeTo != defaultEncode ||
        encodeFrom != defaultEncode) {
        let content = iconv.decode(file.contents, encodeFrom, opts_.encode.iconv.decode);
        file.contents = iconv.encode(content, encodeTo, opts_.encode.iconv.encode);
        file.contents = new Buffer.from(file.contents);
      }

      callback(null, file);
    }

  };

  return transformStream;

};

