const fs = require('fs-extra');
const readline = require('readline');

const path = {
  src: './_src/',
  dest: '../_src/'
};

const message = {
  complete: '\nInstall complete!',
  cancel: '\nInstall canceled...'
};

const rli = readline.createInterface(process.stdin, process.stdout);

console.log([
  '\n---- Directory -> ' + path.dest + ' ----',
  'You may be overwriting it.',
  'Do you want to overwrite?',
  '',
  '- Please select a number.',
  '[1] Overwrite or Init',
  '[2] Copy without overwriting',
  '[*] Cancel',
  ''
].join('\n'));

rli.setPrompt('> ');

rli.on('line', function(cmd) {
  // delete space
  cmd = cmd.replace(/\s+/g, '');

  if(!cmd){
    rli.setPrompt('> ');

  // yes
  }else if(cmd.match(/^1$/ig)) {
    // copy
    fs.copy(path.src, path.dest, {
      clobber: true
    }, (err) => {
      if (err) return console.error(err);
      console.log(message.complete);
    });
    rli.close();

  // no
  }else if(cmd.match(/^2$/ig)) {
    // copy
    fs.copy(path.src, path.dest, {
      clobber: false
    }, (err) => {
      if (err) return console.error(err);
      console.log(message.complete);
    });
    rli.close();

  // other
  }else{
    console.log(message.cancel);
    rli.close();
  }
  // rli.prompt();
}).on('close', function () {
  process.stdin.destroy();
});

