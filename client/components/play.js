import React, { useEffect, useRef } from 'react';
import { render } from 'declarativas';
import canvasRender from './canvas/index.js';
import Controller from '../lib/controller.js';

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

export default (props) => {
  const canvasRef = useRef();

  useEffect(() => {
    let handle = null;
    const context2d = canvasRef.current.getContext('2d');
    let state = {
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
        id: props.game.id,
        name: props.game.name,
        x: props.game.x,
        y: props.game.y,
        color: props.game.color,
      },
      friends: [
        randomFriend(),
        randomFriend(),
        randomFriend(),
        randomFriend(),
        randomFriend(),
      ],
      lastRender: null,
    };

    const controller = new Controller(window.navigator.getGamepads[0]);

    controller.addEventListener('button.down', (event) => {
      console.log(event);
    });


    const setState = (callback) => {
      state = { ...state, ...callback(state) };
      console.log(state.local.bindings);
    };

    const setBinding = key => toggle => {
      setState((s) => ({ local: { ...s.local, bindings: { ...s.local.bindings, [key]: toggle } } }));
    };

    const KeyBinds = {
      'ArrowUp': setBinding('up'),
      'ArrowDown': setBinding('down'),
      'ArrowLeft': setBinding('left'),
      'ArrowRight': setBinding('right'),
    };

    window.addEventListener('keydown', (event) => {
      const keyFunction = KeyBinds[event.key];
      if (!keyFunction) return;

      keyFunction(true);
    });

    window.addEventListener('keyup', (event) => {
      const keyFunction = KeyBinds[event.key];
      if (!keyFunction) return;

      keyFunction(false);
    });


    const tick = (now) => {
      setState((previousState) => {
        const delta = previousState.lastRender
          ? (now - previousState.lastRender) / 1000
          : 0;

        let self = { ...previousState.self };
        let local = { ...previousState.local };

        const gamepads = window.navigator.getGamepads();
        const gamepad = gamepads[0];
        //controller.update(gamepad);
        //const [xDiff, yDiff] = gamepad ? gamepad.axes : [0, 0];
        const xDiff = Number(local.bindings.right) - Number(local.bindings.left);
        const yDiff = Number(local.bindings.down) - Number(local.bindings.up);
        self = {
          ...previousState.self,
          x: previousState.self.x + Number((xDiff * delta * 100).toFixed(2)),
          y: previousState.self.y + Number((yDiff * delta * 100).toFixed(2)),
        };

        if (gamepad && (gamepad.timestamp > local.lastGamepadTimestamp)) {
          // Handle button changes?
          local.lastGamepadTimestamp = gamepad.timestamp;
        }

        render(context2d, canvasRender({
          canvas: canvasRef.current,
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

  console.log('playCanvas.render');

  const { innerWidth, innerHeight } = window;

  return (
    <canvas ref={canvasRef} width={innerWidth} height={innerHeight}>
      Your browser doesn't support canvas, sorry :(
    </canvas>
  );
};

