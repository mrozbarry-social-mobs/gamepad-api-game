import { effects } from 'ferp';
import * as fx from './effects.js';

export const INITIAL_STATE = {
  websocketServer: null,
  clients: [],
};

export const init = (websocketServer) => () => [
  { ...INITIAL_STATE, websocketServer },
  effects.none(),
];

export const clientConnect = (client) => (state) => [
  {
    ...state,
    clients: [...state.clients, client],
  },
];

export const clientDisconnect = (client) => (state) => [
  {
    ...state,
    clients: state.clients.filter((c) => c !== client),
  },
];

export const clientReset = () => (state) => [
  { ...state, clients: [] },
];

export const serverBroadcast = (client, message) => (state) => [
  state,
  fx.websocketBroadcast(
    state.websocketServer,
    client,
    message
  ),
];

export const clientSend = (client, type, payload) => (state) => [
  state,
  fx.websocketSend(client, JSON.stringify({ type, payload })),
];
