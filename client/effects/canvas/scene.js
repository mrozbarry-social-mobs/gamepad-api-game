import font from './font.js';
import player from './player.js';
import playerHighlight from './playerHighlight.js';
import playerName from './playerName.js';
import camera from './camera.js';

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

  return camera({
    camera: props.camera,
    canvas: props.canvas,
  }, [
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

