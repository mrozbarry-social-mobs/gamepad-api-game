import React, { useState, useEffect } from 'react'

export default ({onGameStart = () => {}}) => {

  useEffect(() => {
    window.addEventListener('gamepadconnected', onGameStart);
    return () => {
      window.removeEventListener('gamepadconnected', onGameStart);
    }
  }, [])

  return (
    <div>
      Press a button on your controller to start
    </div>
  )
};
