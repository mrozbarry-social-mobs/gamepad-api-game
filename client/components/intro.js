import React, { useEffect } from 'react';
import Controller from '../lib/controller';
import Keyboard from '../lib/keyboard';

export default ({ onGameStart }) => {
  useEffect(() => {
    let controllers = [];
    const keyboard = new Keyboard();
    let handle = null;

    const onInteract = (event) => {
      onGameStart(event.parent);
    };

    const gamepadPoll = () => {
      const gamepads = window.navigator.getGamepads();
      controllers.forEach(c => c.update(gamepads));
      handle = setTimeout(gamepadPoll, 10);
    }

    const onGamepadConnected = (event) => {
      console.log('gamepad connected', event.gamepad);
      const controller = new Controller(event.gamepad); 
      controller.addEventListener('oninteract', onInteract);
      controllers.push(controller);
      gamepadPoll();
    }

    const onGamepadDisconnected = (event) => {
      console.log('gamepad disconnected', event.gamepad);
      controllers = controllers.filter((c) => c.id !== event.gamepad.id && c.index !== event.gamepad.index);
      if (controllers.length === 0) {
        clearTimeout(handle);
      }
    }

    keyboard.addEventListener('oninteract', onInteract);
    window.addEventListener('gamepadconnected', onGamepadConnected);
    window.addEventListener('gamepaddisconnected', onGamepadDisconnected);

    return () => {
      clearTimeout(handle);
      window.removeEventListener('gamepadconnected', onGamepadConnected);
      window.removeEventListener('gamepaddisconnected', onGamepadDisconnected);
      keyboard.removeEventListener('oninteract', onInteract);
      controllers.forEach((controller) => {
        controller.removeEventListener('oninteract', onInteract);
      });
    }
  }, [])

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="rounded p-4 pt-6 shadow-lg border border-gray-200 w-1/3">
        Press a button on your controller to start
      </div>
    </div>
  )
};
