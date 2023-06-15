import './style.sass';
import { io } from 'socket.io-client';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class Chatroom {
  constructor({ id, username }) {
    const closeChatroom = document.querySelector('.chatroom-header-close');
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
    this.msgInput = document.querySelector('.chatroom-footer-msgInput');
    this.chatroom = document.getElementById(id);
    this.body = this.chatroom.querySelector('.chatroom-body');
    this.observer = new MutationObserver(async mutations => {
      const firstAddedNode = mutations[0].addedNodes[0];
      await delay(200);
      scrollToNewMsg(firstAddedNode);
    });
    this.observer.observe(this.body, {
      subtree: true,
      childList: true,
    });

    this.msgInput.addEventListener('keypress', submitTextMsg);
    closeChatroom.addEventListener('click', this.disconnect.bind(this));

    // Create WebSocket connection
    this.socket = io('localhost:3000', {
      query: {
        username,
      },
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
    const imgFiles = Object.values(files).filter(blob => blob.type.includes('image'));
    const videoFiles = Object.values(files).filter(blob => blob.type.includes('video'));
    if (imgFiles.length) {
      let container = document.createElement('div');
      imgFiles.forEach(blob => {
        const img = new Image();

        img.src = URL.createObjectURL(blob);
        container.append(img);
      });
      this.createDialog({ from: 'user', msgType: 'attachment', data: container.children });
      this.socket.emit('upload', imgFiles, 'image');
    }
    if (videoFiles.length) {
      videoFiles.forEach(blob => {
        let container = document.createElement('div');
        const video = document.createElement('video');
        const source = document.createElement('source');

        source.src = window.URL.createObjectURL(blob);
        source.type = blob.type;
        video.controls = true;
        container.appendChild(video).append(source);
        this.createDialog({ from: 'user', msgType: 'attachment', data: container.children });
      });
      this.socket.emit('upload', videoFiles, 'video');
    }
  }
}
