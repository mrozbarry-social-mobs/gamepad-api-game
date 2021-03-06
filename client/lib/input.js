const defaultListeners = {
  onmove: [],
  oninteract: [],
};

export default class Input {
  constructor() {
    this.listeners = Object.freeze({ ...defaultListeners });

    this.vertical = 0;
    this.horizontal = 0;
  }

  extendListeners(otherListeners) {
    this.listeners = Object.freeze({
      ...this.listeners,
      ...otherListeners,
    });
  }

  update() {}

  detach() {
    Object.keys(this.listeners)
      .forEach((key) => {
        this.listeners[key] = [];
      });
  }

  addEventListener(eventName, callback) {
    this.listeners[eventName].push(callback);
    return () => {
      this.removeEventListener(eventName, callback);
    };
  }

  removeEventListener(eventName, callback) {
    this.listeners[eventName] = this.listeners[eventName]
      .filter((cb) => cb !== callback);
  }

  _trigger(eventName, data, timestamp, extra = {}) {
    const event = {
      ...extra,
      type: eventName,
      parent: this,
      data,
      timestamp,
    };

    this.listeners[eventName].forEach((cb) => cb(event));
  }
}

Input.defaultListeners = Object.freeze(Object.keys(defaultListeners));
