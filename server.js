const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.listen(8000, function () {
  console.log('API listening on *:8000');
});
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/api/messages', function (req, res) {
  let messages = 'hellow world';
  res.send(messages);
});

io.on('connection', socket => {
  const username = socket.handshake.query.username;
  console.log(`${username} connected`);
  socket.on('error', error => {
    console.error('發生錯誤:', error);
    socket.emit('message', error);
  });
  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
  });
  socket.on('hello', username => {
    socket.emit('message', `Hello, ${username}`);
  });
  socket.on('reconnect', username => {
    console.log(`${username} reconnected`);
    socket.emit('message', `Welcome back, ${username}`);
  });
  socket.on('message', data => {
    console.log({ id: socket.id, username, data });
    socket.emit('message', `文字訊息： ${data}`);
  });
  socket.on('fileUpload', ({ fileName, fileContent, currentSegment, totalSegments }) => {
    console.log({ id: socket.id, username, fileName, fileContent, currentSegment, totalSegments });
  });
  socket.on('uploadResult', resultData => {
    console.log({ resultData });
    const { success } = resultData;
    if (success) {
      const { fileName, fileSize } = resultData;
      const sizeKB = Math.floor(fileSize / 1024);
      const sizeMB = Math.floor((fileSize * 100) / (1024 * 1024)) / 100;
      const size = sizeMB > 1 ? sizeMB + 'MB' : sizeKB + 'KB';
      socket.emit('message', `收到檔案： ${fileName}(${size})`);
    } else {
      const { message } = resultData;
      socket.emit('message', message);
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
