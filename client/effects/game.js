import { render } from 'declarativas';

import smallState from '../lib/smallState.js';
import canvasRender from './canvas/index.js';

const schedule = (fn) => {
  let handle = requestAnimationFrame(fn);
  return () => cancelAnimationFrame(handle);
};

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

export default ({ input, ...init }) => {
  let cancelSchedule = () => {};
  const context2d = init.canvasRef.current.getContext('2d');
  const state = smallState({
    config: {
      player: {
        size: 48,
        range: 128,
      },
    },
    local: {
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
    camera: {
      x: init.self.x,
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

  const tick = (now) => {
    state.set((previousState) => {
      if (!previousState.lastRender) {
        return { ...previousState, lastRender: now }
      }
      const delta = (now - previousState.lastRender) / 1000;


      let self = { ...previousState.self };
      let local = { ...previousState.local };
      let camera = { ...previousState.camera };

      input.update();
      
      self = {
        ...self,
        x: previousState.self.x + Number((input.horizontal * delta * 100).toFixed(2)),
        y: previousState.self.y + Number((input.vertical * delta * 100).toFixed(2)),
      };

      const camDiffX = delta === 0 ? 0 : (self.x - camera.x) / 70;
      const camDiffY = delta === 0 ? 0 : (self.y - camera.y) / 70;
      camera = {
        ...camera,
        x: Math.abs(camDiffX) < 0.01 ? self.x : camera.x + camDiffX,
        y: Math.abs(camDiffY) < 0.01 ? self.y : camera.y + camDiffY,
      };

      render(context2d, canvasRender({
        canvas: init.canvasRef.current,
        camera: camera,
        friends: previousState.friends,
        self,
        config: previousState.config,
      }));

      return {
        ...previousState,
        self,
        local,
        camera,
        lastRender: now,
      };
    });
    cancelSchedule = schedule(tick);
  };
  cancelSchedule = schedule(tick);

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
    cancelSchedule();
    cancel();
  };
}
