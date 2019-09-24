Gulp Starter Kit
====

website build tools.  
use submodule add.  

## Description

* Pug -> html
* Stylus -> css
* js(webpack & Babel) -> js
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

### Command

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

#### check other tasks.

    gulp --tasks

## License

Licensed under MIT  
Copyright (c) 2018 [ysknk](https://github.com/ysknk)  

## Author

[ysknk](https://github.com/ysknk)

