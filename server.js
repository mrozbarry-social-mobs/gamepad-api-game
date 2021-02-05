import * as http from 'http';
import * as ws from 'ws';
import express from 'express';
import Bundler from 'parcel-bundler';
import { promises as fs } from 'fs';
import * as path from 'path';

const app = express();
const server = http.createServer(app);
const webSocketServer = new ws.Server({ server });

const bundler = new Bundler('client/index.html', {});

const LOG_PATH = path.resolve(__dirname, 'logs', 'log.txt');
const log = (...data) => fs.writeFile(
  LOG_PATH,
  data.map((d) => '[' + (new Date()).toString() + '] ' + JSON.stringify(d, null, 2)).join('\n'),
  { encoding: 'utf8', flag: 'as' },
).catch(console.error);

app.use(bundler.middleware());

webSocketServer.on('connection', (socket) => {
  log('client connected');
  socket.on('error', (err) => {
    log('client error', err);
  });
  socket.on('message', (message) => {
    log('client message relay', message);
    webSocketServer.clients.forEach((client) => {
      if (client === socket) return;
      client.send(message);
    });
  });
});

// Listen on port 8080
app.listen(8080);
