'use strict';

import TaskMaster from '../task/master.js';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'css',
  types: ['build', 'lint', 'clean']// **:watch function [0] || 'procedure'
};

/**
 * CSS
 */
class CSS extends TaskMaster {

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
      .pipe($.autoprefixer(this.task.data.autoprefixer_options))
      .pipe($.csscomb(this.task.data.comb_options))
      .pipe($.if(this.isMinify(), $.cleanCss(this.task.data.minify_options)))

      .pipe(plugins.useful(this.task.data.convert))
      .pipe($.if(this.isExtname(), $.rename({
        extname: this.task.data.extension
      })))

      .pipe(gulp.dest(this.getDest()))

      .pipe($.size(this.sizeOptions()))
      .pipe($.if(plugins.util.getIsWatch(), plugins.log()))

      .pipe($.if(this.isLint(), $.csslint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.csslint.formatter(this.task.data.lint_report_type || '')))

      .on('finish', () => {done && done();})
      .pipe(this.serv());
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
      .pipe($.autoprefixer(this.task.data.autoprefixer_options))
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

export default new CSS(task);

