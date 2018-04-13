'use strict';

/**
 * Set Const Variables
 */
const config = global[define.ns];

/**
 * Set Variables
 */
let task = {
  name: '',
  types: [],
  data: {}
};

/**
 * Task
 */
module.exports = class TaskMaster {
  constructor(options) {
    if(!options) return;
    options = _.merge({}, task, options);

    this.task = {
      name: options.name,
      types: options.types,
      data: config && config[options.name]
    };

    if(!config || !this.task.name) return;

    this.init();
    this.setTask();
  }

  /**
   * init
   */
  init() {}

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types[0];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(this.task.data.src, {since: gulp.lastRun(this.task.name)}), done);
    });

    // watch task
    gulp.task(this.task.name + ':watch', () => {
      plugins.util.setIsWatch(true);
      let watcher = gulp.watch(this.task.data.src, gulp.parallel(this.task.name));
      this.setDeleteWatcher(watcher, this.task.data);
    });

    // other types task
    _.each(this.task.types, (type, i) => {
      if(!this[type]) return;
      gulp.task(this.task.name + ':' + type, (done) => {
        this[type](gulp.src(this.task.data.src, {since: gulp.lastRun(this.task.name)}), done);
      });
    });
  }

  /**
   * setDeleteWatcher
   *
   * @param {object} watcher gulp watch object
   * @param {object} conf gulp task config
   */
  setDeleteWatcher(watcher, conf) {
    watcher.on('unlink', (filepath) => {
      let filePathFromSrc = path.relative(path.resolve(define.path.htdocs), filepath);

      let filename = plugins.util.splitExtension(filePathFromSrc);
      if(conf.extension && filename[1] != conf.extension) {
        filename[1] = conf.extension;
        filePathFromSrc = filename.join('');
      }

      let destFilePath = path.resolve(conf.dist, filePathFromSrc);
      del.sync(destFilePath, {force: true});
      plugins.util.log(colors.bgred('delete ' + destFilePath));
    });
  }

  /**
   * serv
   *
   * @returns {object}
   */
  serv() {
    return (this.task.data.serv === 'stream') ?
      browserSync[this.task.data.serv]() : $.empty();
  }

  /**
   * sizeOptions
   *
   * @returns {object}
   */
  sizeOptions() {
    return {
      title: this.task.name,
      showFiles: true
    };
  }

  /**
   * errorMessage
   *
   * @returns {object} plumber error notify
   */
  errorMessage() {
    return {
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    };
  }

  /**
   * isLint
   * gulp watch --lint or lint true
   *
   * @returns {boolean}
   */
  isLint() {
    return argv.lint || this.task.data.lint;
  }

  /**
   * isMinify
   * gulp watch --min or minify true
   *
   * @returns {boolean}
   */
  isMinify() {
    return argv.min || this.task.data.minify;
  }

};
