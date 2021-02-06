import React, { useState, useEffect } from 'react';
import withWebsocket from './withWebsocket.js';

const webSocketProtocol = window.location.protocol.startsWith('https')
  ? 'wss:'
  : 'ws:';

const webSocketHost = `${webSocketProtocol}//${window.location.host}`;

export default withWebsocket({
  host: webSocketHost,
})(() => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    color: 'red',
    lastRender: null,
  });

  useEffect(() => {

    let handle = null;

    const tick = (now) => {
      const gamepads = window.navigator.getGamepads();
      setState((previousState) => {
        const delta = previousState.lastRender
          ? (now - previousState.lastRender) / 1000
          : 0;
        const [xDiff, yDiff] = gamepads[0] && gamepads[0].axes || [0, 0];
        const player = {
          x: previousState.x + (xDiff * delta * 100),
          y: previousState.y + (yDiff * delta * 100),
        };
        return {
          ...player,
          lastRender: now,
        };
      });
      handle = requestAnimationFrame(tick);
    };
    // requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(handle);
    };
  }, []);


  return (
    <div>
      <div style={{  
        width: `5px`,
        height: `5px`,
        backgroundColor: 'red',
        position: 'absolute',
        top: `${state.y}px`,
        left: `${state.x}px`,
      }} />
      <code>{JSON.stringify(state, null, 2)}</code>
    </div>
  );
});
