((win, doc) => {
  'use strict';

  const FN = win[NS];

  let html = document.querySelector('html');

  FN.ajax.set(html, {
    url: 'https://httpbin.org/get'
  }, {
    onSuccess: (response, that) => {
      console.log(response);
      console.log(this, that);
    },
    onFailure: (error, that) => {
      console.log(error);
      console.log(this, that);
    }
  });

})(window, document);

