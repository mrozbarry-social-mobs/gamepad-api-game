import * as http from 'http';
import { Server as SocketServer } from 'ws';
import * as express from 'express';
import Bundler from 'parcel-bundler';

const app = express.default();
app.set('trust proxy', true);

const bundler = new Bundler('client/index.html', {});
app.use(bundler.middleware());

const server = http.createServer(app);

const webSocketServer = new SocketServer({ server });
webSocketServer.on('connection', (socket) => {
  const send = (type, payload) => socket.send(JSON.stringify({
    type,
    payload,
    timestamp: Date.now(),
  }));
  socket.on('message', (message) => {
    const json = JSON.parse(message.toString());
    if (json.type === 'JOIN') {
      send('YOU', {
        id: Math.random().toString(36).slice(2),
        name: json.payload.name,
        color: json.payload.color,
        x: Math.random() * 1920,
        y: Math.random() * 1080,
      });
    }
    webSocketServer.clients.forEach((client) => {
      if (client === socket) return;
      client.send(message);
    });
  });
});

// Listen on port 8080
server.listen(8080, () => {
  console.log('listening');
});
