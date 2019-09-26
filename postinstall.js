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
  postInstallComplete: `postinstall complete!\n`,
  copyComplete: `file copy complete!`,
  notCopy: `file exists. not copy.`
};

(function() {
  let inputMark = `> `;
  let colors = {
    red: (str) => {return `\u001b[31m${str}\u001b[0m`;},
    magenta: (str) => {return `\u001b[35m${str}\u001b[0m`;},
    cyan: (str) => {return `\u001b[36m${str}\u001b[0m`;},
    blue: (str) => {return `\u001b[34m${str}\u001b[0m`;},
    lightBlue: (str) => {return `\u001b[96m${str}\u001b[0m`;},
    lightGreen: (str) => {return `\u001b[92m${str}\u001b[0m`;}
  };
  let theme_color = `lightBlue`;
  let fs = ``;
  let isInitialize = false;

  new Promise((resolve, reject) => {
    fs = require('fs-extra');

    title(`base files copy destination directory begin. [${dir.src} => ${dir.dest}]`);

    if (checkFile(fs, dir.dest)) {
      console.log(message.notCopy)
      title(``, true);
      return resolve();
    }

    isInitialize = true;
    fsCopy({
      clobber: true
    }, () => {
      title(``, true);
    }, resolve, reject);

  }).then(() => {
    title(`${cmd.install} [${dir.config}]`);
    execSync(`cd ${dir.config} && ${cmd.install}`, {stdio:[0,1,2]});
    title(``, true);

  }).then(() => {
    if (isInitialize) {
      title(`${cmd.build}`);
      execSync(cmd.build, {stdio:[0,1,2]});
      title(``, true);
    }

  }).then(() => {
    console.log(colors.lightGreen(message.postInstallComplete));

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

  function title(message, isEnd = false, mark = '-', repeat = 30) {
    return console.log(isEnd
      ? [colors[theme_color](`/*${mark.repeat(repeat - 2)}*/\n`)].join('\n')
      : [
        colors[theme_color](`/*${mark.repeat(repeat)}`),
        colors[theme_color](`  ${message}`),
        colors[theme_color](`${mark.repeat(repeat)}*/${isEnd ? '\n' : ''}`),
      ].join('\n'));
  }

  function fsCopy(opt, callback, resolve, reject) {
    fs.copy(dir.src, dir.dest, opt, (err) => {
      if (err) {
        console.error(err);
        callback && callback();
        reject();
      }
      console.log(message.copyComplete);
      callback && callback();
      resolve();
    });
  }
})();
