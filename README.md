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

### submodule add or clone

example submodule
```Shell
git submodule add https://github.com/ysknk/gulp-starter-kit _app
git clone https://github.com/ysknk/gulp-starter-src .base_src
cd _app/
npm i
```

### Directory before npm installation

    [root/]
      |-[_app/] *submodule or clone
      |-[.base_src/] *clone

### Directory after npm installation

    [root/]
      |-[_app/]
      |-[.base_src/]
      |
      |-[_src/]
      |   |-[config/]
      |   |   |-[task/] *overwrite task config (master_data: /gulpfile.babel.js/task/config.js)
      |   |   |-[tasks/] *original task
      |   |   |-[page.js] *pug, styl variables
      |   |-[htdocs/] *work directory
      |
      |-[html/] *default dest directory

## Usage

### npm-scripts

```Shell
cd $(root)/_app/
# watch target files & server open
npm run watch
# watch target files
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
cd $(root)/_app/
# deafult watch
gulp
# watch target files & server open
gulp watch
# watch target files
gulp --no
# compile all target files
gulp build
# lint all target files
gulp lint
# clean all target files
gulp clean
# delete dest directory
gulp delete

# build target [task] ex) gulp html
gulp [html|css|js|img]
# watch target [task] files & server open ex) gulp html:watch
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

#### Custom task

Default Custom tasks

```Shell
cd $(root)/_app

# node-aigis
gulp styleguide
# gulp-iconfont
gulp iconfont
```
___* Gulp command only___

##### Mock API Server

```Shell
# mock api server
cd $(root)/_src/config
npm run jsonserver
```

## License

Licensed under MIT  
Copyright (c) 2018 [ysknk](https://github.com/ysknk)  

## Author

[ysknk](https://github.com/ysknk)

