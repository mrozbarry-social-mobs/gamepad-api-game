import translate from './translate.js';

export default ({ camera, canvas }, children) => {
  const halfX = canvas.width / 2;
  const halfY = canvas.height / 2;
  return translate({
    x: halfX - camera.x,
    y: -camera.y + halfY,
  }, children);
};
