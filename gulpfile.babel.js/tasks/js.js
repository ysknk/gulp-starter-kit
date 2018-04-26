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
      .pipe($.filter((file) => {
        return this.ignoreFilter(file);
      }))
      // .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dist, {
      //   extension: this.task.data.extension
      // })))
      // .pipe($.if(plugins.util.getIsWatch(), $.cached(this.task.name)))

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

  // /**
  //  * lintResult
  //  * @param {object} results
  //  */
  // lintResult(results) {
  //   var results = results || [];
  //   console.log(results)
  //
  //   var summary = _.reduce(results, function(seq, current) {
  //     _.each(current.messages, function(msg) {
  //       var logMessage = {
  //         filePath: current.filePath,
  //         ruleId: msg.ruleId,
  //         message: msg.message,
  //         line: msg.line,
  //         column: msg.column,
  //         source: msg.source
  //       };
  //
  //       if(msg.severity === 1) {
  //         logMessage.type = 'warning';
  //         seq.warnings.push(logMessage);
  //       }
  //       if(msg.severity === 2) {
  //         logMessage.type = 'error';
  //         seq.errors.push(logMessage);
  //       }
  //     });
  //     return seq;
  //   }, {
  //     errors: [],
  //     warnings: []
  //   });
  //
  // console.log(summary)
  //   if(summary.errors.length || summary.warnings.length) {
  //     var lines = summary.errors.concat(summary.warnings).map(function(msg) {
  //       return '\n' + msg.type + ' ' + msg.ruleId + '\n  ' + msg.filePath + ':' + msg.line + ':' + msg.column;
  //     }).join('\n');
  //
  // console.log(lines + '\n')
  //     return lines + '\n';
  //   }
  // }

  // /**
  //  * setTask
  //  */
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

}

module.exports = new Js(task);

