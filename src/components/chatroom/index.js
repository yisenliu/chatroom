import './style.sass';
import { io } from 'socket.io-client';
import fileType from './fileType';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class Chatroom {
  constructor({ id, username }) {
    const chatroom = document.getElementById(id);
    const fileInput = {
      el: chatroom.querySelector('.chatroom-footer-label input'),
      reset: function () {
        this.value = null;
      },
      upload: event => this.uploadFile(event.target.files),
    };
    const leaveChatroom = document.querySelector('.chatroom-header-close');
    const submitTextMsg = event => {
      const textNode = document.createTextNode(event.target.value);
      if (event.key === 'Enter') {
        this.createDialog({ from: 'user', msgType: 'plaintext', data: textNode });
        this.sendMessage(event.target.value);
        event.target.value = '';
      }
    };
    const scrollToNewMsg = firstAddedNode => {
      this.body.scrollTo({
        top: firstAddedNode.getBoundingClientRect().top + document.documentElement.scrollTop,
        behavior: 'smooth',
      });
    };

    this.chatroom = chatroom;
    this.msgInput = chatroom.querySelector('.chatroom-footer-msgInput');
    this.body = chatroom.querySelector('.chatroom-body');
    this.observer = new MutationObserver(async mutations => {
      const firstAddedNode = mutations[0].addedNodes[0];
      await delay(200);
      scrollToNewMsg(firstAddedNode);
    });

    this.observer.observe(this.body, {
      subtree: true,
      childList: true,
    });

    // 送出文字訊息
    this.msgInput.addEventListener('keypress', submitTextMsg);

    // 離開聊天室
    leaveChatroom.addEventListener('click', this.disconnect.bind(this));

    // 解決上傳的檔案與前次相同時，無法上傳的問題
    fileInput.el.addEventListener('click', fileInput.reset);
    fileInput.el.addEventListener('change', fileInput.upload);

    // 建立 Websocket 連線
    this.socket = io('localhost:3000', {
      query: {
        username,
      },
    });
    this.socket.io.on('reconnect', attempt => {
      console.log(`socket reconnected ${attempt}`);
      this.socket.emit('reconnect', username);
    });
    this.socket.on('connect', () => {
      console.log('socket connected');
      this.chatroom.classList.add('chatroom--connected');
    });
    this.socket.on('disconnect', () => {
      this.observer.disconnect();
      this.chatroom.classList.remove('chatroom--connected');
      this.body.replaceChildren();
      this.chatroom.classList.remove('chatroom--disconnected');
      this.msgInput.removeEventListener('keypress', submitTextMsg);
      fileInput.el.removeEventListener('click', fileInput.reset);
      fileInput.el.removeEventListener('change', fileInput.upload);
      console.log('socket disconnected');
    });
    this.socket.on('connect_error', error => {
      console.error('socket error: ', error);
      this.chatroom.classList.add('chatroom--error');
    });
    this.socket.on('message', data => {
      this.createDialog({ from: 'assistant', msgType: 'plaintext', data });
    });

    this.socket.emit('hello', username);
  }
  connect() {
    this.socket.connect();
  }
  disconnect() {
    this.socket.disconnect();
  }
  createDialog({ from, msgType, data }) {
    const dialog = document.createElement('div');
    const content = document.createElement('div');
    const time = document.createElement('time');

    dialog.className = `chatroom-dialog ${from}`;
    content.className = `chatroom-dialog-${msgType}`;
    time.textContent = new Intl.DateTimeFormat('zh-Hans-CN', {
      timeZone: 'Asia/Taipei',
      timeStyle: 'short',
      dateStyle: 'short',
    }).format(new Date());
    if (msgType === 'plaintext') {
      content.append(data);
    } else {
      content.append(...data);
    }
    this.body.appendChild(dialog).append(content, time);
  }
  sendMessage(message) {
    this.socket.emit('message', message);
  }
  uploadFile(files) {
    const imgFiles = Object.values(files).filter(file => file.type.includes('image'));
    const videoFiles = Object.values(files).filter(file => file.type.includes('video'));

    if (files.length === 0) {
      alert('請選擇檔案');
    } else {
      if (imgFiles.length) {
        const imgMap = imgFiles.map(file => {
          return new Promise((resolve, reject) => {
            const readerBuffer = new FileReader();
            const readerBase64 = new FileReader();
            const segmentSize = 512 * 1024; // 分段上傳，每段512kb
            const totalSegments = Math.ceil(file.size / segmentSize);
            let currentSegment = 0;
            const readNextSegment = () => {
              const start = currentSegment * segmentSize;
              const end = Math.min(start + segmentSize, file.size);
              const fileSegment = file.slice(start, end);
              readerBase64.readAsDataURL(fileSegment);
            };

            readerBuffer.onload = e => {
              const filetype = fileType(e.target.result);
              if (['jpg', 'gif', 'png'].includes(filetype)) {
                readNextSegment();
              } else {
                reject(`${file.name} is invalid.`);
              }
            };
            readerBase64.onload = e => {
              const fileContent = e.target.result;

              currentSegment++;
              this.socket.emit('fileUpload', {
                fileName: file.name,
                fileContent,
                currentSegment,
                totalSegments,
              });
              if (currentSegment === totalSegments) {
                const reader = new FileReader();

                reader.onload = e => {
                  const img = new Image();

                  img.src = e.target.result;
                  resolve(img);
                  this.socket.emit('uploadResult', {
                    success: true,
                    fileName: file.name,
                    fileSize: file.size,
                  });
                };
                reader.readAsDataURL(file);
              } else {
                readNextSegment();
              }
            };
            readerBase64.onerror = () => {
              this.socket.emit('uploadResult', {
                success: false,
                message: `Something wrong on ${file.name}`,
              });
            };
            readerBuffer.readAsArrayBuffer(file);
          });
        });
        Promise.all(imgMap)
          .then(imgs => {
            this.createDialog({ from: 'user', msgType: 'attachment', data: imgs });
          })
          .catch(reason => {
            console.error(reason);
            this.createDialog({ from: 'assistant', msgType: 'plaintext', data: reason });
          });
      }
      if (videoFiles.length) {
        videoFiles.forEach(file => {
          const readerBuffer = new FileReader();
          const readerBase64 = new FileReader();
          const segmentSize = 512 * 1024;
          const totalSegments = Math.ceil(file.size / segmentSize);
          let currentSegment = 0;
          const readNextSegment = () => {
            const start = currentSegment * segmentSize;
            const end = Math.min(start + segmentSize, file.size);
            const fileSegment = file.slice(start, end);
            readerBase64.readAsDataURL(fileSegment);
          };

          readerBuffer.onload = e => {
            const fileContent = e.target.result;
            const filetype = fileType(fileContent);

            if (['mp4', 'ogg'].includes(filetype)) {
              readNextSegment();
            } else {
              this.createDialog({
                from: 'assistant',
                msgType: 'plaintext',
                data: `${file.name} is invalid.`,
              });
            }
          };
          readerBase64.onload = e => {
            const fileContent = e.target.result;

            currentSegment++;
            this.socket.emit('fileUpload', {
              fileName: file.name,
              fileContent,
              currentSegment,
              totalSegments,
            });
            if (currentSegment === totalSegments) {
              const video = document.createElement('video');
              const source = document.createElement('source');

              source.src = URL.createObjectURL(file);
              source.type = file.type;
              video.controls = true;
              video.append(source);
              video.onload = () => URL.revokeObjectURL(source.src);
              this.createDialog({ from: 'user', msgType: 'attachment', data: [video] });
              this.socket.emit('uploadResult', {
                success: true,
                fileName: file.name,
                fileSize: file.size,
              });
            } else {
              readNextSegment();
            }
          };
          readerBase64.onerror = () => {
            this.socket.emit('uploadResult', {
              success: false,
              message: `Something wrong on ${file.name}`,
            });
          };
          readerBuffer.readAsArrayBuffer(file);
        });
      }
    }
  }
}
