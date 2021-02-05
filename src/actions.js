import { effects } from 'ferp';

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
