'use strict';

import iconv from 'iconv-lite';

// @author ysknk
const pluginName = 'gulp-useful';
const text = {
  'stream': 'Stream not supported',
  'publish': 'Publish >>> ',
  'title': pluginName
};
const UTF8 = 'utf8';

module.exports = (options) => {
  let opts = _.merge({}, {
    trimheadline: true,
    linefeedcode: 'LF',
    encode: {
      from: UTF8,
      to: UTF8,
      iconv: iconv
    }
  }, options);

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

    let contents = chunks.contents.toString('utf8');

    // trim head line
    if(opts.trimheadline) {
      contents = contents.replace(/^(\r\n|\n\r|\n|\r)/, '');
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
    if(opts.encode.to) {
      let content = iconv.decode(chunks.contents, opts.encode.from, opts.encode.iconv.decode);
      chunks.contents = iconv.encode(content, opts.encode.to, opts.encode.iconv.encode);
      chunks.contents = new Buffer(chunks.contents);
    }

    cb(null, chunks);
  });
};
