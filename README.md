# 一對一聊天室

## Getting Started

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:8000
$ yarn dev

# build for production
$ yarn build

# run websocket server
$ yarn server
```

## Technology

- Webpack 5
- Tailwind CSS 3 / SASS / PostCSS
- Vanilla Javascript ES6+
- socket.io

## Features

- socket.io 連線，實現雙向即時溝通。
- 支援純文字對話、圖片、影片上傳，其中圖片與影片在上傳後以 blob 呈現在頁面上，無需等待上傳 server 取得 url 即可預覽。
- 使用 MutationObserver 監視對話框節點，一有新增對話，立刻將畫面捲至該處。
- 點擊對話框內的縮圖可直接看大圖，雙擊大圖可縮放，如果是多張圖片，則由對應的大圖開始輪播。
- 可利用 CSS variables 調整 UI 色系

## Experience

- 初次使用 socket.io，在 server 端只作簡單設定(紀錄每一筆收到的訊息並作出簡短回覆)；在 client 端主要使用 socket.io 提供的 Client API (on, connect, disconnect, emit) 與 server 溝通，在連線時便將 username 傳給 server，便於 server 配對 id 與 username，設定上還算簡單。
- 由於文字輸入框與上傳檔案的按鈕都有綁定事件，所以在終止連線時必須解除該事件綁定，否則重新連線時將會重覆觸發該事件，尤其是上傳檔案的功能，如果只有指定 'change' 事件而且上傳檔案與前次相同時，將無法觸發該事件，此時可增加 'click' 事件將 input.value 清空。
- 上傳檔案過大常造成頁面無預警刷新與 websocket reconnect，因此將檔案分段上傳給 socket server。(或許可直接透過 API 上傳到其他 server，不用分段。)
- 上傳的圖片最終選擇以 base64 呈現而不使用 createObjectURL() 是因為點擊圖片時仍需要進行輪播，無法使用 revokeObjectURL() 從記憶體中釋放。但影片沒有輪播問題，所以直接使用 createObjectURL 與 revokeObjectURL。

## Browser Support

Mobile Browsers

For detailed explanation on how things work, check out:

- [Webpack](https://webpack.js.org)
- [Tailwind CSS](https://tailwindcss.com)
- [socket.io](https://socket.io)
