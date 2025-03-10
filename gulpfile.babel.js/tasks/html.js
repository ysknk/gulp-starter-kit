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
 * HTML
 */
class HTML extends TaskMaster {

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
      basedir: `${this.task.data.htdocsdir}${this.task.data.base_dir}`
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

    stream
      .pipe($.plumber(this.errorMessage()))

      .pipe($.data((file) => {
        return this.setCurrentData(file.relative, this.task.data);
      }))

      .pipe($.if(isWatch, $.changed(this.getDest(), {
        transformPath: (distPath) => {
          let parse = path.parse(distPath);
          let filename = `${parse.name}${this.extension}`;
          let dist = path.join(path.dirname(distPath), filename);
          return dist;
        }
      })))

      .pipe($.if(isWatch, $.cached(this.task.name)))
      .pipe($.if(isWatch && this.task.data.is_inheritance, pugInheritance(this.task.data.inheritance_options)))

      .pipe($.data((file) => {
        return this.setCurrentData(file.relative, this.task.data);
      }))

      .pipe($.filter((file) => {
        return this.ignoreFilter(file);
      }))

      .pipe(pug(this.task.data.options))
      .pipe($.if(this.isMinify(), $.minifyHtml(this.task.data.minify_options)))

      .pipe($.if(this.isExtname(), $.rename(function(path) {
        path.extname = that.extension;
      })))
      .pipe(plugins.useful(this.task.data.convert))

      .pipe(gulp.dest(this.getDest()))
      .on('finish', () => {done && done();})

      .pipe($.size(this.sizeOptions()))
      .pipe($.if(plugins.util.getIsWatch(), plugins.log()))

      .pipe($.if(this.isLint(), $.htmlhint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.htmlhint.reporter(this.task.data.lint_report_type || path)))

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
        dest: this.getDest()
      }))
      .on('finish', () => {done && done();});
  }

  /**
   * watch
   *
   * @param {object} task
   * @param {array} src
   */
  watch(task, src) {
    plugins.util.setIsWatch(true);
    let watcher = gulp.watch(src, {
      atomic: true
    }, gulp.series(task.name));

    this.setAllWatcher(watcher, task.data);
    if (task.data.delete) {
      this.setDeleteWatcher(watcher, task.data);
    }

    let taskserv = (this.servName() && config[task.name][define.task.name.serv]) ?
      `${this.servName()}${define.task.separator}${config[task.name][define.task.name.serv]}` : define.task.name.empty;

    if (task.data.is_config_build) {
      gulp.watch(define.path.pageConfig, gulp.series(`${define.task.name.config}{define.task.separator}${define.task.name.build}`, taskserv));
    }
  }

  /**
   * setTask
   */
  setTask() {
    const defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    const src = this.getSrc();
    const mergeSrc = [...src];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc, {allowEmpty: true}), done);
    });

    // configs build task
    if (this.task.data.conf_files.length) {
      gulp.task(`${define.task.name.config}s${define.task.separator}${define.task.name.build}`, (done) => {
        this.configBuild(gulp.src(mergeSrc, {allowEmpty: true}), done);
      });
    }

    // config build task
    if (this.task.data.is_config_build) {
      gulp.task(`${define.task.name.config}${define.task.separator}${define.task.name.build}`, (done) => {
        this.configBuild(gulp.src(mergeSrc, {allowEmpty: true}), done);
      });
    }

    // watch task
    gulp.task(`${this.task.name}${define.task.separator}${define.task.name.watch}`, () => {
      this.watch(this.task, src);
    });

    // other types task
    _.forEach(this.task.types, (type) => {
      if(!this[type]) return;
      gulp.task(`${this.task.name}${define.task.separator}${type}`, (done) => {
        this[type](gulp.src(mergeSrc, {allowEmpty: true}), done);
      });
    });
  }
}

module.exports = new HTML(task);

