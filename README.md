Gulp Starter Kit
====

website build tools.  
use submodule add.  

## Description

* Pug -> html
* Stylus(+nib) -> css
* js(webpack+Babel) -> js
* img(imagemin) -> img
* other(copy) -> other

## Requirement

* Node.js
* gulp.js(npm global install)

## Install

    git submodule add [this_repo_url] _app
    cd _app/
    npm i

### Directory before installation

    [root]
      |-[_app]

### Directory after installation

    [root]
      |-[_app]
      |-[_src]
      |-[html]

## Usage

### npm Command

    cd _app/
    npm run watch
    npm run build
    .
    .
    .

### Gulp Command

    cd _app/
    gulp
    gulp build
    gulp watch
    gulp lint
    gulp [html|css|js|img]
    gulp [html|css|js|img]:build
    gulp [html|css|js|img]:watch
    .
    .
    .

#### Check other tasks.

    gulp --tasks

### Config

    [root]
      |-[_src/]
          |-[config/]
              |-[task/] task config (master_data: /gulpfile.babel.js/task/config.js)
              |-[tasks/] original task
              |-[page.js] pug, styl variables

## License

Licensed under MIT  
Copyright (c) 2018 [ysknk](https://github.com/ysknk)  

## Author

[ysknk](https://github.com/ysknk)

