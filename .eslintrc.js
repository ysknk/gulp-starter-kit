module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  // writable || readonly
  "globals": {
    "gulp": "readonly",
    "path": "readonly",
    "argv": "readonly",
    "plugins": "readonly",
    "define": "readonly",
    "fs": "readonly",
    "del": "readonly",
    "notifier": "readonly",
    "Transform": "readonly",
    "pluginError": "readonly",
    "browserSync": "readonly",

    "jQuery": "writable",
    "$": "writable",
    "_": "writable"
  },
  "rules": {
    "no-console": 1,
    "no-alert": 1,
    "default-case": 1
  }
}
