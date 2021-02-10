import React, { useEffect, useRef } from 'react';

import gameFx from '../effects/game.js';

export default (props) => {
  const canvasRef = useRef();

  useEffect(() => {
    return gameFx({
      self: props.game,
      canvasRef,
      hostSubscribe: props.hostSubscribe,
    });
  }, []);

  const { innerWidth, innerHeight } = window;

  return (
    <canvas ref={canvasRef} width={innerWidth} height={innerHeight}>
      Your browser doesn't support canvas, sorry :(
    </canvas>
  );
};

