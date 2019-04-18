'use strict';

const TaskMaster = require('../../../../_app/gulpfile.babel.js/task/master');

const plugin = require('node-aigis');

const pluginError = require('plugin-error');
const through = require('through2');
const path = require('path');

/**
 * Set Const Variables
 */
const config = global[define.ns];

/**
 * Set Variables
 */
const task = {
  name: 'styleguide',
  types: []// **:watch function [0] || 'proc'
};

/**
 * Styleguide
 */
class Styleguide extends TaskMaster {

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
    stream
      .pipe(through.obj(function(file, enc, cb) {
        let configFile = path.resolve(file.path);

        try {
          let aigis = new plugin(configFile);
          aigis.run().then(cb);
        } catch(e) {
          this.emit('error', new pluginError('node-aigis', e.message));
          cb();
        }

        this.push(file);
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
    let mergeSrc = src;

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc, {allowEmpty: true}), done);
    });
  }

}

module.exports = new Styleguide(task);
