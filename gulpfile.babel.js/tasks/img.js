'use strict';

import TaskMaster from '../task/master';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'img',
  types: ['build', 'clean']// **:watch function [0] || 'procedure'
};

/**
 * Img
 */
class Img extends TaskMaster {

  /**
   * constructor
   *
   * @param {object} opts_
   */
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
    stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.if(plugins.util.getIsWatch(), $.changed(this.getDest())))

      .pipe($.imagemin(this.task.data.plugins, this.task.data.options))
      .pipe($.if(this.isExtname(), $.rename({
        extname: this.task.data.extension
      })))

      .pipe(gulp.dest(this.getDest()))
      .on('finish', () => {done && done();})

      .pipe($.size(this.sizeOptions()))
      .pipe($.if(plugins.util.getIsWatch(), plugins.log()))

      .pipe(this.serv());
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Img(task);

