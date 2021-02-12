import Input from './input.js';
import makeState from './smallState.js';

const defaultKeyMap = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};


export default class Keyboard extends Input {
  constructor() {
    super();

    this.state = makeState({
      up: false,
      left: false,
      down: false,
      right: false,
    });

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    window.addEventListener('keydown', this._onKeyDown) ;
    window.addEventListener('keyup', this._onKeyUp);
  }

  _onKeyDown(event) {
    if (event.repeat) return;
    const map = defaultKeyMap[event.key];
    if (!map) return;
    this.state.set(() => ({ [map]: true }));
  }

  _onKeyUp(event) {
    const key = defaultKeyMap[event.key];
    if (key) {
      return this.state.set(() => ({ [key]: false }));
    }
    switch(event.key) {
      case 'x':
        this._trigger('oninteract', {}, event.timeStamp);
        break;
    }
  }

  detach() {
    super.detach();
    window.removeEventListener('keydown', this._onKeyDown) ;
    window.removeEventListener('keyup', this.onKeyUp);
  }

  update() {
    const state = this.state.get();
    this.horizontal = Number(state.right) - Number(state.left)
    this.vertical = Number(state.down) - Number(state.up)
  }
}
