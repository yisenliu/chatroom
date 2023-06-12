const express = require('express');
const port = 3000;
const server = express().listen(port, () => console.log(`[Server] Listening on https://localhost:${port}`));
const SocketServer = require('ws').Server;
const wss = new SocketServer({ server });

// Connection opened
wss.on('connection', (ws, req) => {
  ws.id = req.headers['sec-websocket-key'].substring(0, 8);
  // ws.send(`Client ${ws.id} is connected!`);
  ws.send('Hello!');

  // Listen for messages from client
  ws.on('message', data => {
    console.log(`[Message from client]: ${data}`);
    // Get clients who has connected
    let clients = wss.clients;
    // Use loop for sending messages to each client
    clients.forEach(client => {
      client.send(`${ws.id}: ${data}`);
    });
  });

  // Connection closed
  ws.on('close', () => {
    console.log('[Close connected]');
  });
});
