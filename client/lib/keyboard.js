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
    window.addEventListener('keyup', this.onKeyUp);
  }

  _onKeyDown(event) {
    if (event.repeat) return;
    const map = defaultKeyMap[event.key];
    if (!map) return;
    this.state.set(() => ({ [defaultKeyMap[map]]: true }));
  }

  _onKeyUp(event) {
    const map = defaultKeyMap[event.key];
    if (map) {
      return this.state.set(() => ({ [defaultKeyMap[map]]: false }));
    }
    switch(event.key) {
      case 'Space':
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
    this.horizontal = Number(this.state.right) - Number(this.state.left)
    this.vertical = Number(this.state.down) - Number(this.state.up)
  }
}
