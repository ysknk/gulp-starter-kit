const fs = require('fs-extra');
const readline = require('readline');

let src_dir = './_src/';
let dest_dir = '../_src/';

let message = {
  complete: '\nInstall complete!',
  cancel: '\nInstall canceled...'
};

const rli = readline.createInterface(process.stdin, process.stdout);

console.log([
  '\n---- Directory -> ' + dest_dir + ' ----',
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
    fs.copy(src_dir, dest_dir, {
      clobber: true
    }, (err) => {
      if (err) return console.error(err);
      console.log(message.complete);
    });
    rli.close();

  // no
  }else if(cmd.match(/^2$/ig)) {
    // copy
    fs.copy(src_dir, dest_dir, {
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

