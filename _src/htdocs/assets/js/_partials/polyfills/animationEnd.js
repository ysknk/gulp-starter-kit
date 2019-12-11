export default ((win, doc) => {

  const findProperty = (obj) => {
    const el = document.createElement('div');

    for (let key in obj) {
      if (obj.hasOwnProperty(key) && el.style[key] !== undefined) {
        return obj[key];
      }
    }
  };

  window.transitionEnd = findProperty({
    transition: 'transitionend',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  });

  window.animationEnd = findProperty({
    animation: 'animationend',
    MozAnimation: 'mozAnimationEnd',
    WebkitAnimation: 'webkitAnimationEnd'
  });

})(window, document);

