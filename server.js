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
  socket.on('disconnect', () => {
    console.log(`${username} disconnected`);
  });
  socket.on('hello', username => {
    socket.emit('message', `Hello, ${username}`);
  });
  socket.on('message', data => {
    console.log({ id: socket.id, username, data });
    socket.emit('message', `文字訊息： ${data}`);
  });
  socket.on('upload', (data, filetype) => {
    console.log({ id: socket.id, username, data });
    socket.emit('message', `收到 ${data.length} ${filetype}`);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
