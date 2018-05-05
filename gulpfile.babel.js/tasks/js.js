'use strict';

import TaskMaster from '../taskMaster';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';

import uglifyJsPlugin from 'uglifyjs-webpack-plugin';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'js',
  types: ['build', 'lint']// **:watch function [0] || 'procedure'
};

/**
 * Js
 */
class Js extends TaskMaster {
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
        minimizer: [
          new uglifyJsPlugin({
            uglifyOptions: this.task.data.minify_options
          })
        ]
      };
    }

    stream
      .pipe($.plumber(this.errorMessage()))

      .pipe(named((path) => {
        return path.relative.replace(/\.[^\.]+$/, '');
      }))

      .pipe($.if(this.isLint(), $.eslint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.eslint.format(this.task.data.lint_report_type || '', process.stdout)))
      .pipe($.if(this.isLint(), $.eslint.results((results) => {console.log();})))
      .pipe($.if(this.isLint(), $.eslint.failAfterError()))

      .pipe(webpackStream(this.task.data.options, webpack))

      .pipe(plugins.useful(this.task.data.convert))
      .pipe(gulp.dest(this.task.data.dist))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

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

module.exports = new Js(task);

