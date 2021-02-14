import font from './font.js';
import text from './text.js';

  
export default (props) => [
  font("24px 'Press Start 2P'", [
    text({
      x: 24,
      y: props.canvas.height - 64,
      text: props.self.name,
      fillStyle: 'black',
    }),
  ]),
  font("16px 'Press Start 2P'", [
    text({
      x: 24,
      y: props.canvas.height - 64 + 24,
      text: `x: ${parseInt(props.self.x)}, y: ${parseInt(props.self.y)}`,
      fillStyle: 'black',
    }),
  ])
];
