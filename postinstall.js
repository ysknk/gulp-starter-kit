'use strict'

const execSync = require('child_process').execSync;

const cmd = {
  install: `npm install`,
  build: `gulp build`
};

const dir = {
  src: `./_src/`,
  dest: `../_src/`,
  config: `../_src/config/`
};

const message = {
  postInstallComplete: `\npostinstall complete!\n`,
  copyComplete: `\nfile copy complete!\n`,
  notCopy: `file exists. not copy.\n`,
  error: {
    nodejs: `\nplease install nodejs or upgrade nodejs version.`
  }
};

(function() {
  let inputMark = `> `;
  let colors = {
    red: (str) => {return `\u001b[31m${str}\u001b[0m`;},
    magenta: (str) => {return `\u001b[35m${str}\u001b[0m`;},
    cyan: (str) => {return `\u001b[36m${str}\u001b[0m`;}
  };
  let fs = ``;

  new Promise((resolve, reject) => {
    fs = require('fs-extra');

    title(`base files copy destination directory [${dir.src} => ${dir.dest}]`);

    if (checkFile(fs, dir.dest)) {
      console.log(message.notCopy)
      return resolve();
    }

    return fsCopy({
      clobber: true
    }, resolve, reject);

  }).then(() => {
    title(`${cmd.install} begin. [${dir.config}]`);
    execSync(`cd ${dir.config} && ${cmd.install}`, {stdio:[0,1,2]});
    title(`${cmd.install} end. [${dir.config}]`);
  }).then(() => {
    title(`${cmd.build} begin.`);
    execSync(cmd.build, {stdio:[0,1,2]});
    title(`${cmd.build} end.`);

  }).then(() => {
    console.log(message.postInstallComplete)

  }).catch((e) => {
    console.log(e);
  });

  function checkFile(fs, filepath) {
    if (!fs) return;
    try {
      fs.statSync(filepath);
      return true
    } catch(err) {
      if (err.code === 'ENOENT') {
        return false;
      }
    }
  }

  function title(message, mark = '-', repeat = 30) {
    return console.log([
      colors.magenta(`/*${mark.repeat(repeat)}`),
      colors.magenta('  ' + message),
      colors.magenta(`${mark.repeat(repeat)}*/`),
    ].join('\n'));
  }

  function fsCopy(opt, resolve, reject) {
    fs.copy(dir.src, dir.dest, opt, (err) => {
      if (err) {
        console.error(err);
        reject();
      }
      console.log(message.copyComplete);
      resolve();
    });
  }
})();
