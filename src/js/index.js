import '@sass/pages/index.sass';
import Chatroom from '@components/chatroom';
import SlidePage from '@components/slidePage';
import Swiper, { Navigation, Pagination, Zoom } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

let myChatroom;
// portal
const user = document.querySelector('.portal input');
const btnStartChat = document.querySelector('.portal button');
function enterChatroom() {
  const username = user.value || 'Guest';
  myChatroom = new Chatroom({ id: 'myChatroom', username });
  myChatroom.connect();
  user.value = '';
}
btnStartChat.addEventListener('click', enterChatroom);
user.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    enterChatroom();
  }
});

const gallerySP = new SlidePage('gallerySP');

// 圖片輪播與下載 (https://swiperjs.com/swiper-api)
let mySwiper = null;
let slideIdx = 0;
const gallerySPBody = gallerySP.body;
const downloadFile = document.querySelector('.downloadFile');
function changeDownloadURL(slideIdx) {
  downloadFile.href = mySwiper.slides[slideIdx].querySelector('img').src;
}
function destroySwiper() {
  mySwiper.destroy();
  mySwiper = null;
}
function createSwiper(elements) {
  const slides = elements.reduce((acc, el) => {
    return (
      acc +
      `
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            ${el.outerHTML}
          </div>
        </div>
      `
    );
  }, '');
  let swiperHtml = `
        <div class="swiper">
          <div class="swiper-wrapper">
            ${slides}
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
      `;

  gallerySPBody.replaceChildren();
  gallerySPBody.insertAdjacentHTML('afterbegin', swiperHtml);
  return new Swiper('.swiper', {
    modules: [Navigation, Pagination, Zoom],
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    on: {
      update(swiper) {
        swiper.slideTo(slideIdx);
      },
      slideChange() {
        changeDownloadURL(this.activeIndex);
      },
    },
    pagination: {
      el: '.swiper-pagination',
    },
    zoom: true,
  });
}

// 點擊預覽圖片打開輪播圖片並由該張圖片開始播放
const chatroomBody = document.querySelector('.chatroom-body');
chatroomBody.addEventListener(
  'click',
  event => {
    if (event.target !== event.currentTarget && event.target.tagName === 'IMG') {
      const target = event.target;
      const mediaElements = Array.from(target.closest('.chatroom-dialog-attachment').children);
      if (mySwiper) {
        destroySwiper();
      }
      mySwiper = createSwiper(mediaElements);
      slideIdx = mediaElements.indexOf(target);
      gallerySP.open();
      mySwiper.update();
      changeDownloadURL(slideIdx);
    }
  },
  false,
);

// app.on('mediaChange', () => console.log(app.device));
