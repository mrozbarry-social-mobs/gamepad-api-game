import React, { useEffect } from 'react'
import Controller from '../lib/controller'

export default ({onGameStart = () => {}}) => {
  
  

  useEffect(() => {
    let controller = null;
    let handle = null;

    const gamepadPoll = () => {
      const [gamepad] = window.navigator.getGamepads()
      controller.update(gamepad);
      handle = setTimeout(gamepadPoll, 10);
    }

    const onGamepadConnected = (event) => {
      controller = new Controller(event.gamepad);
      controller.addEventListener('button.up', onGameStart);
      gamepadPoll();
    }


    window.addEventListener('gamepadconnected', onGamepadConnected);
    window.addEventListener('keyup', onGameStart);
    return () => {
      window.removeEventListener('gamepadconnected', onGamepadConnected);
      window.removeEventListener('keyup', onGameStart);
      if (controller) {
        controller.removeEventListener('button.up', onGameStart);
      }
      clearTimeout(handle);
    }
  }, [])

  return (
    <div>
      Press a button on your controller to start
    </div>
  )
};
