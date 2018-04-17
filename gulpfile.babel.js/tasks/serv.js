'use strict';

import TaskMaster from '../taskMaster';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'serv',
  types: ['open', 'reload', 'stream']// **:watch function [0] || 'proc'
};

/**
 * Serv
 */
class Serv extends TaskMaster {
  constructor(options) {
    super(options);
  }

  /**
   * init
   */
  // init() {}

  /**
   * open
   * @param {function} done set complete
   */
  open(done) {
    if(argv.no) {
      this.task.data.options.open = false;
    }

    browserSync.init(this.task.data.options);

    done && done();
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
    _.each(this.task.types, (type, i) => {
      if(!this[type]) return;
      gulp.task(this.task.name + ':' + type, (done) => {
        this[type](done);
      });
    });
  }

}

module.exports = new Serv(task);
