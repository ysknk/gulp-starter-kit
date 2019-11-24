'use strict';

import TaskMaster from '../task/master';
import pug from '../plugins/pug/';
import pugInheritance from '../plugins/pug-inheritance/';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'html',
  types: ['build', 'lint', 'clean']// **:watch function [0] || 'procedure'
};

/**
 * Html
 */
class Html extends TaskMaster {

  /**
   * constructor
   *
   * @param {object} opts_
   */
  constructor(opts_) {
    super(opts_);

    this.extension = this.task.data.extension;
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

    this.task.data.inheritance_options = _.merge({},
      htdocsdir,
      this.task.data.inheritance_options
    );
  }

  /**
   * configBuild
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  configBuild(stream, done) {
    this.build(stream, done, true);
  }

  /**
   * build
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   * @param {boolean} isBuild set flag
   */
  build(stream, done, isBuild) {
    let that = this;
    let isWatch = isBuild ? false : plugins.util.getIsWatch();
    let watchEvent = isWatch ? plugins.util.getWatchEvent() : ``;

    stream
      .pipe($.plumber(this.errorMessage()))

      .pipe($.data((file) => {
        return this.setCurrentData(file.relative, this.task.data);
      }))

      .pipe($.if(isWatch, $.changed(this.task.data.dest, {
        transformPath: (distPath) => {
          let parse = path.parse(distPath);
          let filename = `${parse.name}${this.extension}`;
          let dist = path.join(path.dirname(distPath), filename);
          return dist;
        }
      })))

      .pipe($.if(isWatch, $.cached(this.task.name)))
      // .pipe($.debug({title: 'Debug before gulp-pug-inheritance'}))
      .pipe($.if(isWatch, pugInheritance(this.task.data.inheritance_options)))

      .pipe($.data((file) => {
        return this.setCurrentData(file.relative, this.task.data);
      }))

      // .pipe($.debug({title: 'Debug after gulp-pug-inheritance'}))
      .pipe($.filter((file) => {
        return this.ignoreFilter(file);
      }))
      // .pipe($.debug({title: 'Debug after gulp-filter'}))

      .pipe(pug(this.task.data.options))
      .pipe($.if(this.isMinify(), $.minifyHtml(this.task.data.minify_options)))

      .pipe($.if(this.isExtname(), $.rename(function(path) {
        path.extname = that.extension;
      })))
      .pipe(plugins.useful(this.task.data.convert))

      .pipe(gulp.dest(this.task.data.dest))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe($.if(this.isLint(), $.htmlhint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.htmlhint.reporter(this.task.data.lint_report_type || path)))

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
    let that = this;

    stream
      .pipe($.plumber(this.errorMessage()))

      .pipe($.filter((file) => {
        return this.ignoreFilter(file);
      }))

      .pipe($.data((file) => {
        return this.setCurrentData(file.relative, this.task.data);
      }))
      .pipe(pug(this.task.data.options))
      .pipe($.if(this.isExtname(), $.rename(function(path) {
        path.extname = that.extension;
      })))
      .pipe(plugins.useful(this.task.data.convert))

      .pipe($.htmlhint(this.task.data.lint_options))
      .pipe($.htmlhint.reporter(this.task.data.lint_report_type || path))

      .on('finish', () => {done && done();});
  }

  /**
   * clean
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  clean(stream, done) {
    let that = this;

    stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.data((file) => {
        return this.setCurrentData(file.relative, this.task.data);
      }))
      .pipe($.if(this.isExtname(), $.rename(function(path) {
        path.extname = that.extension;
      })))
      .pipe(plugins.clean({
        dest: this.task.data.dest
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
    let ignore = this.getIgnore();
    // let mergeSrc = [...src, ...ignore];
    let mergeSrc = [...src];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc, {allowEmpty: true}), done);
    });

    // config build task
    gulp.task('config:build', (done) => {
      this.configBuild(gulp.src(mergeSrc, {allowEmpty: true}), done);
    });

    // watch task
    gulp.task(this.task.name + ':watch', () => {
      plugins.util.setIsWatch(true);
      let watcher = gulp.watch(src, {
        atomic: 500
      }, gulp.series(this.task.name));

      this.setAllWatcher(watcher, this.task.data);
      this.setDeleteWatcher(watcher, this.task.data);

      let taskserv = (this.servName() && config[this.task.name][plugins.util.getServName()]) ?
        (this.servName() + ':' + config[this.task.name][plugins.util.getServName()]) : plugins.util.getEmptyName();

      // html only
      gulp.watch(define.path.pageConfig, gulp.series(`config:build`, taskserv));
    });

    // other types task
    _.forEach(this.task.types, (type, i) => {
      if(!this[type]) return;
      gulp.task(this.task.name + ':' + type, (done) => {
        this[type](gulp.src(mergeSrc, {allowEmpty: true}), done);
      });
    });
  }
}

module.exports = new Html(task);

