const define = {
  config: 'config',
  htdocs: 'htdocs'
};

const root = '../';

const srcDir = `${root}_src/`;
const destDir = `${root}${define.htdocs}/`;
const tasksDir = 'tasks/';

const src = (ext) => {
  return [
    `${srcDir}${define.htdocs}/**/*.${ext}`
  ];
};

const ignore = (ext) => {
  ext = ext ? `.${ext}` : '';
  let src = [
    `${define.htdocs}/**/_*`,
    `${define.htdocs}/**/_**/**/*`
  ].map((val) => {
    return `${srcDir}${val}${ext}`;
  });
  src.push(`${srcDir}${define.config}/**/*`);
  return src;
};

const path = {
  srcDir,
  destDir,
  tasksDir,

  config: `${srcDir}${define.config}/`,
  htdocs: `${srcDir}${define.htdocs}/`,

  pageConfig: `${srcDir}${define.config}/page.js`,
  taskMaster:  './task/master',
  taskConfigGlobal: `./task/${define.config}.js`,
  taskConfigLocal: `${root}${srcDir}${define.config}/task.js`,
  varsLocal: `${root}gulpfile.vars.js`,// merge with this file

  src,
  ignore,
  dest: destDir
}

module.exports = {
  ns: '__', // namespace
  path
};
