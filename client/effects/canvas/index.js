import preserveState from './preserveState.js';
import rect from './rect.js';
import scene from './scene.js';
import ui from './ui.js';

export default (props) => {
  return preserveState([
    rect({ width: props.canvas.width, height: props.canvas.height, fillStyle: 'white' }),
    scene(props),
    ui(props),
  ]);
};
