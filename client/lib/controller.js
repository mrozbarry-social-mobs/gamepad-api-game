const emptyGamepad = {
  id: '',
  index: -1,
  connected: false,
  axes: [],
  buttons: [],
  timestamp: 0,
};

const serializeGamepad = (gamepad) => (gamepad ? {
  id: gamepad.id,
  index: gamepad.index,
  connected: gamepad.connected,
  axes: gamepad.axes.map((value) => value),
  buttons: gamepad.buttons.map(({ pressed, touched, value }) => ({ pressed, touched, value })),
  timestamp: gamepad.timestamp,
} : emptyGamepad);

export default class Controller {
  constructor(gamepad) {
    this.gamepad = serializeGamepad(gamepad);
    this.listeners = {
      'joystick.left': [],
      'joystick.right': [],
      'buttons': [],
      'button.down': [],
      'button.up': [],
      'bumpers': [],
      'triggers': [],
      'change': [],
    };
  }

  addEventListener(eventName, callback) {
    this._validateEvent(eventName, () => {
      this.listeners[eventName].push(callback);

      return () => this.removeEventListener(eventName, callback);
    });
  }

  removeEventListener(eventName, callback) {
    this._validateEvent(eventName, () => {
      this.listeners[eventName] = this.listeners[eventName]
        .filter(cb => cb !== callback);
    });
  }

  _validateEvent(eventName, onGood) {
    if (eventName in this.listeners) {
      return onGood();
    }

    console.warn(
      'Controller.*EventListener',
      'Unsupported event name',
      { yourEvent: eventName, supportedEventNames: Object.keys(this.listeners) },
    );
    return () => {};
  }

  update(gamepad) {
    const nextGamepad = serializeGamepad(gamepad);
    if (nextGamepad.timestamp === this.gamepad.timestamp) return;

    this._updateAnyChange(gamepad, nextGamepad);
    this._updateJoystick([0, 1], 'joystick.left', gamepad, nextGamepad);
    this._updateJoystick([2, 3], 'joystick.right', gamepad, nextGamepad);
    this._updateSpecialButtons([8, 9], 'triggers', gamepad, nextGamepad);
    this._updateSpecialButtons([7, 8], 'bumpers', gamepad, nextGamepad);
    this._updateButtons(gamepad, nextGamepad);
    this._updateButtonsByState(gamepad, nextGamepad);

    this.gamepad = nextGamepad;
  }

  _updateAnyChange(gamepad, nextGamepad) {
    this._trigger('change', gamepad, nextGamepad);
  }

  _updateJoystick(indexes, eventName, gamepad, nextGamepad) {
    const diff = indexes.some((index) => this.gamepad.axes[index] !== nextGamepad.axes[index]);
    if (!diff) return;

    this._trigger(eventName, gamepad, {
      x: nextGamepad.axes[indexes[0]],
      y: nextGamepad.axes[indexes[1]],
    });
  }

  _updateSpecialButtons(indexes, eventName, gamepad, nextGamepad) {
    const diff = indexes.some((index) => !this.gamepad.buttons[index] || this.gamepad.buttons[index].value !== nextGamepad.buttons[index].value);
    if (!diff) return;

    this._trigger(eventName, gamepad, {
      left: nextGamepad.buttons[indexes[0]],
      right: nextGamepad.buttons[indexes[1]],
    });
  }

  _updateButtons(gamepad, nextGamepad) {
    const diff = nextGamepad.buttons.some((button, index) => (
      (!this.gamepad.buttons[index] && button.value)
      || (button.value !== this.gamepad.buttons[index].value)
    ));
    if (!diff) return;

    this._trigger('buttons', gamepad, nextGamepad.buttons);
  }

  _updateButtonsByState(gamepad, nextGamepad) {
    nextGamepad.buttons.forEach((nextButton, index) => {
      const button = this.gamepad.buttons[index];
      if (button && button.pressed === nextButton.pressed) return;

      if (button && button.pressed && !nextButton.pressed) {
        return this._trigger('button.up', gamepad, { index, button: nextButton });
      }

      if (nextButton.pressed) {
        return this._trigger('button.down', gamepad, { index, button: nextButton });
      }

    });
  }

  _trigger(eventName, gamepad, data) {
    const event = {
      type: eventName,
      target: gamepad,
      parent: this,
      data,
      timestamp: gamepad.timestamp,
    };

    this.listeners[eventName].forEach((cb) => cb(event));
  }
}
