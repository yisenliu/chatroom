import './style.sass';

const html = document.documentElement;
export default class SlidePage {
  constructor(id) {
    this.container = document.getElementById(id);
    const back = this.container.querySelector('.slidePage-head-left');
    this.body = this.container.querySelector('.slidePage-body');

    back.addEventListener('click', this.close.bind(this));
  }
  open() {
    this.container.classList.add('active');
    html.classList.add('slidePage--open');
  }
  close() {
    this.container.classList.remove('active');
    html.classList.remove('slidePage--open');
  }
}
