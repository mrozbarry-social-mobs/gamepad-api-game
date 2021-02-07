import { c } from 'declarativas';
import preserveState from './preserveState.js';

const _circle = (x, y, radius) => [
  c('beginPath'),
  c('arc', { x, y, radius, startAngle: 0, endAngle: Math.PI * 2 })
];

const strokeCircle = (x, y, radius) => [
  ..._circle(x, y, radius),
  c('stroke'),
];
const fillCircle = (x, y, radius) => [
  ..._circle(x, y, radius),
  c('fill'),
];

export default ({ x = 0, y = 0, radius, strokeStyle, fillStyle, lineWidth }) => preserveState([
  fillStyle && [
    c('fillStyle', { value: fillStyle }),
    fillCircle(x, y, radius),
  ],
  strokeStyle && [
    lineWidth && c('lineWidth', { value: lineWidth }),
    c('strokeStyle', { value: strokeStyle }),
    strokeCircle(x, y, radius),
  ]
]);

