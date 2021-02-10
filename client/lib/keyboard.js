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

export default class Controller extends Input {

  keybinds = {
    'ArrowUp': '',
    'ArrowDown': '',
    'ArrowLeft': '',
    'ArrowRight': ''
  }

  constructor() {
    super();

    this.state = {
      up: false,
      left: false,
      down: false,
      right: false,
    };

    // window.addEventListener
    window.addEventListener('keydown', (event) => {
      if (event.repeat) return;

      switch(event.key) {
        case 'ArrowUp':
          this.state.up = true;
          break;

        case 'ArrowDown':
          this.state.down = true;
          break;

        case 'ArrowLeft':
          this.state.left = true;
          break;

        case 'ArrowRight':
          this.state.right = true;
          break;
      }
    }) 

    window.addEventListener('keyup', (event) => {
      switch(event.key) {
        case 'ArrowUp':
          this.state.up = false;
          break;

        case 'ArrowDown':
          this.state.down = false;
          break;

        case 'ArrowLeft':
          this.state.left = false;
          break;

        case 'ArrowRight':
          this.state.right = false;
          break;
      }
    }) 
  }

  detach() {
    super.detach();
    // window.removeEventListener
  }

  update() {
    this.horizontal = Number(this.state.right) - Number(this.state.left)
    this.vertical = Number(this.state.down) - Number(this.state.up)
  }
}
