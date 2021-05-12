'use strict';

import fs from 'fs-extra';
import os from 'os';
import colors from 'ansi-colors';
import fancyLog from 'fancy-log';
import requireDir from 'require-dir';

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
    if (global[name]) {
      this.log([
        'Error! Please rename global vars',
        this.colors.magenta(name)
      ].join(' '));
      process.exit(1);
    }
    if (obj) global[name] = obj;
  }

  /**
   * setRequireDir
   *
   * @param {string} filepath tasks directory path
   * @returns {boolean}
   */
  setRequireDir(filepath) {
    this.isFileExists(filepath,
      () => {
        this.requireDir(filepath, {recurse: true});
      },
      () => {
        fs.mkdirSync(filepath);
        this.log([
          'Create directory',
          this.colors.magenta(filepath)
        ].join(' '));
      }
    );
  }

  /**
   * isFileExists.
   *
   * @param {string} filepath
   * @param {function} onSuccess
   * @param {function} onFailure
   */
  isFileExists(filepath, onSuccess, onFailure) {
    try {
      fs.statSync(filepath);
      onSuccess && onSuccess();
      return true;
    } catch(error) {
      if (error.code === 'ENOENT') {
        onFailure && onFailure();
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
    if (!this.isFileExists(filepath)) {
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
   * splitExtension
   *
   * @param {string} filename filename
   * @param {boolean} dot ['hoge', '.html'] || ['hoge', 'html']
   * @returns {array}
   */
  splitExtension(filename, dot = true) {
    const exp = new RegExp(dot
      ? `(?=\.[^.]+$)`
      : `\.(?=[^.]+$)`
    );
    return filename.split(exp);
  }

  /**
   * isWindows
   *
   * @returns {boolean}
   */
  isWindows() {
    return os.platform().match(/^win/) ? true : false;
  }

}

module.exports = new Util();

