'use strict';

import TaskMaster from '../task/master';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'css',
  types: ['build', 'lint']// **:watch function [0] || 'procedure'
};

/**
 * Css
 */
class Css extends TaskMaster {
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

      .pipe($.stylus(this.task.data.options))
      .pipe($.csscomb(this.task.data.comb_options))
      .pipe($.if(this.isMinify(), $.cleanCss(this.task.data.minify_options)))

      .pipe(plugins.useful(this.task.data.convert))

      .pipe(gulp.dest(this.task.data.dist))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe($.if(this.isLint(), $.csslint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.csslint.formatter(this.task.data.lint_report_type || '')))

      .pipe(this.serv())

      .on('finish', () => {done && done();});
  }

  /**
   * lint
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  lint(stream, done) {
    stream
      .pipe($.plumber(this.errorMessage()))

      .pipe($.stylus(this.task.data.options))
      .pipe($.csscomb(this.task.data.comb_options))

      .pipe(plugins.useful(this.task.data.convert))

      .pipe($.csslint(this.task.data.lint_options))
      .pipe($.csslint.formatter(this.task.data.lint_report_type || ''))

      .on('finish', () => {done && done();});
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Css(task);

