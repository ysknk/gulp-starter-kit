'use strict';

import requireDir from 'require-dir';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import os from 'os';

/**
 * Util
 */
class Util {
  constructor() {
    this.requireDir = requireDir;
    this.fancyLog = fancyLog;
    this.colors = colors;
  }

  /**
   * log
   *
   * @param {string} string notice
   */
  log(string) {
    this.fancyLog(string);
  }

  /**
   * setGlobalVars
   *
   * @param {string} name namespace
   * @param {object} obj variable
   */
  setGlobalVars(name, obj) {
    if(global[name]) {
      this.log([
        'Error! Please rename global vars',
        this.colors.magenta(name)
      ].join(' '));
      process.exit(1);
    }
    if(obj) global[name] = obj;
  }

  /**
   * setRequireDir
   *
   * @param {string} filepath tasks directory path
   * @returns {boolean}
   */
  setRequireDir(filepath) {
    try {
      fs.statSync(filepath);
      this.requireDir(filepath, {recurse: true});
      return true;
    }catch(err) {
      if(err.code === 'ENOENT') {
        if(!fs.statSync(filepath)) {
          fs.mkdirSync(filepath);
          this.log([
            'Create directory',
            this.colors.magenta(filepath)
          ].join(' '));
        }
        return false;
      }
    }
  }

  /**
   * checkFile
   *
   * @param {string} filepath
   * @returns {boolean}
   */
  checkFile(filepath) {
    try {
      fs.statSync(filepath);
      return true
    }catch(err) {
      if(err.code === 'ENOENT') {
        return false;
      }
    }
  }

  /**
   * createFile
   *
   * @param {string} filepath
   * @param {string} body
   */
  createFile(filepath, body = '') {
    if(!fs.existsSync(filepath)) {
      fs.writeFile(filepath, body, (error) => {});
      this.log([
        'Create file',
        this.colors.magenta(filepath)
      ].join(' '));
    }
  }

  /**
   * getReplaceDir
   *
   * @param {string} filepath directory path
   * @returns {string} replace path
   */
  getReplaceDir(filepath) {
    return filepath.replace(/\\/g, '/');
  }

  /**
   * setIsWatch
   *
   * @param {boolean} bool true or false
   */
  setIsWatch(bool) {
    this._isWatch = bool;
  }

  /**
   * getIsWatch
   *
   * @returns {boolean}
   */
  getIsWatch() {
    return this._isWatch || false;
  }

  /**
   * setWatchEvent
   *
   * @param {object} obj event, path
   */
  setWatchEvent(obj) {
    this._watchEvent = obj;
  }

  /**
   * getWatchEvent
   *
   * @returns {object} event, path
   */
  getWatchEvent() {
    return this._watchEvent || false;
  }

  /**
   * getParam
   *
   * @returns {array}
   */
  getParam() {
    return (process.argv && process.argv.slice(2)) || [];
  }

  /**
   * splitExtension
   *
   * @param {string} filename filename
   * @param {boolean} dot ['hoge', '.html'] || ['hoge', 'html']
   * @returns {array}
   */
  splitExtension(filename, dot = true) {
    if(dot) {
      return filename.split(/(?=\.[^.]+$)/);
    }else{
      return filename.split(/\.(?=[^.]+$)/);
    }
  }

  /**
   * isWin
   *
   * @returns {boolean}
   */
  isWin() {
    return os.platform().match(/^win/) ? true : false;
  }

}

module.exports = new Util();

