Gulp Starter Kit
====

website build tools.  
use submodule add or download.  

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

### [_app] submodule add & [.base_src] clone

example submodule
```Shell
git submodule add https://github.com/ysknk/gulp-starter-kit.git _app
git clone -b master https://github.com/ysknk/gulp-starter-src.git .base_src
cd _app/
npm i
```

### Directory before npm installation

    [root/]
      |-[_app/] *submodule or download
      |-[.base_src/] *clone

### Directory after npm installation

    [root/]
      |-[_app/]
      |-X[.base_src/] * delete after install
      |
      |-[_src/]
      |   |-[config/]
      |   |   |-[task.js] *overwrite task config (master_data: /gulpfile.babel.js/task/config.js)
      |   |   |-[page.js] *pug, styl variables
      |   |   |-[tasks/] *original task
      |   |-[htdocs/] *work directory
      |
      |-[htdocs/] *default dest directory

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
npx gulp
# watch target files & server open
npx gulp watch
# watch target files
npx gulp --no
# compile all target files
npx gulp build
# lint all target files
npx gulp lint
# clean all target files
npx gulp clean
# delete dest directory
npx gulp delete

# build target [task] ex) gulp html
npx gulp [html|css|js|img]
# watch target [task] files & server open ex) npx gulp html:watch
npx gulp [html|css|js|img]:watch
# compile all target [task] files
npx gulp [html|css|js|img]:build
# lint all target [task] files
npx gulp [html|css|js|img]:lint
# clean all target [task] files
npx gulp [html|css|js|img]:clean
    .
    .
    .
```

#### Check other tasks.

```Shell
npx gulp --tasks
```

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

