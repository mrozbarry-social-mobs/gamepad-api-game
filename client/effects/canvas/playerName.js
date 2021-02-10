import text from './text.js';

export default ({ x, y, name, config, isPlayer, isInRange }) => [
  !isPlayer && isInRange && text({
    x,
    y: y - (config.player.size / 2) - 10,
    text: name,
    fillStyle: 'black',
    baseline: 'bottom',
    align: 'center',
  }),
];

