// https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API

// https://fun.mrbarry.com
//
import React, { useState, useEffect } from 'react'
import { render } from 'react-dom';

import Intro from './components/intro.js';
import Game from './components/game.js';


const Screens = {
  'intro': (props) => <Intro onGameStart={() => props.setScreen('game')} />,
  'game': (props) => <Game />,
};

function App(){
  const [screen, setScreen] = useState('game');

  const Component = Screens[screen];
  const componentProps = {
    setScreen,
  };

  return (
    <Component {...componentProps} />
  )
}

render(<App />, document.querySelector('#app'));
