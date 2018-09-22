((win, doc) => {
  'use strict';

  let html = document.querySelector('html');

  $.fn.ajax.set(html, {
    url: 'https://httpbin.org/get'
  }, {
    onSuccess: (resolve, reject, response, that) => {
      console.log(response);
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

