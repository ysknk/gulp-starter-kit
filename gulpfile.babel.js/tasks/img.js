'use strict';

import TaskMaster from '../task/master';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'img',
  types: ['build']// **:watch function [0] || 'procedure'
};

/**
 * Img
 */
class Img extends TaskMaster {
  constructor(opts_) {
    super(opts_);
  }

  /**
   * initialize
   */
  // initialize() {}

  /**
   * build
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  build(stream, done) {
    return stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dest)))

      .pipe($.imagemin(this.task.data.plugins, this.task.data.options))

      .pipe(gulp.dest(this.task.data.dest))

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

module.exports = new Img(task);

