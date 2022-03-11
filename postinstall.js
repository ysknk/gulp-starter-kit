(() => {
  'use strict'

  const fs = require('fs-extra');
  const execSync = require('child_process').execSync;

  const colors = {
    red: (str) => {return `\u001b[31m${str}\u001b[0m`;},
    magenta: (str) => {return `\u001b[35m${str}\u001b[0m`;},
    cyan: (str) => {return `\u001b[36m${str}\u001b[0m`;},
    blue: (str) => {return `\u001b[34m${str}\u001b[0m`;},
    lightBlue: (str) => {return `\u001b[96m${str}\u001b[0m`;},
    lightGreen: (str) => {return `\u001b[92m${str}\u001b[0m`;}
  };
  const theme_color = `lightBlue`;

  let isInitialize = false;

  const message = {
    postInstallComplete: `postinstall complete!\n`,
    copyComplete: `file copy complete!`,
    notCopy: `file exists. not copy.`
  };

  const cmd = {
    install: `npm install`,
    build: `npm run build`
  };

  const dir = {
    root: `../`,
    src: `../.base_src/`,
    dest: `../_src/`,

    gitignore: `.gitignore`
  };

  // _src
  new Promise((resolve, reject) => {
    title(`base files copy. [${dir.src} => ${dir.dest}]`);
    if (checkFile(dir.dest)) {
        console.log(message.notCopy)
        title(``, true);
        resolve();
    } else {
      copyFiles(dir.src, dir.dest, () => {
        isInitialize = true;
        fs.remove(dir.src, (err) => {
          if (err) return console.error(err)
          resolve();
        });
      }, resolve);
    }
  // gitignore
  }).then(() => {
    return new Promise((resolve, reject) => {
      title(`files copy. [${dir.gitignore} => ${dir.root}]`);
      copyFiles(dir.gitignore, `${dir.root}${dir.gitignore}`, resolve, resolve);
    });
  // _src install
  }).then(() => {
    title(`${cmd.install} [${dir.dest}]`);
    execSync(`cd ${dir.dest} && ${cmd.install}`, {stdio:[0,1,2]});
    title(``, true);
  // build
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

  function title(message, isEnd = false, mark = '-', repeat = 30) {
    return console.log(isEnd
      ? [colors[theme_color](`/*${mark.repeat(repeat - 2)}*/\n`)].join('\n')
      : [
        colors[theme_color](`/*${mark.repeat(repeat)}`),
        colors[theme_color](`  ${message}`),
        colors[theme_color](`${mark.repeat(repeat)}*/${isEnd ? '\n' : ''}`),
      ].join('\n'));
  }

  function checkFile(filepath) {
    try {
      fs.statSync(filepath);
      return true
    } catch(err) {
      if (err.code === 'ENOENT') {
        return false;
      }
    }
  }

  function copyFiles(src, dest, cbSuccess, cbFailure) {
    fs.copy(src, dest, {
      overwrite: false,
      errorOnExist: true,
      filter: (path) => {
        let result = !(path.match(/(\.git|\.DS_Store|Thumbs.db)$/i));
        // console.log(colors[theme_color](`${result ? 'copied' : 'skipped'}:`), path);
        return result
      }
    }, (err) => {
      if (err) {
        console.error(err);
        title(``, true);
        return cbFailure && cbFailure();
      }
      console.log(message.copyComplete);
      title(``, true);
      return cbSuccess && cbSuccess();
    });
  }
})();
