Element.prototype.domRect = function () {
  const { x, y, width, height, top, right, bottom, left } = this.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    x,
    y,
    width,
    height,
    top,
    right,
    bottom,
    left,
    offsetTop: top + scrollTop,
    offsetLeft: left + scrollLeft,
  };
};
Element.prototype.addClass = function (classNames) {
  const classes = classNames.split(' ');
  classes.forEach(className => {
    this.classList.add(className);
  });
};
Element.prototype.removeClass = function (classNames) {
  const classes = classNames.split(' ');
  classes.forEach(className => {
    this.classList.remove(className);
  });
  if (!this.classList.length) {
    this.removeAttribute('class');
  }
};
Element.prototype.toggleClass = function (className) {
  this.classList.toggle(className);
  if (!this.classList.length) {
    this.removeAttribute('class');
  }
};

// 配合css, .foo:not(.active){display:none;}
Element.prototype.slideToggle = function (speed = 300) {
  if (!this.classList.contains('active')) {
    let height = 0;
    this.classList.add('active');
    this.style.height = 'auto';
    this.style.overflow = 'hidden';
    this.style.transition = `height ${speed}ms ease-in-out`;
    height = this.clientHeight + 'px';
    this.style.height = '0px';

    setTimeout(() => {
      this.style.height = height;
    }, 0);
  } else {
    this.style.height = '0px';
    this.addEventListener(
      'transitionend',
      function () {
        this.classList.remove('active');
        if (this.getAttribute('style').length) {
          this.removeAttribute('style');
        }
      },
      {
        once: true,
      },
    );
  }
};

// run script tags in innerHTML content
/* ----------------------------------------- */
// method 1. (https://codertw.com/%E7%A8%8B%E5%BC%8F%E8%AA%9E%E8%A8%80/685252/)
Element.prototype.html = function (html) {
  const range = document.createRange();
  range.selectNode(this);
  const documentFragment = range.createContextualFragment(html);
  this.replaceChildren();
  this.appendChild(documentFragment);
};

// method 2. (https://www.itdaan.com/tw/355da723cb1416a497dff23766c4e643)
// Element.prototype.html = function (html) {
//   this.innerHTML = html;
//   Array.from(this.querySelectorAll('script')).forEach(function (el) {
//     let newEl = document.createElement('script');
//     Array.from(el.attributes).forEach(function (el) {
//       newEl.setAttribute(el.name, el.value);
//     });
//     newEl.appendChild(document.createTextNode(el.innerHTML));
//     el.parentNode.replaceChild(newEl, el);
//   });
// };

// method 3. 無法執行script (https://gomakethings.com/converting-a-string-into-markup-with-vanilla-js/)
// Element.prototype.html = function (str) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(str, 'text/html');
//   this.replaceChildren();
//   this.prepend(...doc.body.childNodes);
// };
