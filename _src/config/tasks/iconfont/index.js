'use strict';

const TaskMaster = require('../../../../_app/gulpfile.babel.js/task/master');

const plugin = require('gulp-iconfont');

/**
 * Set Const Variables
 */
const config = global[define.ns];

/**
 * Set Variables
 */
const task = {
  name: 'iconfont',
  types: []// **:watch function [0] || 'proc'
};

/**
 * Iconfont
 */
class Iconfont extends TaskMaster {

  /**
   * constructor
   *
   * @param {object} opts_
   */
  constructor(opts_) {
    super(opts_);
  }

  /**
   * procedure
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  procedure(stream, done) {
    let runTimestamp = Math.round(Date.now() / 1000);

    stream
      .pipe(plugin({
        ...this.task.data.options,
        timestamp: runTimestamp,
      }))
      .pipe(gulp.dest(this.task.data.dest))

      .pipe($.size(this.sizeOptions()))

      .on('finish', () => {done && done();});
  }

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    let src = this.getSrc();
    let mergeSrc = src;

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc, {allowEmpty: true}), done);
    });
  }

}

module.exports = new Iconfont(task);
