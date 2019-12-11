'use strict';

const TaskMaster = require('../../../../_app/gulpfile.babel.js/task/master');

const plugin = require('../../../../_app/gulpfile.babel.js/plugins/pug');

/**
 * Set Const Variables
 */
const config = global[define.ns];

/**
 * Set Variables
 */
const task = {
  name: 'mass_production',
  types: []// **:watch function [0] || 'proc'
};

/**
 * MassProduction
 */
class MassProduction extends TaskMaster {

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
  initialize() {
    let htdocsdir = {
      basedir: this.task.data.htdocsdir
    };

    this.task.data.options = _.merge({},
      htdocsdir,
      this.task.data.options
    );
  }

  /**
   * procedure
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  procedure(stream, done) {
    const items = require(path.resolve(this.task.data.itemsfile));

    for (let item of items) {
      stream
        .pipe($.rename(item.filename + (item.extname || this.task.data.extension)))
        .pipe($.data((file) => {
          item.data = _.merge({},
            this.task.data.meta,
            item.data
          );
          item.data.assets_path = this.task.data.assets_path;
          return item.data;
        }))

        .pipe(plugin(this.task.data.options))
        .pipe(plugins.useful(this.task.data.convert))
        .pipe(gulp.dest(item.dest || this.task.data.dest))

        .pipe($.size(this.sizeOptions()))
        .pipe(plugins.log())

        .on('finish', () => {done && done();});
    }
  }

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    let src = this.task.data.src;

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(src, {allowEmpty: true}), done);
    });
  }

}

module.exports = new MassProduction(task);
