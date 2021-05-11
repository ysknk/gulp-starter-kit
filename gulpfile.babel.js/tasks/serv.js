'use strict';

import TaskMaster from '../task/master';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'serv',
  types: ['open', 'reload', 'stream']// **:watch function [0] || 'procedure'
};

/**
 * Serv
 */
class Serv extends TaskMaster {

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
   * open
   * @param {function} done set complete
   */
  open(done) {
    if(this.isNo()) {
      this.task.data.options.open = false;
    }

    browserSync.init(this.task.data.options, () => {
      done && done();
    });
  }

  /**
   * reload
   * @param {function} done set complete
   */
  reload(done) {
    browserSync.reload();

    done && done();
  }

  /**
   * stream
   * @param {function} done set complete
   */
  stream(done) {
    browserSync.stream();

    done && done();
  }

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types[0];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](done);
    });

    // other types task
    _.forEach(this.task.types, (type) => {
      if(!this[type]) return;
      gulp.task(`${this.task.name}${define.task.separator}${type}`, (done) => {
        this[type](done);
      });
    });
  }

}

module.exports = new Serv(task);

