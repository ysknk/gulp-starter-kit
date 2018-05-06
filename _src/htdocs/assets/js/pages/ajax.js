'use strict';

((win, doc) => {

  // common settings please to common.js
  $.fn.ajax.onSuccess = (resolve, reject, responce, that) => {
    console.log('common:', responce);
    console.log(this, that);
    return resolve();
  };

  // local settings
  let html = document.querySelector('html');

  $.fn.ajax.set(html, {
    url: 'https://httpbin.org/get'
  }, {
    onSuccess: (resolve, reject, responce, that) => {
      console.log(responce);
      console.log(this, that);
      return resolve();
    },
    onFailure: (resolve, reject, error, that) => {
      console.log(error);
      console.log(this, that);
      return resolve();
    }
  });

})(window, document);
