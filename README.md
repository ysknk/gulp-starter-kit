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
* gulp.js(npm global install)

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

    [root]
      |-[_app]

### Directory after installation

    [root]
      |-[_app]
      |-[_src]
      |-[html]

## Usage

### npm Command

```Shell
cd _app/
npm run watch
npm run build
    .
    .
    .
```

### Gulp Command

```Shell
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
```

#### Check other tasks.

```Shell
gulp --tasks
```

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

