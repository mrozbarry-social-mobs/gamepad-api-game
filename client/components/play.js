import React, { useState, useEffect, useRef } from 'react';

import gameFx from '../effects/game.js';
import debounce from '../lib/debounce.js';

export default (props) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const canvasRef = useRef();

  useEffect(() => {
    const cancelGame = gameFx({
      input: props.input,
      self: props.game,
      canvasRef,
      hostSubscribe: props.hostSubscribe,
      hostSend: props.hostSend
    });

    const onWindowResize = debounce(() => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 250);

    window.addEventListener('resize', onWindowResize);

    return () => {
      cancelGame();
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} width={windowSize.width} height={windowSize.height}>
      Your browser doesn't support canvas, sorry :(
    </canvas>
  );
};

