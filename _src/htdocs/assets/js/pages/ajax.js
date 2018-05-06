'use strict';

((win, doc) => {

  // common settings please to common.js
  $.fn.ajax.onBeforeSuccess = (resolve, reject, responce, that) => {
    console.log('before:', responce);
    console.log(this, that);
    return resolve();
  };

  // common settings please to common.js
  $.fn.ajax.onAfterSuccess = (resolve, reject, responce, that) => {
    console.log('after:', responce);
    console.log(this, that);
    return resolve();
  };

  // local settings
  let html = document.querySelector('html');

  $.fn.ajax.set(html, {
    url: 'https://httpbin.org/get'
  }, {
    success: (resolve, reject, responce, that) => {
      console.log(responce);
      console.log(this, that);
      return resolve();
    },
    failure: (resolve, reject, error, that) => {
      console.log(error);
      console.log(this, that);
      return resolve();
    }
  });

})(window, document);
