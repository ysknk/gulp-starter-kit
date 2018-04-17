'use strict';

import TaskMaster from '../taskMaster';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'html',
  types: ['build', 'lint']// **:watch function [0] || 'proc'
};

/**
 * Html
 */
class Html extends TaskMaster {
  constructor(options) {
    super(options);
  }

  /**
   * init
   */
  init() {
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
   * deleteChild
   *
   * @param {object} data key value
   */
  deleteChild(data) {
    _.each(data, (obj, key) => {
      if(key.match(/^[$|\/]/)) {
        delete data[key];
      }
    });
  }

  /**
   * setFileData
   *
   * @param {object} file gulp object
   * @returns {object} page data
   */
  setFileData(file) {
    let meta = require(this.task.data.meta);
    let filepath = plugins.util.getReplaceDir(file.relative);
    let data = {};

    let dirMark = '/';
    let fileMark = '$';

    let section = filepath.split('/');
    let isSet = false;

    let common = {};
    _.each(meta, (val, key) => {
      if(!key.match(/^[\/|\$]/)) {
        common[key] = val;
      }
    });

    _.each(section, (name, i) => {
      let confname = '';
      let filesplit = name.split(/(.*)(?:\.([^.]+$))/);
      let isDirectory = filesplit[0];

      confname = isDirectory ?
        dirMark + filesplit[0] : fileMark + filesplit[1];

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
    });

    data = _.merge({}, common, data);
    this.deleteChild(data);

    // set assets path
    (() => {
      data.assets_path = data.assets_path || this.task.data.assets_path;

      if(this.task.data.path_type.match(/relative/i)) {
        data.assets_path = this.task.data.dist + data.assets_path;

        let assets_path = path.resolve(data.assets_path);
        let dirArray = filepath.split(dirMark);
        dirArray[dirArray.length - 1] = '';
        let dist_path = path.resolve(this.task.data.dist + dirArray.join(dirMark));
        let relative_path = path.relative(dist_path, assets_path);

        data.assets_path = plugins.util.getReplaceDir(relative_path);
      }
    })();

    return data;
  }

  /**
   * build
   * watch or build
   *
   * @param {object} stream gulp object
   * @param {function} done set complete
   */
  build(stream, done) {
    stream
      .pipe($.plumber(this.errorMessage()))
      .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dist, {
        extension: this.task.data.extension
      })))
      .pipe($.if(plugins.util.getIsWatch(), $.cached(this.task.name)))

      //find files that depend on the files that have changed
      .pipe($.pugInheritance(this.task.data.inheritance_options))
      //filter out partials (folders and files starting with "_" )
      .pipe($.filter((file) => {return this.ignoreFilter(file);}))

      .pipe($.data((file) => {
        return this.setFileData(file);
      }))
      .pipe($.pug(this.task.data.options))
      .pipe($.if(this.isMinify(), $.minifyHtml(this.task.data.minify_options)))

      .pipe(plugins.useful(this.task.data.convert))
      .pipe(gulp.dest(this.task.data.dist))

      .pipe($.size(this.sizeOptions()))
      .pipe(plugins.log())

      .pipe($.if(this.isLint(), $.htmlhint(this.task.data.lint_options)))
      .pipe($.if(this.isLint(), $.htmlhint.reporter()))

      .pipe(this.serv());

    done && done();
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

      .pipe($.filter((file) => {
        let htdocs = path.relative(define.path.htdocs, file.path);
        let isFileIgnore = !/^_/.test(file.relative);
        let isDirectoryIgnore = !/\/_/.test(htdocs);
        return isDirectoryIgnore && isFileIgnore;
      }))

      .pipe($.data((file) => {
        return this.setFileData(file);
      }))
      .pipe($.pug(this.task.data.options))

      .pipe($.size(this.sizeOptions()))

      .pipe($.htmlhint(this.task.data.lint_options))
      .pipe($.htmlhint.reporter());

    done && done();
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Html(task);
