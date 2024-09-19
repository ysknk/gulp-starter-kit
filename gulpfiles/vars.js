const definePath = {
  config: 'config',
  htdocs: 'htdocs'
};

const root = '../';

const gulpfile = 'gulpfiles';
const srcDir = `${root}_src/`;
const destDir = `${root}${definePath.htdocs}/`;
const tasksDir = 'tasks/';

const src = (ext) => {
  return [
    `${srcDir}${definePath.htdocs}/**/*.${ext}`
  ];
};

const ignore = (ext) => {
  ext = ext ? `.${ext}` : '';
  let src = [
    `${definePath.htdocs}/**/_*`,
    `${definePath.htdocs}/**/_**/**/*`
  ].map((val) => {
    return `${srcDir}${val}${ext}`;
  });
  src.push(`${srcDir}${definePath.config}/**/*`);
  return src;
};

const path = {
  srcDir,
  destDir,
  tasksDir,

  config: `${srcDir}${definePath.config}/`,
  htdocs: `${srcDir}${definePath.htdocs}/`,

  pageConfig: `${srcDir}${definePath.config}/page.js`,
  taskMaster:  `./${gulpfile}/task/master.js`,
  taskConfigGlobal: `./${gulpfile}/task/config.js`,
  taskConfigLocal: `${srcDir}${definePath.config}/task.js`,
  varsLocal: `${root}gulpfile.vars.js`,// merge with this file

  src,
  ignore,
  dest: destDir
};

const task = {
  separator: ':',
  name: {
    default: `default`,
    build: `build`,
    watch: `watch`,

    config: `config`,
    serv: `serv`,
    empty: `empty`,
    // delete: `delete`,
    // initDelete: `initDelete`,
  }
};

export default {
  ns: '__', // namespace
  task,
  path
};
