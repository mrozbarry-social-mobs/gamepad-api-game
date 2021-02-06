import React, { useState, useEffect } from 'react';
import withWebsocket from './withWebsocket.js';

const webSocketProtocol = window.location.protocol.startsWith('https')
  ? 'wss:'
  : 'ws:';

const webSocketHost = `${webSocketProtocol}//${window.location.host}`;

export default withWebsocket({
  host: webSocketHost,
})((props) => {
  const [state, setState] = useState({
    self: {
      x: 0,
      y: 0,
      color: 'red',
    },
    friends: [],
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
        const self = {
          x: previousState.x + (xDiff * delta * 100),
          y: previousState.y + (yDiff * delta * 100),
        };
        return {
          self,
          lastRender: now,
        };
      });
      handle = requestAnimationFrame(tick);
    };
    // requestAnimationFrame(tick);

    const cancel = props.dataSubscribe((message) => {
      switch (message.type) {
        case 'JOIN':
          return setState((previousState) => {
            return {
              ...previousState,
              friends: previousState.concat(message.payload),
            };
          });

        case 'LEAVE':
          return setState((previousState) => {
            const friends = [...previousState.friends];
            const oldFriend = message.payload;
            const oldFriendIndex = friends.findIndex((f) => f.id === oldFriend.id);

            friends.splice(oldFriendIndex, 1);

            return {
              ...previousState,
              friends,
            };
          });

        case 'SHARE':
          return setState((previousState) => {
            const friends = previousState.map((friend) => {
              return friend.id === message.payload.id
                ? message.payload
                : friend;
            });
            return {
              ...previousState,
              friends
            };
          });
      }
    });

    return () => {
      cancelAnimationFrame(handle);
      cancel();
    };
  }, []);

  const boxes = state.friends.concat(state.self);

  return (
    <div>
      {boxes.map((box) => (
        <div style={{  
          width: `5px`,
          height: `5px`,
          backgroundColor: box.color,
          position: 'absolute',
          top: `${box.y}px`,
          left: `${box.x}px`,
        }} />
      ))}
      <code>{JSON.stringify(state, null, 2)}</code>
    </div>
  );
});
