import circle from './circle.js';

export default ({ self: { x, y }, config }) => [
  circle({
    x,
    y,
    radius: config.player.range,
    fillStyle: 'rgba(222, 224, 64, 0.3)',
  }),
];
