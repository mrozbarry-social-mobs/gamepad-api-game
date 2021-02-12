import React, { useState, useEffect } from 'react';
import Controller from '../lib/controller.js';
import Keyboard from '../lib/keyboard.js';
import KeyLayout from './keyLayout.js';
import GamepadLayout from './gamepadLayout.js';

export default ({ onGameStart }) => {
  const [gamepads, setGamepads] = useState([]);

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
      setGamepads(() => Array.from(window.navigator.getGamepads()).filter((gp) => gp));
      const controller = new Controller(event.gamepad); 
      controller.addEventListener('oninteract', onInteract);
      controllers.push(controller);
      gamepadPoll();
    }

    const onGamepadDisconnected = (event) => {
      setGamepads(() => Array.from(window.navigator.getGamepads()).filter((gp) => gp));
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
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="rounded px-10 pt-6 shadow-lg border border-gray-200 w-1/3">
        Press a button on your controller to start
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Gamepad</h2>
          {gamepads.length === 0 && (
            <div>Plug in and press a button on a controller to use it</div>
          )}
          {gamepads.map(gamepad => (
            <GamepadLayout key={`${gamepad.id}-${gamepad.index}`} gamepad={gamepad} />
          ))}
        </section>
        <section className="mb-4">
          <h2 className="text-lg font-bold mb-2">Keyboard</h2>
          <KeyLayout />
        </section>
      </div>
    </div>
  )
};
