'use strict'

const execSync = require('child_process').execSync;
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);

const path = {
  src: './_src/',
  dest: '../_src/',
  config: '../_src/config/'
};
const message = {
  complete: '\ninstall complete!',
  cancel: '\ninstall canceled...',
  skip: '\ninstall skipped...',
  end: '\ninstall.js complete!',
  error: {
    nodejs: '\nplease install nodejs, or upgrade nodejs version.'
  }
};
let inputMark = '> ';
let colors = {
  red: (str)=> {return '\u001b[31m' + str + '\u001b[0m';},
  magenta: (str)=> {return '\u001b[35m' + str + '\u001b[0m';},
  cyan: (str)=> {return '\u001b[36m' + str + '\u001b[0m';}
};
let fs = '';

new Promise((resolve, reject) => {
  return npmInstall(resolve, reject, {
    dir: 'cd',
    exec: 'npm install'
  });
}).then(() => {
  return new Promise((resolve, reject) => {
    fs = require('fs-extra');

    title('base files copy destination directory [' + path.dest + ']');
    console.log([
      'you may be overwriting it.',
      'do you want to overwrite?',
      '',
      '- please input a number.',
      '[1] overwrite or init',
      '[2] copy without overwriting',
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
          // yes(overwrite)
          case '1':
            // copy
            fs.copy(path.src, path.dest, {
              clobber: true
            }, (err) => {
              if(err) {
                console.error(err);
                reject();
              }
              console.log(message.complete);
              resolve();
            });
            break;
          // yes
          case '2':
            fs.copy(path.src, path.dest, {
              clobber: false
            }, (err) => {
              if(err) {
                console.error(err);
                reject();
              }
              console.log(message.complete);
              resolve();
            });
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
      dir: path.config,
      exec: 'cd ' + path.config + ' && ' + 'npm install'
    });
  });
}).then(() => {
  return close();
}).catch(() => {
  return close();
});

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

