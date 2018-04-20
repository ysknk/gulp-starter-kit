'use strict';

import iconv from 'iconv-lite';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';

// @author ysknk
const pluginName = 'gulp-useful';
const text = {
  'stream': 'Stream not supported'
};
const defaultEncode = 'utf8';

module.exports = (options) => {
  let opts = _.merge({}, {
    trimheadline: true,
    linefeedcode: 'LF',

    replace: [],
    find: [],

    encode: {
      from: defaultEncode,
      to: defaultEncode,
      iconv: iconv
    }
  }, options);

  if(!opts.encode.from) {
    opts.encode.from = defaultEncode;
  }

  if(!opts.encode.iconv) {
    opts.encode.iconv = iconv ?
      iconv : {decode: {}, encode: {}};
  }

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

    let encodeFrom = opts.encode.from;
    let encodeTo = opts.encode.to;

    let filename = chunks.relative;
    let contents = chunks.contents.toString(encodeFrom);

    let replace = opts.replace;
    let find = opts.find;

    // trim head line
    if(opts.trimheadline) {
      contents = contents.replace(/^(\r\n|\n\r|\n|\r)/, '');
    }

    if(replace && replace.length || find && find.length) {
      fancyLog('- ' + colors.blue(filename));
      // replace
      if(replace.length) {
        _.each(replace, (content) => {
          let ex = new RegExp('(' + content.from + ')', 'g');
          let isMatch = contents.match(ex);
          if(isMatch) {
            contents = contents.replace(ex, content.to);
            fancyLog([
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
      if(find.length) {
        _.each(find, (content) => {
          let ex = new RegExp('(' + content + ')', 'g');
          let isMatch = contents.match(ex);
          if(isMatch) {
            fancyLog([
              colors.yellow([
                '  find*' + isMatch.length,
                '"' + content + '"'
              ].join(' '))
            ].join(' '));
          }
        });
      }
    }

    // line feed code
    let code = new RegExp('(\n|\r\n|\r)', 'g');
    let change = '';

    if(opts.linefeedcode.match(/^CRLF$/i)) {
      change = '\r\n';
    }else if(opts.linefeedcode.match(/^CR$/i)) {
      change = '\r';
    }else if(opts.linefeedcode.match(/^LF$/i)) {
      change = '\n';
    }else{
      // default
      change = '\n';
    }
    contents = contents.replace(code, change);
    chunks.contents = new Buffer(contents);

    // encode
    if(encodeTo != defaultEncode ||
      encodeFrom != defaultEncode) {
      let content = iconv.decode(chunks.contents, encodeFrom, opts.encode.iconv.decode);
      chunks.contents = iconv.encode(content, encodeTo, opts.encode.iconv.encode);
      chunks.contents = new Buffer(chunks.contents);
    }

    cb(null, chunks);
  });
};
