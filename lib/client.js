import ExternalPromise from './externalPromise.js';

class Client {
  constructor(websocket) {
    this.websocket = websocket;
    this.latency = 0;
    this.id = null;
    this.data = {};
    this.friends = [];
    this.events = [];

    this._onMessage = this._onMessage.bind(this);

    this.subscribe();
  }

  _onMessage(event) {
    const data = JSON.parse(event.data.toString());
    const { id, data: payload } = data.data;

    switch (data.type) {
      case 'YOU': {
        this.id = id;
        this.data = payload;
        return;
      }

      case 'SHARE': {
        const friendId = this.friends.findId((f) => f.is === payload.id);
        if (friendId === -1) {
          return;
        }

        this.friends[friendId] = payload;
        return;
      }

      case 'JOIN': {
        this.friends.push(payload);
        this.events.push(data);
      }

      case 'LEAVE': {
        const friendId = this.friends.findId((f) => f.is === payload.id);
        if (friendId === -1) {
          return;
        }
        this.friends.splice(friendId, 1);
        this.events.push(data);
      }
    }
  }

  subscribe() {
    this.websocket.addEventListener('message', this._onMessage);
  }

  unsubscribe() {
    this.websocket.removeEventListener('message', this._onMessage);
  }

  join(name) {
    this.send('JOIN', name);
  }

  leave() {
    this.send('LEAVE');
  }

  update(dataToMerge) {
    this.data = { ...this.data, ...dataToMerge };
    this.send('SHARE', this.data);
  }

  send(type, data = null) {
    const dataObject = data ? { data } : {};
    this.websocket.send(JSON.stringify({
      type,
      ...dataObject,
      timestamp: Date.now(),
    }));
  }
}

export default (host) => {
  const websocket = new WebSocket(host);

  const connection = new ExternalPromise();

  const onConnectionError = (err) => {
    connection.reject(err);
  };
  const onConnectionOpen = () => {
    connection.resolve();
    websocket.removeEventListener('error', onConnectionError);
  };

  websocket.addEventListener('open', onConnectionOpen, { once: true });
  websocket.addEventListener('error', onConnectionError, { once: true });

  return connection.promise()
    .then(() => new Client(websocket))
};
