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

import childProcess from 'child_process';

/**
 * set const variables
 */
const {spawn} = childProcess;

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

plugins.util.setRequireDir(plugins.util.getReplaceDir(path.resolve([
  define.path.config,
  tasksDir
].join('')) + '/'));

/**
 * set all common tasks
 * gulp, gulp build, gulp watch...
 */
let taskMaster = require('./taskMaster');
let tasks = gulp._registry._tasks;
let def = 'default';
let empty = 'empty';
let types = {};
let taskmaster = new taskMaster();
let isServ = taskmaster.isTask('serv');

gulp.task(empty, (done) => {done();});

_.each(tasks, (task, name) => {
  let split = name.split(':');
  let taskname = split[0];
  let type = split.length > 1 ? split[1] : def;

  if(!types[type]) types[type] = [];
  types[type].push(name);
});

_.each(types, (array, key) => {
  if(key === 'watch' || key === def) {

    if(key === def) key = 'start';

    gulp.task(key, gulp.series(isServ ? 'serv' : empty, function all() {
      let config = global[define.ns];
      plugins.util.setIsWatch(true);

      _.each(array, (string) => {
        let split = string.split(':');
        let taskname = split[0];
        let serv = 'serv:' + (config[taskname] && config[taskname].serv || 'reload');
        let src = config[taskname] && taskmaster.getSrc(config[taskname].src);

        if(taskname === 'serv' || taskname === empty) return;

        if(config && config[taskname]) {
          let watcher = gulp.watch(src, gulp.series(taskname, isServ ? serv : empty));
          taskmaster.setDeleteWatcher(watcher, config[taskname]);
        }
      });
    }));

    // gulp restart
    if(key === 'start') {
      gulp.task(def, () => {
        let startProcess;
        let param = (process.argv && process.argv.slice(2)) || [];

        function restart() {
          gulp.watch([
            './' + gulpfile + '/**/*',
            define.path.config,
            '!' + define.path.config + 'node_modules/'
          ], gulp.series(restart));

          if(startProcess) startProcess.kill();
          startProcess = spawn('gulp', [key, ...param], {stdio: 'inherit'});
        }
        restart();
      });
    }

  }else{
    gulp.task(key, gulp.parallel.apply(gulp, array));
  }
});

