'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import requireDir from 'require-dir';

import stream from 'stream';
import spawn from 'cross-spawn';

import fs from 'fs-extra';
import path from 'path';
import del from 'del';

import notifier from 'node-notifier';

import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import pluginError from 'plugin-error';
import replaceExt from 'replace-ext';

import bs from 'browser-sync';
import minimist from 'minimist';

import _ from 'lodash';

import util from './util';

import empty from './plugins/empty/';
import log from './plugins/log/';
import useful from './plugins/useful/';

import nib from 'nib';
import autoprefixer from 'autoprefixer-stylus';
import import_tree from 'stylus-import-tree';

import pngquant from 'imagemin-pngquant';
import mozjpeg from 'imagemin-mozjpeg';

import licenseInfoWebpackPlugin from 'license-info-webpack-plugin';

/**
 * set const variables
 */
const {Transform} = stream;

const browserSync = bs.create();

const gulpfile = 'gulpfile.babel.js';

const $ = gulpLoadPlugins();

const argv = minimist(process.argv.slice(2));

const tasksDir = 'tasks/';

const srcDir = '../_src/';
const destDir = '../html/';

const define = {
  ns: '__', // namespace

  path: {
    config: srcDir + 'config/',
    htdocs: srcDir + 'htdocs/',

    src: (ext) => {
      return [
        srcDir + 'htdocs/**/*.' + ext
      ];
    },
    ignore: (ext) => {
      ext = ext ? ('.' + ext) : '';
      return [
        'htdocs/**/_*',
        'htdocs/**/_**/**/*'
      ].map((val) => {
        return srcDir + val + ext;
      });
    },
    dest: destDir
  }
};

// please not overwrite variables
const globalVars = {
  gulp,

  fs,
  path,
  del,

  notifier,
  Transform,

  requireDir,
  fancyLog,
  colors,
  pluginError,
  replaceExt,

  browserSync,
  argv,

  define,
  $,
  _,

  nib,
  autoprefixer,
  import_tree,

  pngquant,
  mozjpeg,

  licenseInfoWebpackPlugin,

  plugins: {
    util,
    empty,
    log,
    useful
  }
};

/**
 * set global variables
 */
_.each(globalVars, (obj, key) => {
  util.setGlobalVars(key, obj);
});

/**
 * set tasks variables
 */
let taskfile = 'task/config.js';

let baseConfigPath = [
  '.',
  gulpfile,
  taskfile
].join('/');

let localConfigPath = [
  define.path.config, taskfile
].join('');

let configBody = 'module.exports \= \{\};';

if(!plugins.util.checkFile(baseConfigPath)) {
  plugins.util.createFile(baseConfigPath, configBody);
}

if(!plugins.util.checkFile(localConfigPath)) {
  plugins.util.createFile(localConfigPath, configBody);
}

// [{}, base, local] config merge
plugins.util.setGlobalVars(define.ns, _.merge({},
  require('./' + taskfile),
  require('../' + define.path.config + taskfile)
));

/**
 * read below the tasks directory
 */
plugins.util.setRequireDir([
  plugins.util.getReplaceDir(process.cwd()),
  gulpfile,
  tasksDir
].join('/'));

plugins.util.setRequireDir(plugins.util.getReplaceDir(path.resolve([
  define.path.config,
  tasksDir
].join('')) + '/'));

/**
 * set all common tasks
 * gulp, gulp build, gulp watch...
 */
let taskMaster = require('./task/master');
let tasks = gulp._registry._tasks;
let defaultName = 'default';
let emptyName = 'empty';
let types = {};
let taskmaster = new taskMaster();
let isServ = taskmaster.isTask('serv');

// empty
gulp.task(emptyName, (done) => {done();});

// build, watch
_.each(tasks, (task, name) => {
  let split = name.split(':');
  let taskname = split[0];
  let type = split.length > 1 ? split[1] : defaultName;

  if(!types[type]) types[type] = [];
  types[type].push(name);
});

_.each(types, (array, key) => {
  if(key === 'watch' || key === defaultName) {

    if(key === defaultName) key = 'start';

    gulp.task(key, gulp.series(isServ ? 'serv' : emptyName, function all() {
      let config = global[define.ns];
      plugins.util.setIsWatch(true);

      _.each(array, (string) => {
        let split = string.split(':');
        let taskname = split[0];
        let serv = 'serv:' + (config[taskname] && config[taskname].serv || 'reload');
        let src = config[taskname] && taskmaster.getSrc(config[taskname].src);

        if(taskname === 'serv' || taskname === emptyName) return;

        if(config && config[taskname]) {
          let watcher = gulp.watch(src, gulp.series(taskname, isServ ? serv : emptyName));
          taskmaster.setDeleteWatcher(watcher, config[taskname]);
        }
      });
    }));

    // gulp restart
    if(key === 'start') {
      gulp.task(defaultName, () => {
        let startProcess;
        let param = plugins.util.getParam();

        function restart() {
          let watchSrc = [
            './' + gulpfile + '/**/*',
            define.path.config,
            '!' + define.path.config + 'node_modules/'
          ];
          gulp.watch(watchSrc, gulp.series(restart));

          if(startProcess) startProcess.kill();

          let gulpName = plugins.util.isWin() ?
            'gulp.cmd' : 'gulp';

          startProcess = spawn(gulpName, [key, ...param], {
            stdio: 'inherit'
          }).on('error', (err) => {throw err;});
        }
        restart();
      });
    }

  }else{
    gulp.task(key, gulp.parallel.apply(gulp, array));
  }
});

