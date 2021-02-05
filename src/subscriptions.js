import WebSocket from 'ws';

const fx = (method) => (...args) => [method, ...args];

export const clientConnector = fx((websocketServer, onClientConnect, onClose) => (dispatch) => {
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

export const clientMessager = fx((client) => (_dispatch) => {
  const onMessage = (event) => {
    console.log('client message', event);
  };

  client.addEventListener('message', onMessage);

  return () => {
    client.removeEventListener('message', onMessage);
  };
});
