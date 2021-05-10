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

    this.task = this.setTaskData(opts_);

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
   * setTaskData
   *
   * @param {object} opts_
   * @returns {object}
   */
  setTaskData(opts_) {
    return {
      name: opts_.name,
      types: opts_.types,
      data: config && _.merge({},
        config['common'] || {},
        config[opts_.name] || {}
      )
    };
  }

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
    const watcher = gulp.watch(src, {
      atomic: true
    }, gulp.series(task.name));
    this.setAllWatcher(watcher, task.data);
    if (task.data.delete) {
      this.setDeleteWatcher(watcher, task.data);
    }
  }

  /**
   * setTask
   */
  setTask() {
    const defaultTask = this.task.types && this.task.types.length ?
      this.task.types[0] : 'procedure';
    const src = this.getSrc();
    const ignore = this.getIgnore();
    const mergeSrc = [...src, ...ignore];

    // default task
    gulp.task(this.task.name, (done) => {
      this[defaultTask](gulp.src(mergeSrc, {allowEmpty: true}), done);
    });

    // watch task
    gulp.task(this.task.name + ':watch', () => {
      this.watch(this.task, src)
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
   * getDest
   *
   * @param {object} conf
   * @returns {string}
   */
  getDest(conf) {
    const dest = conf ? conf.dest : this.task.data.dest;
    const dist = conf ? conf.dist : this.task.data.dist;
    return `${dest}${dist}`;
  }

  /**
   * getIgnore
   *
   * @param {array} ignore
   * @returns {array} ignore
   */
  getIgnore(ignore) {
    const data = ignore || (this.task && this.task.data.ignore) || [];

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
    const that = this;

    watcher.on('unlink', (filepath) => {
      let filePathFromSrc = path.relative(path.resolve(define.path.htdocs), filepath);
      filePathFromSrc = filePathFromSrc.replace(conf.base_dir, '');
      let extname = conf.extension;
      let data = ``;

      if (conf.meta) {
        data = that.setCurrentData(filePathFromSrc, conf);
        extname = data.extension || conf.extension;
      }

      const filename = plugins.util.splitExtension(filePathFromSrc);
      if (extname && filename[1] != extname) {
        filename[1] = extname;
        filePathFromSrc = filename.join('');
      }

      const destFilePath = path.resolve(this.getDest(conf), filePathFromSrc);
      if (plugins.util.isFileExists(destFilePath)) {
        del.sync(destFilePath, {force: true});
        plugins.util.log(colors.bgred('delete ' + destFilePath));

        const destDirPath = destFilePath.replace(filePathFromSrc, '')
        fs.readdir(destDirPath, function(err, files) {
          if (err) {
            plugins.util.log(colors.bgred('delete error ' + err));
          } else {
            if (!files.length) {
              del.sync(destDirPath, {force: true});
              plugins.util.log(colors.bgred('delete ' + destDirPath));
            }
          }
        });

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
          actions: `Close`,
          closeLabel: ``,
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
    const meta = require(`../../${define.path.pageConfig}`);
    delete require.cache[require.resolve(`../../${define.path.pageConfig}`)]

    filepath = plugins.util.getReplaceDir(filepath);

    const dirMark = '/';
    const fileMark = '$';
    const section = filepath.split('/');

    let data = {};
    let isSet = false;

    let common = {};
    _.forEach(meta, (val, key) => {
      if(!key.match(/^[\/|\$]/)) {
        common[key] = val;
      }
    });

    _.forEach(section, (name, i) => {
      let confname = '';
      const filesplit = name.split(/(.*)(?:\.([^.]+$))/);
      const isDirectory = filesplit[0];

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

    // set root path
    (() => {
      if (!this.task || !data) return;
      data.root_path = data.root_path || taskData.root_path;

      if(taskData.path_type.match(/relative/i)) {
        data.root_path = this.getDest(taskData) + data.root_path;
        let root_path = path.resolve(data.root_path);
        let dirArray = filepath.split(dirMark);
        dirArray[dirArray.length - 1] = '';
        let dest_path = path.resolve(this.getDest(taskData) + dirArray.join(dirMark));
        let root_relative_path = path.relative(dest_path, root_path);

        data.root_path = `${plugins.util.getReplaceDir(root_relative_path)}/`;
        if (data.root_path === '/') {
          data.root_path = ``
        }
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

