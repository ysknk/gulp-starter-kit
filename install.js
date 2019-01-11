'use strict'

const path = require('path');
const execSync = require('child_process').execSync;
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const isWindows = (process.platform === `win32`);
const remove = isWindows ? 'rd /s /q' : 'rm -rf';

const paramMark = `--`;
const isMock = process.argv && process.argv[2] === `${paramMark}mock`;

const dir = {
  mockSrc: `./_src_mock/`,
  src: `./_src/`,
  dest: `../_src/`,
  config: `../_src/config/`
};
const message = {
  complete: `\ninstall complete!`,
  cancel: `\ninstall canceled...`,
  skip: `\ninstall skipped...`,
  end: `\ninstall.js complete!`,
  error: {
    nodejs: `\nplease install nodejs or upgrade nodejs version.`
  }
};

(function() {
  let inputMark = `> `;
  let colors = {
    red: (str)=> {return `\u001b[31m${str}\u001b[0m`;},
    magenta: (str)=> {return `\u001b[35m${str}\u001b[0m`;},
    cyan: (str)=> {return `\u001b[36m${str}\u001b[0m`;}
  };
  let fs = ``;

  new Promise((resolve, reject) => {
    return npmInstall(resolve, reject, {
      dir: 'cd',
      exec: 'npm install'
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      fs = require('fs-extra');

      title('base files copy destination directory [' + dir.dest + ']');
      console.log([
        'you may be overwriting it.',
        'do you want to overwrite?',
        '',
        '- please input a number.',
        '[1] clean init',
        '[2] copy not overwrite',
        '[*] cancel',
        ''
      ].join('\n'));

      let question = function() {
        rl.question(inputMark, (answer) => {
          if(!answer.trim()) {
            question();
            return;
          }
          switch(answer.trim()) {
            // yes(clean init)
            case '1':
              // clean
              if(checkFile(fs, dir.dest)) {
                execSync(`${remove} ${path.normalize(dir.dest)}`, {stdio:[0,1,2]});
                // console.log(colors.magenta(`clean ${path.normalize(dir.dest)}`));
              }

              // copy
              fsCopy({
                clobber: true
              }, resolve, reject);
              break;
            // yes
            case '2':
              fsCopy({
                clobber: false
              }, resolve, reject);
              break;
            // no
            default:
              console.log(message.cancel);
              resolve();
              break;
          }
        });
      };
      question();
    });
  }).then(() => {
    return new Promise((resolve, reject) => {
      return npmInstall(resolve, reject, {
        dir: dir.config,
        exec: 'cd ' + dir.config + ' && ' + 'npm install'
      });
    });
  }).then(() => {
    return close();
  }).catch(() => {
    return close();
  });

  function checkFile(fs, filepath) {
    if(!fs) return;
    try {
      fs.statSync(filepath);
      return true
    }catch(err) {
      if(err.code === 'ENOENT') {
        return false;
      }
    }
  }

  function title(message, mark = '=', repeat = 30) {
    return console.log([
      '',
      colors.magenta(mark.repeat(repeat)),
      colors.magenta('  ' + message),
      colors.magenta(mark.repeat(repeat)) + '\n'
    ].join('\n'));
  }

  function close() {
    return new Promise((resolve, reject) => {
      console.log(message.end);
      rl.close();
      process.stdin.destroy();
      resolve();
    });
  }

  function fsCopy(opt, resolve, reject) {
    fs.copy(dir.src, dir.dest, opt, (err) => {
      if(err) {
        console.error(err);
        reject();
      }
      if(isMock) {
        fs.copy(dir.mockSrc, dir.dest, {
          clobber: true
        }, (err) => {
          if(err) {
            console.error(err);
            reject();
          }
          console.log(message.complete);
          resolve();
        });
      }else{
        console.log(message.complete);
        resolve();
      }
    });
  }

  function npmInstall(resolve, reject, options) {
    if(!options || !options.exec || !options.dir) return reject();

    title('npm install ? [' + options.dir + ']');
    console.log([
      '- please input a number.',
      '[1] install',
      '[2] skip',
      '[*] cancel(not install)',
      ''
    ].join('\n'));

    let question = function() {
      rl.question(inputMark, (answer) => {
        if(!answer.trim()) {
          question();
          return;
        }
        switch(answer.trim()) {
          // yes
          case '1':
            if(execSync) {
              title('npm install start.', '-');
              execSync(options.exec, {stdio:[0,1,2]});
              title('npm install end.', '-');
            }else{
              console.log(message.error.nodejs);
              reject();
            }
            resolve();
            break;
          // skip
          case '2':
            console.log(message.skip);
            resolve();
            break;
          // no
          default:
            console.log(message.cancel);
            reject();
            break;
        }
      });
    };
    question();
  }
})();
