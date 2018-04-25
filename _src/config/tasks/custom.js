'use strict';

const TaskMaster = require('../../../_app/gulpfile.babel.js/taskMaster');

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'custom',
  types: []// **:watch function [0] || 'proc'
};
//console.log(global)

/**
 * Custom
 */
class Custom extends TaskMaster {
  constructor(options) {
    // it will be executed if you uncomment below
    // super(options);
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
  // build(stream, done) {
  //   stream
  //     .pipe($.plumber(this.errorMessage()))
  //     .pipe(gulp.dest(this.task.data.dist))
  //     .pipe($.size(this.sizeOptions()))
  //     .pipe(plugins.log())
  //     .pipe(this.serv())
  //    .on('finish', () => {done && done();});
  // }

  /**
   * proc
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  proc(stream, done) {
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

