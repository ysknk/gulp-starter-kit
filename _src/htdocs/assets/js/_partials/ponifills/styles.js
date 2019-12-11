export default ((win, doc) => {

  if (!Element.prototype.styles) {
    Element.prototype.styles = function(attrs) {
      Object.keys(attrs).forEach((attr) => {
        this.style[attr] = attrs[attr];
      });
    };
  }

})(window, document);
