Gulp Starter Kit
====

website build tools.  
use submodule add or clone.  

## Description

* Pug -> html
* Stylus(+nib) -> css
* js(webpack+Babel) -> js
* img(imagemin) -> img
* other(copy) -> other

## Requirement

* Node.js
* gulp-cli(npm global install)

## Install

### submodule add

```Shell
git submodule add [this_repo_url] _app
cd _app/
npm i
```

### clone

```Shell
git clone [this_repo_url] _app
cd _app/
npm i
```

### Directory before installation

    [root/]
      |-[_app/]

### Directory after installation

    [root/]
      |-[_app/]
      |-[_src/]
      |   |-[config/]
      |   |   |-[task/] *task config (master_data: /gulpfile.babel.js/task/config.js)
      |   |   |-[tasks/] *original task
      |   |   |-[page.js] *pug, styl variables
      |   |-[htdocs/] *work directory
      |-[html/] *default dest directory

## Usage

### npm-scripts

```Shell
cd _app/
# watch target files and server open
npm run watch
# not browser open
npm run watch -- --no
# compile all target files
npm run build
# lint all target files
npm run lint
# clean all target files
npm run clean
# delete dest directory
npm run delete
    .
    .
    .
```

### Gulp command

```Shell
cd _app/
# watch target files and server open
gulp watch
# deafult watch
gulp
# not browser open
gulp --no
# compile all target files
gulp build
# lint all target files
gulp lint
# clean all target files
gulp clean
# delete dest directory
gulp delete
# watch target [task] files and server open
gulp [html|css|js|img]
gulp [html|css|js|img]:watch
# compile all target [task] files
gulp [html|css|js|img]:build
# lint all target [task] files
gulp [html|css|js|img]:lint
# clean all target [task] files
gulp [html|css|js|img]:clean
    .
    .
    .
```

#### Check other tasks.

```Shell
gulp --tasks
```

#### Original task

Default original tasks

```Shell
# node-aigis
gulp styleguide
# gulp-iconfont
gulp iconfont
```
___* Gulp command only___

## License

Licensed under MIT  
Copyright (c) 2018 [ysknk](https://github.com/ysknk)  

## Author

[ysknk](https://github.com/ysknk)

