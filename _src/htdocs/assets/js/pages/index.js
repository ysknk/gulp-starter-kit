((win, doc) => {
  'use strict';

  const FN = win[NS];
  const PAGE_NAME = `${PREFIX}index-page`;

  function isCurrentPage() {
    let bodyElem = doc.body;
    return bodyElem.classList.contains(PAGE_NAME);
  }

  function initialize() {}

  doc.addEventListener('DOMContentLoaded', (e) => {
    if (!isCurrentPage()) return;
    initialize();
  }, false);

})(window, document);

