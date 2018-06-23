'use strict';

const TaskMaster = require('../../../_app/gulpfile.babel.js/task/master');

/**
 * Set Const Variables
 */
const config = global[define.ns];

/**
 * Set Variables
 */
const task = {
  name: 'custom',
  types: []// **:watch function [0] || 'proc'
};
//console.log(global)

/**
 * Custom
 */
class Custom extends TaskMaster {
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
  // build(stream, done) {
  //   stream
  //     .pipe($.plumber(this.errorMessage()))
  //     .pipe(gulp.dest(this.task.data.dest))
  //     .pipe($.size(this.sizeOptions()))
  //     .pipe(plugins.log())
  //     .pipe(this.serv())
  //    .on('finish', () => {done && done();});
  // }

  /**
   * procedure
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  procedure(stream, done) {
    //console.log(stream, done)
    console.log('custom test');
    done && done();
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Custom(task);
