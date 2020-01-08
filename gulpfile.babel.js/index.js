'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import stream from 'stream';
import spawn from 'cross-spawn';

import fs from 'fs-extra';
import path from 'path';
import del from 'del';

import notifier from 'node-notifier';

import pluginError from 'plugin-error';

import bs from 'browser-sync';
import minimist from 'minimist';

import _ from 'lodash';

import util from './util';

import clean from './plugins/clean/';
import empty from './plugins/empty/';
import log from './plugins/log/';
import useful from './plugins/useful/';

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
    srcDir,
    destDir,

    config: `${srcDir}config/`,
    htdocs: `${srcDir}htdocs/`,

    pageConfig: `${srcDir}config/page.js`,
    taskConfigGlobal: `./task/config.js`,
    taskConfigLocal: `../${srcDir}config/task.js`,

    src: (ext) => {
      return [
        `${srcDir}htdocs/**/*.${ext}`
      ];
    },
    ignore: (ext) => {
      ext = ext ? `.${ext}` : '';
      let src = [
        'htdocs/**/_*',
        'htdocs/**/_**/**/*'
      ].map((val) => {
        return `${srcDir}${val}${ext}`;
      });
      src.push(`${srcDir}config/**/*`);

      return src;
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

  pluginError,

  browserSync,
  argv,

  define,
  $,
  _,

  plugins: {
    util,
    clean,
    empty,
    log,
    useful
  }
};

/**
 * set global variables
 */
_.forEach(globalVars, (obj, key) => {
  util.setGlobalVars(key, obj);
});

/**
 * set tasks variables
 */

// [{}, base, local] config merge
plugins.util.setGlobalVars(define.ns, _.merge({},
  require(define.path.taskConfigGlobal),
  require(define.path.taskConfigLocal)
));

/**
 * create config file
 */
let configBody = 'module.exports \= \{\};';

if (!plugins.util.checkFile(define.path.taskConfigLocal)) {
  plugins.util.createFile(define.path.taskConfigLocal, configBody);
}

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
let watchName = 'watch';
let servName = plugins.util.getServName();
let emptyName = plugins.util.getEmptyName();
let taskSeparator = `:`;
let types = {};
let taskmaster = new taskMaster();
let isServ = taskmaster.isTask(servName);
let beforeTask = isServ ? servName : emptyName;

// empty
gulp.task(emptyName, (done) => {done();});

// build, watch
_.forEach(tasks, (task, name) => {
  let split = name.split(taskSeparator);
  let type = split && split.length > 1 ? split[1] : defaultName;

  if (!types[type]) types[type] = [];
  types[type].push(name);
});

_.forEach(types, (array, key) => {
  if (key === watchName || key === defaultName) {
    gulp.task(key, gulp.series(beforeTask, function all() {
      let config = global[define.ns];
      plugins.util.setIsWatch(true);

      _.forEach(array, (string) => {
        let split = string.split(taskSeparator);
        let taskname = split[0];
        let watchTaskName = `${taskname}${taskSeparator}${watchName}`;

        if (types[watchName].indexOf(watchTaskName) == -1) return;

        let taskconfig = config[taskname];
        taskconfig = taskconfig && _.merge({},
          config['common'] || {},
          taskconfig || {}
        );

        let src = taskconfig && taskmaster.getSrc(taskconfig.src);

        if (!config || !taskconfig) return;

        if (types[watchName].indexOf(watchTaskName) > -1) {
          let watcher = gulp.watch(src, {
            // awaitWriteFinish: true,
            atomic: 500
          }, gulp.series(taskname));

          taskmaster.setAllWatcher(watcher, taskconfig);
          taskmaster.setDeleteWatcher(watcher, taskconfig);
        }

        // html only
        if (taskname === 'html') {
          gulp.watch(define.path.pageConfig, gulp.series(`config:build`));
        }
      });
    }));

  }else{
    let includeArray = array.filter(task => task != `config:build`);
    gulp.task(key, gulp.parallel.apply(gulp, includeArray));
  }
});

