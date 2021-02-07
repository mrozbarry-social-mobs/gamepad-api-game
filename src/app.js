import { app, effects } from 'ferp';
import * as actions from './actions.js';
import * as sub from './subscriptions.js';

export default (websocketServer) => {
  app({
    init: actions.init(websocketServer)(),
    update: (action, state) => action ? action(state) : [state, effects.none()],
    subscribe: (state) => [
      state.websocketServer && sub.clientConnector(
        state.websocketServer,
        actions.clientConnect,
        actions.clientDisconnect,
        actions.clientReset,
      ),
      ...state.clients.map((client) => sub.clientMessager(
        client,
        actions.serverBroadcast,
        actions.clientSend,
      )),
    ],
  });

  return websocketServer;
};
