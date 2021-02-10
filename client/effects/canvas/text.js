import { c } from 'declarativas';
import preserveState from './preserveState.js';

export default ({ x = 0, y = 0, strokeStyle, fillStyle, lineWidth, align, baseline, ...rest }) => preserveState([
  align && c('textAlign', { value: align }),
  baseline && c('textBaseline', { value: baseline }),
  fillStyle && [
    c('fillStyle', { value: fillStyle }),
    c('fillText', { x, y, text: rest.text }),
  ],
  strokeStyle && [
    lineWidth && c('lineWidth', { value: lineWidth }),
    c('strokeStyle', { value: strokeStyle }),
    c('strokeText', { x, y, text: rest.text }),
  ]
]);

