'use strict';

import TaskMaster from '../task/master';
import pug from '../plugins/pug/';

/**
 * Set Const Variables
 */
const config = global[define.ns];
const task = {
  name: 'html',
  types: ['build', 'lint']// **:watch function [0] || 'procedure'
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
   * deleteChild
   *
   * @param {object} data key value
   */
  deleteChild(data) {
    _.each(data, (obj, key) => {
      if(key.match(/^[\/|\$]/)) {
        delete data[key];
      }
    });
  }

  /**
   * setCurrentData
   *
   * @param {object} file gulp object
   * @returns {object} page data
   */
  setCurrentData(file) {
    let meta = this.task.data.meta;
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
      _.each(data, (val, key) => {
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
      data.assets_path = data.assets_path || this.task.data.assets_path;

      if(this.task.data.path_type.match(/relative/i)) {
        data.assets_path = this.task.data.dest + data.assets_path;

        let assets_path = path.resolve(data.assets_path);
        let dirArray = filepath.split(dirMark);
        dirArray[dirArray.length - 1] = '';
        let dest_path = path.resolve(this.task.data.dest + dirArray.join(dirMark));
        let relative_path = path.relative(dest_path, assets_path);

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
      .pipe($.if(plugins.util.getIsWatch(), $.changed(this.task.data.dest, {
        extension: this.task.data.extension
      })))
      .pipe($.if(plugins.util.getIsWatch(), $.cached(this.task.name)))

      .pipe($.if(plugins.util.getIsWatch(), $.pugInheritance(this.task.data.inheritance_options)))
      .pipe($.filter((file) => {
        return this.ignoreFilter(file);
      }))

      .pipe($.data((file) => {
        return this.setCurrentData(file);
      }))
      .pipe(pug(this.task.data.options))
      .pipe($.if(this.isMinify(), $.minifyHtml(this.task.data.minify_options)))

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
    stream
      .pipe($.plumber(this.errorMessage()))

      .pipe($.filter((file) => {
        return this.ignoreFilter(file);
      }))

      .pipe($.data((file) => {
        return this.setCurrentData(file);
      }))
      .pipe(pug(this.task.data.options))

      .pipe($.htmlhint(this.task.data.lint_options))
      .pipe($.htmlhint.reporter(this.task.data.lint_report_type || path))

      .on('finish', () => {done && done();});
  }

  /**
   * setTask
   */
  // setTask() {}

}

module.exports = new Html(task);

