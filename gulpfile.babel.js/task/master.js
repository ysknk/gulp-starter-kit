'use strict';

import colors from 'ansi-colors';

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
   * clean
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  clean(stream, done) {
    stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.if(this.isExtname(), $.rename({
        extname: this.task.data.extension
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
    let mergeSrc = [...src, ...ignore];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc, {allowEmpty: true}), done);
    });

    // watch task
    gulp.task(this.task.name + ':watch', () => {
      plugins.util.setIsWatch(true);
      let watcher = gulp.watch(src, {
        atomic: 500
      }, gulp.parallel(this.task.name));
      this.setAllWatcher(watcher, this.task.data);
      if (this.task.data.delete) {
        this.setDeleteWatcher(watcher, this.task.data);
      }
    });

    // other types task
    _.forEach(this.task.types, (type, i) => {
      if(!this[type]) return;
      gulp.task(this.task.name + ':' + type, (done) => {
        this[type](gulp.src(mergeSrc, {allowEmpty: true}), done);
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
    let that = this;

    watcher.on('unlink', (filepath) => {
      let filePathFromSrc = path.relative(path.resolve(define.path.htdocs), filepath);
      let extname = conf.extension;
      let data = ``;

      if (conf.meta) {
        data = that.setCurrentData(filePathFromSrc, conf);
        extname = data.extension || conf.extension;
      }

      let filename = plugins.util.splitExtension(filePathFromSrc);
      if (extname && filename[1] != extname) {
        filename[1] = extname;
        filePathFromSrc = filename.join('');
      }

      let destFilePath = path.resolve(conf.dest, filePathFromSrc);
      if (plugins.util.checkFile(destFilePath)) {
        del.sync(destFilePath, {force: true});
        plugins.util.log(colors.bgred('delete ' + destFilePath));
      }
    });
  }

  /**
   * setAllWatcher
   *
   * @param {object} watcher gulp watch object
   * @param {object} conf gulp task config
   */
  setAllWatcher(watcher, conf) {
    watcher.on('all', (event, path) => {
      plugins.util.setWatchEvent({event, path});
    });
  }

  /**
   * serv
   *
   * @returns {object}
   */
  serv() {
    return this.servName() === 'empty' ?
      plugins.empty() : browserSync[this.servName()]({stream:true});
  }

  /**
   * servName
   *
   * @returns {object}
   */
  servName() {
    return plugins.util.getIsWatch() && this.task.data && this.task.data.serv ?
      this.task.data.serv : `empty`;
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
      errorHandler: function(error) {
        const message = `Error: ${error.message}`;
        console.log(error.plugin, message);
        notifier.notify({
          title: error.plugin,
          message: message,
          sound: false,
          wait: false,
          timeout: 1,
          type: 'info'
        });
      }
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
   * isExtname
   * file extension
   *
   * @returns {boolean}
   */
  isExtname() {
    return this.task.data.extension ? true : false;
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
   * isDel
   * do not open the browser
   * gulp --del
   *
   * @returns {boolean}
   */
  isDel() {
    return argv.del || this.task.data.del || false;
  }

  /**
   * isMinify
   * gulp watch --min or minify true
   *
   * @returns {boolean}
   */
  isMinify() {
    if(argv.min
      || this.task.data.minify
      || this.task.data.options.mode === 'production'
    ) {
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
   * @param {string} filepath
   * @returns {boolean}
   */
  ignoreFilter(file, filepath) {
    let htdocs = path.relative(this.task.data.htdocsdir, file.path || filepath);
    let isFileIgnore = !/^_/.test(plugins.util.getReplaceDir(file.relative || filepath));
    let isDirectoryIgnore = !/\/_/.test(plugins.util.getReplaceDir(htdocs));
    return isDirectoryIgnore && isFileIgnore;
  }

  /**
   * setCurrentData
   * use pug
   *
   * @param {string} filepath gulp object
   * @param {object} taskData
   * @returns {object} page data
   */
  setCurrentData(filepath, taskData) {
    let meta = require(`../../${define.path.pageConfig}`);
    delete require.cache[require.resolve(`../../${define.path.pageConfig}`)]

    filepath = plugins.util.getReplaceDir(filepath);

    let data = {};

    let dirMark = '/';
    let fileMark = '$';

    let section = filepath.split('/');
    let isSet = false;

    let common = {};
    _.forEach(meta, (val, key) => {
      if(!key.match(/^[\/|\$]/)) {
        common[key] = val;
      }
    });

    _.forEach(section, (name, i) => {
      let confname = '';
      let filesplit = name.split(/(.*)(?:\.([^.]+$))/);
      let isDirectory = filesplit[0];

      confname = isDirectory ?
        dirMark + filesplit[0] : fileMark + filesplit[1];

      if(!isDirectory && (section.length - 1) > i) {
        confname = dirMark + name;
      }

      if(meta[confname] && section.length == 1) {
        data = _.merge({}, data, meta[confname]);
      }else{
        if(isSet) {
          if(data[confname]) {
            let fulldata = _.merge({}, data);
            let nochild = _.merge({}, this.deleteChild(data));
            data = _.merge({}, nochild, fulldata[confname]);
          }
        }else{
          data = _.merge({}, data, meta[confname]);
        }
        isSet = true;
      }

      let addCommon = {};
      _.forEach(data, (val, key) => {
        if(!key.match(/^[\/|\$]/)) {
          addCommon[key] = val;
        }
      });
      common = _.merge({}, common, addCommon);
    });

    data = _.merge({}, common, data);
    this.deleteChild(data);

    // set assets path
    (() => {
      if (!this.task || !data) return;
      data.assets_path = data.assets_path || taskData.assets_path;

      if(taskData.path_type.match(/relative/i)) {
        data.assets_path = taskData.dest + data.assets_path;

        let assets_path = path.resolve(data.assets_path);
        let dirArray = filepath.split(dirMark);
        dirArray[dirArray.length - 1] = '';
        let dest_path = path.resolve(taskData.dest + dirArray.join(dirMark));
        let relative_path = path.relative(dest_path, assets_path);

        data.assets_path = `${plugins.util.getReplaceDir(relative_path)}/`;
      }
    })();

    this.extension = data.extension
      || taskData.extension;

    // set all data
    if(!data[`$global`]) {
      data[`$global`] = meta;
    }

    return data;
  }

  /**
   * deleteChild
   * use pug
   *
   * @param {object} data key value
   */
  deleteChild(data) {
    _.forEach(data, (obj, key) => {
      if(key.match(/^[\/|\$]/)) {
        delete data[key];
      }
    });
  }

};

