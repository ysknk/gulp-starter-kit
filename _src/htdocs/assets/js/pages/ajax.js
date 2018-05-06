'use strict';

((win, doc) => {

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
