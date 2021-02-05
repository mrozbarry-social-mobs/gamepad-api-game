import http from 'http';
import process from 'process';
import WebSocket from 'ws';
import websocketApp from './app.js';

const port = 8080;

const server = http.createServer();
const websocketServer = websocketApp(new WebSocket.Server({ server }));

server.on('close', () => {
  websocketServer.close();
  process.exit(0);
});

server.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
