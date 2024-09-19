'use strict';

// @author ysknk
const pluginName = 'empty';

export default function (opts_) {
  let transformStream = new Transform({
    highWaterMark: 64,
    objectMode: true
  });

  /**
   * @param {Buffer|string} file
   * @param {string=} encoding - ignored if file contains a Buffer
   * @param {function(Error, object)} callback - Call this function (optionally with an
   *          error argument and data) when you are done processing the supplied chunk.
   */
  transformStream._transform = (file, encoding, callback) => {
    callback(null, file);
  };

  return transformStream;

};

