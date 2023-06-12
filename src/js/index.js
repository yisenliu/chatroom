import '@sass/pages/index.sass';
import '@assets/static/gallery-1.jpg';
import '@assets/static/gallery-2.jpg';
import '@assets/static/gallery-3.jpg';
import Chatroom from '@components/chatroom';
import SlidePage from '@components/slidePage';
import Swiper, { Navigation, Pagination, Zoom } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

// console.log(process.env.OPENAI_APIKEY);

const chatSP = new SlidePage('chatSP');
const myChatroom = new Chatroom('myChatroom');

// 檔案上傳
const fileUploader = document.getElementById('fileUploader');
fileUploader.addEventListener('change', e => {
  myChatroom.uploadFile(e.target.files);
});

// 圖片輪播與下載 (https://swiperjs.com/swiper-api)
let mySwiper = null;
let slideIdx = 0;
const chatSPBody = chatSP.body;
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

  chatSPBody.replaceChildren();
  chatSPBody.insertAdjacentHTML('afterbegin', swiperHtml);
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
      const self = event.target;
      const mediaElements = Array.from(self.closest('.chatroom-dialog-media').children);
      if (mySwiper) {
        destroySwiper();
      }
      mySwiper = createSwiper(mediaElements);
      slideIdx = mediaElements.indexOf(self);
      chatSP.open();
      mySwiper.update();
      changeDownloadURL(slideIdx);
    }
  },
  false,
);
