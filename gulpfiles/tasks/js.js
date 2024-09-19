'use strict';

import TaskMaster from '../task/master.js';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';

import TerserPlugin from 'terser-webpack-plugin';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'js',
  types: ['build', 'lint', 'clean']// **:watch function [0] || 'procedure'
};

/**
 * JS
 */
class JS extends TaskMaster {

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
    if(plugins.util.getIsWatch()) {
      this.task.data.options.cache = true;
      // this.task.data.options.watch = true;
    }

    if(this.isMinify()) {
      this.task.data.options.optimization = {
        minimize: true,
        minimizer: [new TerserPlugin(this.task.data.minify_options)],
      };
    }

    stream
      // NOTE: not work in webpack5
      // .pipe($.plumber(this.errorMessage()))
      .pipe($.plumber({errorHandler: () => {}}))

      .pipe(named((path) => {
        return path.relative.replace(/\.[^\.]+$/, '');
      }))

      .pipe($.if(this.isLint(), $.eslint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.eslint.format(this.task.data.lint_report_type || '', process.stdout)))
      .pipe($.if(this.isLint(), $.eslint.results((results) => {console.log();})))
      .pipe($.if(this.isLint(), $.eslint.failAfterError()))

      .pipe(webpackStream(this.task.data.options, webpack))

      .pipe(plugins.useful(this.task.data.convert))
      .pipe($.if(this.isExtname(), $.rename({
        extname: this.task.data.extension
      })))

      .pipe(gulp.dest(this.getDest()))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

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

      .pipe(named((path) => {
        return path.relative.replace(/\.[^\.]+$/, '');
      }))

      .pipe($.eslint(this.task.data.lint_options))
      .pipe($.eslint.format(this.task.data.lint_report_type || '', process.stdout))
      .pipe($.eslint.results((results) => {console.log();}))
      .pipe($.eslint.failAfterError())

      .on('finish', () => {done && done();});
      // .pipe($.eslint.result((results) => {this.lintResult(results)}));
  }

}

export default new JS(task);

