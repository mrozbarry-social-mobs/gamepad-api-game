import React, { useState, useEffect } from 'react';
import withWebsocket from './withWebsocket.js';

const webSocketProtocol = window.location.protocol.startsWith('https')
  ? 'wss:'
  : 'ws:';

const webSocketHost = `${webSocketProtocol}//${window.location.host}`;

export default (props) => {
  const [state, setState] = useState({
    self: {
      id: props.game.id,
      name: props.game.name,
      x: props.game.x,
      y: props.game.y,
      color: props.game.color,
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
          ...previousState.self,
          x: previousState.self.x + Number((xDiff * delta * 100).toFixed(2)),
          y: previousState.self.y + Number((yDiff * delta * 100).toFixed(2)),
        };
        return {
          ...previousState,
          self,
          lastRender: now,
        };
      });
      handle = requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const cancel = props.hostSubscribe((message) => {
      switch (message.type) {
        case 'JOIN':
          return setState((previousState) => {
            return {
              ...previousState,
              friends: previousState.friends.concat(message.payload),
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
    <div style={{ position: 'relative'}}>
      {boxes.map((box) => (
        <div key={box.id} style={{  
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
};

