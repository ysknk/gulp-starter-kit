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
  constructor(opts_) {
    if(!opts_) return;
    opts_ = _.merge({}, task, opts_);

    this.task = {
      name: opts_.name,
      types: opts_.types,
      data: config && _.merge({},
        config['common'] || {},
        config[opts_.name] || {}
      )
    };

    if(!config ||
      !this.task.name ||
        !this.isTask()) return;

    this.initialize();
    this.setTask();
  }

  /**
   * initialize
   */
  initialize() {}

  /**
   * procedure
   * if(!task.type.length) watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  procedure(stream, done) {
    done && done();
  }

  /**
   * setTask
   */
  setTask() {
    let defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    let src = this.getSrc();
    let ignore = this.getIgnore();
    let mergeSrc = [...src, ...ignore];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc), done);
    });

    // watch task
    gulp.task(this.task.name + ':watch', () => {
      plugins.util.setIsWatch(true);
      let watcher = gulp.watch(src, gulp.parallel(this.task.name));
      this.setDeleteWatcher(watcher, this.task.data);
    });

    // other types task
    _.each(this.task.types, (type, i) => {
      if(!this[type]) return;
      gulp.task(this.task.name + ':' + type, (done) => {
        this[type](gulp.src(mergeSrc), done);
      });
    });
  }

  /**
   * getSrc
   *
   * @param {array} src
   * @returns {array} src
   */
  getSrc(src) {
    return src || (this.task && this.task.data.src) || ['**/*'];
  }

  /**
   * getIgnore
   *
   * @param {array} ignore
   * @returns {array} ignore
   */
  getIgnore(ignore) {
    let data = ignore || (this.task && this.task.data.ignore) || [];

    if(data.length) {
      return _.map(data, (val) => {
        return '!' + (plugins.util.isWin() ?
          val : path.resolve(val));
      });
    }
    return data;
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
      browserSync[this.task.data.serv]() : plugins.empty();
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
    return argv.lint || this.task.data.lint || false;
  }

  /**
   * isNo
   * do not open the browser
   * gulp --no
   *
   * @returns {boolean}
   */
  isNo() {
    return argv.no || this.task.data.no || false;
  }

  /**
   * isMinify
   * gulp watch --min or minify true
   *
   * @returns {boolean}
   */
  isMinify() {
    if(argv.min || this.task.data.minify) {
      if(this.task.data.options && this.task.data.options.mode) {
        this.task.data.options.mode = 'production';
      }
      return true;
    }else{
      return false;
    }
  }

  /**
   * isTask
   *
   * @param {string} name=this.task.name task name
   * @returns {object}
   */
  isTask(name = this.task.name) {
    return config.tasks[name];
  }

  /**
   * ignoreFilter
   *
   * @param {object} file gulp object
   * @returns {boolean}
   */
  ignoreFilter(file) {
    let htdocs = path.relative(this.task.data.htdocsdir, file.path);
    let isFileIgnore = !/^_/.test(plugins.util.getReplaceDir(file.relative));
    let isDirectoryIgnore = !/\/_/.test(plugins.util.getReplaceDir(htdocs));
    return isDirectoryIgnore && isFileIgnore;
  }

};

