import { effects } from 'ferp';
import * as WebSocket from 'ws';

export const websocketBroadcast = (
  websocketServer,
  fromClient,
  message,
) => effects.thunk(() => {
  Array.from(websocketServer.clients)
    .filter((client) => client !== fromClient && client.readyState === WebSocket.OPEN)
    .forEach((client) => {
      client.send(message.toString());
    });

  return effects.none();
});

export const websocketSend = (
  client,
  message,
) => effects.thunk(() => {
  client.send(message);

  return effects.none();
});
