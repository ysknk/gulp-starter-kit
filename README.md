Gulp Starter Kit
====

website build tools.  
use submodule add or download.  

> ＊Does not work alone. Require [gulp-starter-src](https://github.com/ysknk/gulp-starter-src). Read `Install`.

## Description

* Pug -> html
* Stylus(+nib) -> css
* webpack(+Babel) -> js
* img(imagemin) -> img
* static

## Requirement

* Node.js(@test v12.19.0)

## Install

### [_app] submodule add & [.base_src] clone

example submodule
```Shell
git submodule add https://github.com/ysknk/gulp-starter-kit.git _app
git clone -b master https://github.com/ysknk/gulp-starter-src.git .base_src
cd _app/
npm i

# oneline: minimum package
git submodule add https://github.com/ysknk/gulp-starter-kit.git _app && git clone -b master https://github.com/ysknk/gulp-starter-src.git .base_src && cd _app/ && npm i

# oneline: full package
git submodule add https://github.com/ysknk/gulp-starter-kit.git _app && git clone -b feature/ysknk https://github.com/ysknk/gulp-starter-src.git .base_src && cd _app/ && npm i
```

### while using it  
Push to the repository you manage.  
If you want to clone a new one,  
use `git clone --recursive ${your repository url}` to download submodules as well.  

### Directory before npm installation

    [root/]
      |-[_app/] *submodule add or download
      |-[.base_src/] *clone or download

### Directory after npm installation

    [root/]
      |-[_app/]
      |-X[.base_src/] * delete after install
      |
      |-[_src/]
      |   |-[config/]
      |   |   |-[task.js] *overwrite task config (master_data: /gulpfile.babel.js/task/config.js)
      |   |   |-[page.js] *variables
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
npm run dev
# compile all target files
npm run generate
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

### Other gulp task

```Shell
cd $(root)/_app/

# build target [task] ex) npx gulp html
npx gulp [html|css|js|img|static]
# watch target [task] files & server open ex) npx gulp html:watch
npx gulp [html|css|js|img|static]:watch
# compile all target [task] files
npx gulp [html|css|js|img|static]:build
# lint all target [task] files
npx gulp [html|css|js|img|static]:lint
# clean all target [task] files
npx gulp [html|css|js|img|static]:clean
    .
    .
    .
```

#### Check all tasks.

```Shell
npx gulp --tasks
```

## License

Licensed under MIT  
Copyright (c) 2018 [ysknk](https://github.com/ysknk)  

## Author

[ysknk](https://github.com/ysknk)

