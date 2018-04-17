'use strict';

import TaskMaster from '../taskMaster';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'img',
  types: ['build']// **:watch function [0] || 'proc'
};

/**
 * Img
 */
class Img extends TaskMaster {
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
      .pipe($.if(plugins.util.getIsWatch(), $.newer(this.task.data.dist)))

      .pipe($.imagemin(this.task.data.plugins, this.task.data.options))

      .pipe(gulp.dest(this.task.data.dist))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe(this.serv());

    done && done();
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Img(task);
