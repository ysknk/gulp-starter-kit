'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import { Transform } from 'stream';
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
import vars from './vars';

import clean from './plugins/clean/';
import empty from './plugins/empty/';
import log from './plugins/log/';
import useful from './plugins/useful/';

// @use img
import imageminPngquant from 'imagemin-pngquant';
import imageminOptipng from 'imagemin-optipng';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

// @use css
import nib from 'nib';

// @use js
import webpack from 'webpack';

/**
 * set const variables
 */
const define = util.isFileExists(vars.path.varsLocal)
  ? _.merge({}, vars, require(`../${vars.path.varsLocal}`))
  : vars;

const browserSync = bs.create();

const $ = gulpLoadPlugins();

const argv = minimist(process.argv.slice(2));

const gulpfile = 'gulpfile.babel.js';

// please not overwrite variables
const globalVars = {
  gulp,

  spawn,
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
  },

  imageminPngquant,
  imageminOptipng,
  imageminMozjpeg,
  imageminGifsicle,
  imageminSvgo,

  nib,

  webpack,
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
 * read below the tasks directory
 */
plugins.util.setRequireDir([
  plugins.util.getReplaceDir(process.cwd()),
  gulpfile,
  define.path.tasksDir
].join('/'));

plugins.util.setRequireDir(plugins.util.getReplaceDir(path.resolve([
  define.path.config,
  define.path.tasksDir
].join('')) + '/'));

/**
 * set all common tasks
 * gulp, gulp build, gulp watch...
 */
const taskMaster = require(define.path.taskMaster);
const gulpTasks = gulp._registry._tasks;
const dTaskName = define.task.name;
const configBuildName = `${dTaskName.config}${define.task.separator}${dTaskName.build}`
const configsBuildName = `${dTaskName.config}s${define.task.separator}${dTaskName.build}`
const types = {};
const taskmaster = new taskMaster();
const isServ = taskmaster.isTask(dTaskName.serv);
const beforeTask = isServ ? dTaskName.serv : dTaskName.empty;
// const isInitDelete = taskmaster.isInitDelete();
// const initDeleteTask = isInitDelete ? dTaskName.delete : dTaskName.empty;

// empty
gulp.task(dTaskName.empty, (done) => {done();});

// task type sepalate ex: build, watch
_.forEach(gulpTasks, (task) => {
  const split = task.displayName.split(define.task.separator);
  const type = split && split.length > 1 ? split[1] : dTaskName.default;

  if (!types[type]) types[type] = [];
  types[type].push(task.displayName);
});

// task set
_.forEach(types, (tasks, taskName) => {
  if (taskName === dTaskName.watch
    || taskName === dTaskName.default) {
    // gulp watch || gulp
    // gulp.task(taskName, gulp.series(initDeleteTask, beforeTask, function all() {
    gulp.task(taskName, gulp.series(beforeTask, function all() {
      plugins.util.setIsWatch(true);

      tasks.forEach((task) => {
        const split = task.split(define.task.separator);
        const taskname = split[0];
        const watchTaskName = `${taskname}${define.task.separator}${dTaskName.watch}`;

        if (types[dTaskName.watch].indexOf(watchTaskName) == -1) return;

        const taskconfig = taskmaster.setTaskData({
          name: taskname
        });

        if (!taskconfig) return;

        const src = taskmaster.getSrc(taskconfig.data.src);
        taskmaster.watch(taskconfig, src);

        if (taskconfig.data.conf_files && taskconfig.data.conf_files.length) {
          gulp.watch(taskconfig.data.conf_files, gulp.series(configsBuildName));
        }

        if (taskconfig.data.is_config_build) {
          gulp.watch(define.path.pageConfig, gulp.series(configBuildName));
        }
      });
    }));

  }else{
    // gulp build
    const includeTasks = tasks.filter(task => task != configBuildName);
    gulp.task(taskName, gulp.series(
      // initDeleteTask,
      gulp.parallel.apply(gulp, includeTasks)
    ));
  }
});

