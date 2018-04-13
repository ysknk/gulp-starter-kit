'use strict';

import TaskMaster from '../taskMaster';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import named from 'vinyl-named';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'js',
  types: ['build', 'lint']// **:watch function [0]
};

/**
 * Js
 */
class Js extends TaskMaster {
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

    if(plugins.util.getIsWatch()) {
      this.task.data.options.cache = true;
      // this.task.data.options.watch = true;
    }

    if(this.isMinify()) {
      this.task.data.options.mode = 'production';
    }

    stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dist, {
        extension: this.task.data.extension
      })))
      .pipe($.if(plugins.util.getIsWatch(), $.cached(this.task.name)))

      .pipe(named((path) => {
        return path.relative.replace(/\.[^\.]+$/, '');
      }))
      .pipe(webpackStream(this.task.data.options, webpack))

      .pipe(plugins.useful(this.task.data.convert))
      .pipe($.if(plugins.util.getIsWatch(), $.remember(this.task.name)))
      .pipe(gulp.dest(this.task.data.dist))

      // .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe($.if(this.isLint(), $.eslint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.eslint.format()))

      .pipe(this.serv());
    done();
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
      .pipe($.eslint(this.task.data.lint_options))
      .pipe($.eslint.format())
    done();
  }

  /**
   * setTask
   */
  // setTask() {
  //   let defaultTask = this.task.types[0];
  //
  //   // default task
  //   gulp.task(this.task.name, (done) => {
  //     this[defaultTask](gulp.src(this.task.data.src), done);
  //   });
  //
  //   // watch task
  //   gulp.task(this.task.name + ':watch', (done) => {
  //     plugins.util.setIsWatch(true);
  //     this[defaultTask](gulp.src(this.task.data.src), done);
  //   });
  //
  //   // other types task
  //   _.each(this.task.types, (type, i) => {
  //     if(!this[type]) return;
  //     gulp.task(this.task.name + ':' + type, (done) => {
  //       this[type](gulp.src(this.task.data.src), done);
  //     });
  //   });
  // }

};

module.exports = new Js(task);

