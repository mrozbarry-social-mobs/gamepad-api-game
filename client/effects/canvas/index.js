import preserveState from './preserveState.js';
import rect from './rect.js';
import font from './font.js';
import player from './player.js';
import playerHighlight from './playerHighlight.js';
import playerName from './playerName.js';



export default (props) => {
  const isInRange = (friend) => {
    const xDiff = friend.x - props.self.x;
    const yDiff = friend.y - props.self.y;
    const distance = Math.sqrt(
      (xDiff * xDiff) +
      (yDiff * yDiff)
    );
    return distance <= props.config.player.range;
  };

  return preserveState([
    rect({ width: props.canvas.width, height: props.canvas.height, fillStyle: 'white' }),

    playerHighlight(props),

    props.friends.map((friend) => player({
      ...friend,
      config: props.config,
      isInRange: isInRange(friend),
    })),

    player({ ...props.self, config: props.config, isPlayer: true }),

    font("24px 'Press Start 2P'", [
      props.friends.map((friend) => playerName({
        ...friend,
        config: props.config,
        isInRange: isInRange(friend),
      }))
    ]),
  ]);
};
