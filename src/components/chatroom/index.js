import './style.sass';

function scrollToNewMsg(firstAddedNode) {
  window.scrollTo({
    top: firstAddedNode.getBoundingClientRect().top + document.documentElement.scrollTop,
    behavior: 'smooth',
  });
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export default class Chatroom {
  constructor(id) {
    this.chatroom = document.getElementById(id);
    this.body = this.chatroom.querySelector('.chatroom-body');
    const closeChatroom = this.chatroom.querySelector('.chatroom-header-close');
    const msgInput = this.chatroom.querySelector('.chatroom-footer-msgInput');
    const observer = new MutationObserver(async mutations => {
      const firstAddedNode = mutations[0].addedNodes[0];
      await delay(200);
      scrollToNewMsg(firstAddedNode);
    });
    observer.observe(this.body, {
      subtree: true,
      childList: true,
    });

    msgInput.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        const textNode = document.createTextNode(event.target.value);

        this.createDialog({ from: 'user', msgType: 'plaintext', elements: [textNode] });
        event.target.value = '';
      }
    });
    closeChatroom.addEventListener('click', this.disconnect.bind(this));
    this.connect();
  }
  connect() {
    // Create WebSocket connection
    this.ws = new WebSocket('ws://localhost:3000');

    this.ws.onopen = () => {
      console.log('[open connection]');

      // Listen for messages from Server
      this.ws.addEventListener('message', event => {
        console.log(`[Message from server]: %c${event.data}`, 'color: blue');
        this.createDialog({ from: 'assistant', msgType: 'plaintext', elements: [event.data] });
      });
    };
    this.ws.addEventListener('error', event => {
      console.log('WebSocket error: ', event);
      this.chatroom.classList.add('chatroom--error');
    });
  }
  disconnect() {
    this.ws.close();
    this.ws.addEventListener('close', () => console.log('[close connection]'));
    this.chatroom.classList.add('chatroom--disconnected');
  }
  createDialog({ from, msgType, elements }) {
    const msg = document.createElement('div');
    const content = document.createElement('div');
    const time = document.createElement('time');

    msg.className = `chatroom-dialog ${from}`;
    content.className = `chatroom-dialog-${msgType}`;
    time.textContent = new Intl.DateTimeFormat('zh-Hans-CN', {
      timeZone: 'Asia/Taipei',
      timeStyle: 'short',
      dateStyle: 'short',
    }).format(new Date());
    content.append(...elements);
    this.body.appendChild(msg).append(content, time);
    if (from === 'user') {
      this.sendMessage(elements);
    }
  }
  sendMessage(msg) {
    this.ws.send(msg);
  }
  uploadFile(files) {
    const imgFiles = Object.values(files).filter(blob => blob.type.includes('image'));
    const videoFiles = Object.values(files).filter(blob => blob.type.includes('video'));
    const imgContainer = document.createElement('div');
    const videoContainer = document.createElement('div');

    if (imgFiles) {
      imgFiles.forEach(blob => {
        const img = new Image();

        img.src = URL.createObjectURL(blob);
        imgContainer.append(img);
      });

      this.createDialog({
        from: 'user',
        msgType: 'media',
        elements: imgContainer.children,
      });
    }
    if (videoFiles) {
      videoFiles.forEach(blob => {
        const video = document.createElement('video');
        const source = document.createElement('source');

        source.src = window.URL.createObjectURL(blob);
        source.type = blob.type;
        video.controls = true;
        videoContainer.appendChild(video).append(source);
        this.createDialog({
          from: 'user',
          msgType: 'media',
          elements: videoContainer.children,
        });
      });
    }
  }
}
