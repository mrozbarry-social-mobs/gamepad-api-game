import WebSocket from 'ws';

const fx = (method) => (...args) => [method, ...args];

export const clientConnector = fx((websocketServer, onClientConnect, onClientDisconnect, onClose) => (dispatch) => {
  const onConnection = (client) => {
    dispatch(onClientConnect(client))

    client.on('close', () => {
      dispatch(onClientDisconnect(client));
    });
  };

  websocketServer.on('connection', onConnection);

  return () => {
    websocketServer.off('connection', onConnection);
    dispatch(onClose());
  };
});

export const clientMessager = fx((client, serverBroadcast, clientSend) => (dispatch) => {
  const onMessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'JOIN') {
      dispatch(clientSend(client, 'YOU', {
        ...message.payload,
        id: Math.random().toString(36).slice(2),
        x: Math.random() * 1920,
        y: Math.random() * 1080,
      }));
    }
    dispatch(serverBroadcast(client, message));
  };

  client.addEventListener('message', onMessage);

  return () => {
    client.removeEventListener('message', onMessage);
  };
});
