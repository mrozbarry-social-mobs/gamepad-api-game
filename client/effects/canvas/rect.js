import { c } from 'declarativas';
import preserveState from './preserveState.js';

export default ({ x = 0, y = 0, width, height, strokeStyle, fillStyle, lineWidth }) => preserveState([
  fillStyle && [
    c('fillStyle', { value: fillStyle }),
    c('fillRect', { x, y, width, height }),
  ],
  strokeStyle && [
    lineWidth && c('lineWidth', { value: lineWidth }),
    c('strokeStyle', { value: strokeStyle }),
    c('strokeRect', { x, y, width, height }),
  ]
]);

