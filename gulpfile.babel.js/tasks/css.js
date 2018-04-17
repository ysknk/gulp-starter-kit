'use strict';

import TaskMaster from '../taskMaster';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'css',
  types: ['build', 'lint']// **:watch function [0] || 'proc'
};

/**
 * Css
 */
class Css extends TaskMaster {
  constructor(options) {
    super(options);
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
  build(stream, done) {
    stream
      .pipe($.plumber(this.errorMessage()))
      // .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dist, {
      //   extension: this.task.data.extension
      // })))
      .pipe($.if(plugins.util.getIsWatch(), $.cached(this.task.name)))
      .pipe($.if(plugins.util.getIsWatch(), $.progeny()))
      //filter out partials (folders and files starting with "_" )
      .pipe($.filter((file) => {return this.ignoreFilter(file);}))

      .pipe($.stylus(this.task.data.options))
      .pipe($.csscomb(this.task.data.comb_options))
      .pipe($.if(this.isMinify(), $.cleanCss(this.task.data.minify_options)))

      .pipe(plugins.useful(this.task.data.convert))
      // .pipe($.if(plugins.util.getIsWatch(), $.remember(this.task.name)))
      .pipe(gulp.dest(this.task.data.dist))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe($.if(this.isLint(), $.csslint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.csslint.formatter()))

      .pipe(this.serv());

    done && done();
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

      .pipe($.size(this.sizeOptions()))

      .pipe($.csslint(this.task.data.lint_options))
      .pipe($.csslint.formatter());

    done && done();
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Css(task);
