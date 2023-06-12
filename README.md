# 一對一聊天室

## Getting Started

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:8000
$ yarn dev

# build for production
$ yarn build
```

## Technology

- Webpack 5
- Tailwind CSS 3 / SASS / PostCSS
- Vanilla Javascript ES6+
- Websocket

## Features

- Websocket 連線，實現雙向即時溝通。
- 支援純文字對話、圖片、影片上傳，其中圖片與影片在上傳後以 blob 呈現在頁面上，無需等待上傳 server 取得 url 即可預覽。
- 使用 MutationObserver 監視對話框節點，一有新增對話，立刻將畫面捲至該處。
- 點擊對話框內的縮圖可直接看大圖，雙擊大圖可縮放，如果是多張圖片，則由對應的大圖開始輪播。
- 可利用 CSS variables 調整 UI 色系

## Browser Support

Mobile Browsers

For detailed explanation on how things work, check out:

- [Webpack](https://webpack.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
