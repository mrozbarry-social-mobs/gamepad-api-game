import { render } from 'declarativas';

import smallState from '../lib/smallState.js';
import Controller from '../lib/controller.js';
import canvasRender from './canvas/index.js';
import Keyboard from '../lib/keyboard.js';

const random8BitHex = () => {
  const bits = Math.floor(Math.random() * 256);
  return bits.toString(16).padStart(2, '0');
};

const randomFriend = () => {
  const id = Math.random().toString(36).slice(2);

  return {
    id,
    name: id,
    x: (Math.random() * 1000),
    y: (Math.random() * 1000),
    color: '#' + random8BitHex() + random8BitHex() + random8BitHex(),
  };
};

export default (init) => {
  let handle = null;
  const context2d = init.canvasRef.current.getContext('2d');
  const state = smallState({
    config: {
      player: {
        size: 48,
        range: 128,
      },
    },
    local: {
      lastGamepadTimestamp: null,
      interacting: {
        active: false,
        ids: [],
        messages: [],
      },
      bindings: {
        up: false,
        down: false,
        left: false,
        right: false,
      },
    },
    self: {
      id: init.self.id,
      name: init.self.name,
      x: init.self.x,
      color: init.self.color,
      y: init.self.y,
    },
    friends: [
      randomFriend(),
      randomFriend(),
      randomFriend(),
      randomFriend(),
      randomFriend(),
    ],
    lastRender: null,
  });

  const input = new Keyboard();

  const tick = (now) => {
    state.set((previousState) => {
      const delta = previousState.lastRender
        ? (now - previousState.lastRender) / 1000
        : 0;

      let self = { ...previousState.self };
      let local = { ...previousState.local };

      input.update();
      
      self = {
        ...previousState.self,
        x: previousState.self.x + Number((input.horizontal * delta * 100).toFixed(2)),
        y: previousState.self.y + Number((input.vertical * delta * 100).toFixed(2)),
      };

      if (gamepad && (gamepad.timestamp > local.lastGamepadTimestamp)) {
        // Handle button changes?
        local.lastGamepadTimestamp = gamepad.timestamp;
      }

      render(context2d, canvasRender({
        canvas: init.canvasRef.current,
        friends: previousState.friends,
        self,
        config: previousState.config,
      }));

      return {
        ...previousState,
        self,
        local,
        lastRender: now,
      };
    });
    handle = requestAnimationFrame(tick);
  };
  tick(performance.now());

  const cancel = init.hostSubscribe((message) => {
    switch (message.type) {
      case 'JOIN':
        return state.set((previousState) => {
          return {
            ...previousState,
            friends: previousState.friends.concat(message.payload),
          };
        });

      case 'LEAVE':
        return state.set((previousState) => {
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
        return state.set((previousState) => {
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
}
