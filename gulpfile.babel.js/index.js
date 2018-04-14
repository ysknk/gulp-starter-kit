'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

import requireDir from 'require-dir';

import fs from 'fs-extra';
import path from 'path';
import del from 'del';

import notifier from 'node-notifier';
import through from 'through2';

import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import pluginError from 'plugin-error';

import bs from 'browser-sync';
import minimist from 'minimist';

import _ from 'lodash';

import util from './util';

/**
 * set const variables
 */
const browserSync = bs.create();

const gulpfile = 'gulpfile.babel.js';

const $ = gulpLoadPlugins();

const argv = minimist(process.argv.slice(2));

const tasksDir = 'tasks/';

const srcDir = '../_src/';
const distDir = '../html/';

const define = {
  ns: '__', // namespace

  path: {
    config: srcDir + 'config/',
    htdocs: srcDir + 'htdocs/',

    src: (extension, type) => {
      return type && type == 'all' ? [
        srcDir + 'htdocs/**/*.' + extension
      ] : [
        srcDir + 'htdocs/**/[^_]*.' + extension,
        '!' + srcDir + 'htdocs/_**/*'
      ];
    },
    dist: distDir
  }
};

// please not overwrite variables
const globalVars = {
  gulp,

  fs,
  path,
  del,

  notifier,
  through,

  requireDir,
  fancyLog,
  colors,
  pluginError,

  browserSync,
  argv,

  define,
  $,
  _,

  plugins: {
    util,
    log: require('./plugins/gulp-log/'),
    useful: require('./plugins/gulp-useful/')
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
let taskfile = 'task.js';

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

plugins.util.setRequireDir([
  define.path.config,
  tasksDir
].join(''));

/**
 * set all common tasks
 * gulp, gulp build, gulp watch...
 */
let taskMaster = require('./taskMaster');
let tasks = gulp._registry._tasks;
let def = 'default';
let types = {};
let taskmaster = new taskMaster()

_.each(tasks, (task, name) => {
  let split = name.split(':');
  let taskname = split[0];
  let type = split.length > 1 ? split[1] : def;

  if(!types[type]) types[type] = [];
  types[type].push(name);
});

_.each(types, (array, key) => {
  if(key === 'watch' || key === def) {
    gulp.task(key, gulp.series('serv', () => {
      let config = global[define.ns];
      plugins.util.setIsWatch(true);

      _.each(array, (string) => {
        let split = string.split(':');
        let taskname = split[0];
        let serv = 'serv:' + (config[taskname].serv || 'reload');

        if(config && config[taskname]) {
          let watcher = gulp.watch(config[taskname].src, gulp.series(taskname, serv));
          taskmaster.setDeleteWatcher(watcher, config[taskname]);
        }
      });
    }));
  }else{
    gulp.task(key, gulp.series.apply(gulp, array));
  }
});

