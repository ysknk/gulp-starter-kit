'use strict';

import gulp from 'gulp';
// import gulpLoadPlugins from 'gulp-load-plugins';

import { Transform } from 'stream';
import spawn from 'cross-spawn';

import fs from 'fs-extra';
import path from 'path';
// import del from 'del';
import { deleteSync } from 'del';

import notifier from 'node-notifier';

import pluginError from 'plugin-error';

import bs from 'browser-sync';
import minimist from 'minimist';

import _ from 'lodash';

import util from './gulpfiles/util.js';
import vars from './gulpfiles/vars.js';

import clean from './gulpfiles/plugins/clean/index.js';
import empty from './gulpfiles/plugins/empty/index.js';
import log from './gulpfiles/plugins/log/index.js';
import useful from './gulpfiles/plugins/useful/index.js';
import pug from './gulpfiles/plugins/pug/index.js';
import pugInheritance from './gulpfiles/plugins/pug-inheritance/index.js';

// @use img
import imageminPngquant from 'imagemin-pngquant';
import imageminOptipng from 'imagemin-optipng';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

import { fileURLToPath } from 'url';

// gulp
import autoprefixer from 'gulp-autoprefixer';
import cached from  'gulp-cached';
import changed from  'gulp-changed';
import cleanCss from  'gulp-clean-css';
import csscomb from  'gulp-csscomb';
import csslint from  'gulp-csslint';
import data from  'gulp-data';
import debug from  'gulp-debug';
import eslint from  'gulp-eslint';
import filter from  'gulp-filter';
import htmlhint from  'gulp-htmlhint';
import gulpif from  'gulp-if';
import imagemin from  'gulp-imagemin';
import minifyHtml from  'gulp-minify-html';
import plumber from  'gulp-plumber';
import rename from  'gulp-rename';
import size from  'gulp-size';
import stylus from  'gulp-stylus';

// @use css
import nib from 'nib';

// @use js
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main () {
  const local = await import(`../${vars.path.varsLocal}`)
    .catch(() => {
      return {}
    });

  /**
   * set const variables
   */
  const define = util.isFileExists(vars.path.varsLocal)
    ? _.merge({}, vars, local)
    : vars;

  const browserSync = bs.create();

  // const $ = gulpLoadPlugins({ config: path.resolve(__dirname, 'package.json') });

  const argv = minimist(process.argv.slice(2));

  const gulpfile = 'gulpfiles';

  // please not overwrite variables
  const globalVars = {
    gulp,

    spawn,
    fs,
    path,
    // del,
    deleteSync,

    notifier,
    Transform,

    pluginError,

    browserSync,
    argv,

    define,
    $: {
      autoprefixer,
      cached,
      changed,
      cleanCss,
      csscomb,
      csslint,
      data,
      debug,
      eslint,
      filter,
      htmlhint,
      if: gulpif,
      imagemin,
      minifyHtml,
      plumber,
      rename,
      size,
      stylus,
    },
    _,

    plugins: {
      util,
      clean,
      empty,
      log,
      useful,
      pug,
      pugInheritance,
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

  const globalconf = await import(define.path.taskConfigGlobal)
    .catch(() => {
      return {}
    });
  const localconf = await import(define.path.taskConfigLocal)
    .catch(() => {
      return {}
    });

  // [{}, base, local] config merge
  plugins.util.setGlobalVars(define.ns, _.merge({},
    globalconf.default,
    localconf.default
  ));

  /**
   * read below the tasks directory
   */
  plugins.util.setImportDir([
    plugins.util.getReplaceDir(process.cwd()),
    gulpfile,
    define.path.tasksDir
  ].join('/'));

  plugins.util.setImportDir(plugins.util.getReplaceDir(path.resolve([
    define.path.config,
    define.path.tasksDir
  ].join('')) + '/'));

  /**
   * set all common tasks
   * gulp, gulp build, gulp watch...
   */
  const taskMaster = await import(define.path.taskMaster)
    .catch(() => {
      return {}
    });
  const gulpTasks = gulp._registry._tasks;
  const dTaskName = define.task.name;
  const configBuildName = `${dTaskName.config}${define.task.separator}${dTaskName.build}`
  const configsBuildName = `${dTaskName.config}s${define.task.separator}${dTaskName.build}`
  const types = {};
  const taskmaster = new taskMaster.default();
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
}
await main();
