import WebSocket from 'ws';

const makeId = () => Math.random().toString(36).slice(2);

export class Client {
  constructor(socket) {
    this.socket = socket;
    this.name = null;
    this.id = makeId();
    this.latency = 0;
    this.data = {};

    this.touch();
  }

  touch() {
    this.lastActivity = Date.now();
  }

  isConnected() {
    return this.socket
      && this.socket.readyState === WebSocket.OPEN
      && this.name;
  }

  connect(name) {
    this.name = name;
    if (name) {
      this.touch();
      this.send('YOU', this.toJson());
    }
  }

  update(dataToMerge = {}) {
    if (!this.isConnected()) {
      return;
    }
    this.data = { ...this.data, ...dataToMerge };
    this.touch();
  }

  setLatency(timestamp) {
    this.latency = Date.now() - timestamp;
  }

  ack() {
    this.send('ACK', { latency: (Date.now() - timestamp) });
  }

  toJson() {
    return {
      name: this.name,
      data: this.data,
      latency: this.latency,
    };
  }

  send(type, data) {
    this.socket.send(JSON.stringify({
      type,
      data,
    }));
  }
}
