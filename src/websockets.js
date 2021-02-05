import WebSocket from 'ws';
import url from 'url';

export default ({ httpServer }) => {
  const wss = new WebSocket.Server({ server: httpServer });

  wss.on('connection', (client, request) => {
    const fullPathName = (new url.URL(request.url)).pathname;
    if (!fullPathName.startsWith(basePath)) {
      client.close();
      return;
    }
    const roomName = fullPathName.slice(basePath.length);
    if (roomName === '/' || !roomName) {
      client.close();
      return;
    }
    rooms[roomName] = rooms[roomName] || [];
    rooms[roomName].push(client);
  });

  return wss;
};
