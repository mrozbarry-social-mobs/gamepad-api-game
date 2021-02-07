import http from 'http';
import express from 'express';
import Bundler from 'parcel-bundler';
import process from 'process';
import WebSocket from 'ws';
import path from 'path';
import websocketApp from './app.js';

const host = 'localhost';
const port = 8080;

const app = express();

const server = http.createServer(app);
const websocketServer = websocketApp(new WebSocket.Server({ server }));

const bundler = new Bundler(path.resolve(__dirname, '..', 'client', 'index.html'), {
  autoInstall: false,
  scopeHoist: true,
  detailedReport: true,
});
app.use(bundler.middleware());

server.listen(port, host, () => {
  console.log(`Listening on port http://${host}:${port}`);
});

server.on('close', () => {
  websocketServer.close();
  process.exit(0);
});
