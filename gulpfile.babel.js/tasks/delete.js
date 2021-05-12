'use strict';

import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import through from 'through2';

import TaskMaster from '../task/master';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'delete',
  types: []// **:watch function [0] || 'procedure'
};

/**
 * Delete
 */
class Delete extends TaskMaster {

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
   * procedure
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  procedure(stream, done) {
    let src = this.getSrc();
    let path = colors.bold(colors.red(src));
    let result = `Delete >>> ${path}`;
    let that = this;

    stream
      .pipe(through.obj(function(file, enc, cb) {
        if (plugins.util.isFileExists(src)) {
          del.sync(src, {force: true});
          notifier.notify({
            title: that.task.name,
            message: src,
            sound: false,
            wait: false,
            timeout: 1,
            type: 'info'
          });
          fancyLog(result);
        }
        cb();
      }, function(cb) {
        this.emit('end');
        cb();
      }))

      .on('finish', () => {done && done();});
  }

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    let src = this.getSrc();

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(src, {allowEmpty: true}), done);
    });
  }

}

module.exports = new Delete(task);

