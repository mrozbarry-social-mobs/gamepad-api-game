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
      const payload = {
        ...message.payload,
        id: Math.random().toString(36).slice(2),
        x: 0,
        y: 0,
      };
      dispatch(clientSend(client, 'YOU', payload));
      dispatch(serverBroadcast(client, JSON.stringify(payload)));
      return;
    }
    dispatch(serverBroadcast(client, event.data));
  };

  client.addEventListener('message', onMessage);

  return () => {
    client.removeEventListener('message', onMessage);
  };
});
