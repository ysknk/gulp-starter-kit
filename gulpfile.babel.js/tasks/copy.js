'use strict';

import TaskMaster from '../taskMaster';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'copy',
  types: ['build']// **:watch function [0] || 'proc'
};

/**
 * Copy
 */
class Copy extends TaskMaster {
  constructor(options) {
    super(options);
  }

  /**
   * init
   */
  // init() {}

  /**
   * build
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  build(stream, done) {
    stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dist)))
      .pipe(gulp.dest(this.task.data.dist))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe(this.serv())

      .on('finish', () => {done && done();});
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Copy(task);

