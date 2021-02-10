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
  constructor() {
    super();
    // window.addEventListener
  }

  detach() {
    super.detach();
    // window.removeEventListener
  }

}
