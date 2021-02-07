import translate from './translate.js';
import rect from './rect.js';

export default ({ x, y, color, config, isPlayer, isInRange }) => translate(
  { x, y },
  [
    rect({
      lineWidth: !isPlayer && isInRange ? 4 : 2,
      strokeStyle: 'black',
      fillStyle: color,
      x: config.player.size / -2,
      y: config.player.size / -2,
      width: config.player.size,
      height: config.player.size,
    }),
  ],
);
