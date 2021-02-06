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
  socket.on('message', (message) => {
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
