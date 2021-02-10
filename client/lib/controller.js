import Input from './input.js';
import dig from './dig.js';

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

export default class Controller extends Input {
  constructor(gamepad) {
    super()
    this.gamepad = serializeGamepad(gamepad);
    this.extendListeners({
      'joystick.left': [],
      'joystick.right': [],
      'buttons': [],
      'button.down': [],
      'button.up': [],
      'bumpers': [],
      'triggers': [],
      'change': [],
    });

    this.mapping = {
      'axes.0': (value) => { this.horizontal = value; },
      'axes.1': (value) => { this.vertical = value; },
    };
  }

  update() {
    const gamepads = window.navigator.getGamepads();
    const gamepad = gamepads.find(pad => pad.id === this.gamepad.id && pad.index === this.gamepad.index);

    const nextGamepad = serializeGamepad(gamepad);
    if (nextGamepad.timestamp === this.gamepad.timestamp) return;

    this._updateAnyChange(gamepad, nextGamepad);
    this._updateJoystick([0, 1], 'joystick.left', gamepad, nextGamepad);
    this._updateJoystick([2, 3], 'joystick.right', gamepad, nextGamepad);
    this._updateSpecialButtons([8, 9], 'triggers', gamepad, nextGamepad);
    this._updateSpecialButtons([7, 8], 'bumpers', gamepad, nextGamepad);
    this._updateButtons(gamepad, nextGamepad);
    this._updateButtonsByState(gamepad, nextGamepad);

    this._handleMappings(nextGamepad);

    this.gamepad = nextGamepad;
  }

  _handleMappings(gamepad) {
    Object.keys(this.mapping).forEach((key) => {
      this.mapping[key](dig(gamepad, key.split('.'), 0));
    });
  }

  _updateAnyChange(gamepad, nextGamepad) {
    this._trigger('change', gamepad, nextGamepad);
  }

  _updateJoystick(indexes, eventName, gamepad, nextGamepad) {
    const diff = indexes.some((index) => (
      dig(this.gamepad, `axes.${index}`, 0) !== dig(nextGamepad, `axes.${index}`, 0)
    ));
    if (!diff) return;

    this._trigger(eventName, gamepad, {
      x: nextGamepad.axes[indexes[0]],
      y: nextGamepad.axes[indexes[1]],
    });
  }

  _updateSpecialButtons(indexes, eventName, gamepad, nextGamepad) {
    const diff = indexes.some((index) => (
      dig(this.gamepad, `buttons.${index}.value`, 0) !== dig(nextGamepad, `buttons.${index}.value`, 0)
    ));
    if (!diff) return;

    this._trigger(eventName, gamepad, {
      left: dig(nextGamepad, `buttons.${indexes[0]}`, { value: 0, touched: false, pressed: false }),
      right: dig(nextGamepad, `buttons.${indexes[1]}`, { value: 0, touched: false, pressed: false }),
    });
  }

  _updateButtons(gamepad, nextGamepad) {
    const diff = nextGamepad.buttons.some((button, index) => (
      dig(button, 'value', 0) !== dig(this.gamepad, `buttons.${index}.value`, 0)
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
