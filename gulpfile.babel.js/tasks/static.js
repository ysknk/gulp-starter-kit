'use strict';

import TaskMaster from '../task/master';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'static',
  types: ['build', 'clean']// **:watch function [0] || 'procedure'
};

/**
 * Static
 */
class Static extends TaskMaster {

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
      .pipe($.if(this.isExtname(), $.rename({
        extname: this.task.data.extension
      })))

      .pipe(gulp.dest(this.getDest()))

      .pipe($.size(this.sizeOptions()))
      .pipe($.if(plugins.util.getIsWatch(), plugins.log()))

      .on('finish', () => {done && done();})
      .pipe(this.serv());
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Static(task);

