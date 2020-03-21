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

import webpack from 'webpack';
import licenseInfoWebpackPlugin from 'license-info-webpack-plugin';

import imageminPngquant from 'imagemin-pngquant';
import imageminOptipng from 'imagemin-optipng';
// import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

import nib from 'nib';

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
const destDir = '../htdocs/';

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

  webpack,
  licenseInfoWebpackPlugin,

  imageminPngquant,
  imageminOptipng,
  // imageminJpegtran,
  imageminMozjpeg,
  imageminGifsicle,
  imageminSvgo,

  nib,

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
let gulpTasks = gulp._registry._tasks;
let defaultName = 'default';
let watchName = 'watch';
let configBuildName = `config:build`
let servName = plugins.util.getServName();
let emptyName = plugins.util.getEmptyName();
let taskSeparator = `:`;
let types = {};
let taskmaster = new taskMaster();
let isServ = taskmaster.isTask(servName);
let beforeTask = isServ ? servName : emptyName;

// empty
gulp.task(emptyName, (done) => {done();});

// task type sepalate ex: build, watch
_.forEach(gulpTasks, (task) => {
  let split = task.displayName.split(taskSeparator);
  let type = split && split.length > 1 ? split[1] : defaultName;

  if (!types[type]) types[type] = [];
  types[type].push(task.displayName);
});

// task set
_.forEach(types, (tasks, taskName) => {
  if (taskName === watchName || taskName === defaultName) {
    // gulp watch || gulp
    gulp.task(taskName, gulp.series(beforeTask, function all() {
      plugins.util.setIsWatch(true);

      _.forEach(tasks, (task) => {
        let split = task.split(taskSeparator);
        let taskname = split[0];
        let watchTaskName = `${taskname}${taskSeparator}${watchName}`;

        if (types[watchName].indexOf(watchTaskName) == -1) return;

        let taskconfig = taskmaster.setTaskData({
          name: taskname
        });

        if (!taskconfig) return;

        let src = taskmaster.getSrc(taskconfig.data.src);
        taskmaster.watch(taskconfig, src)

        if (taskconfig.data.is_config_build) {
          gulp.watch(define.path.pageConfig, gulp.series(configBuildName));
        }
      });
    }));

  }else{
    // gulp build
    const includeTasks = tasks.filter(task => task != configBuildName);
    gulp.task(taskName, gulp.parallel.apply(gulp, includeTasks));
  }
});

