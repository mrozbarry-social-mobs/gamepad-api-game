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
  const [screen, setScreen] = useState('intro');
  //const [state, setState] = useState({ x: 0, y: 0 });

  //useEffect(() => {
    //const gamepads = window.navigator.getGamepads();
    //const [xDiff, yDiff] = gamepads[0] && gamepads[0].axes || [0, 0];
    //requestAnimationFrame(() => {
      //setState({
        //x: state.x + xDiff,
        //y: state.y + yDiff,
      //});
    //});

  //});

  const Component = Screens[screen];
  const componentProps = {
    setScreen,
  };

  return (
    <div>
      <Component {...componentProps} />
        {/*
        <!--<div style={{  
        width: `5px`,
        height: `5px`,
        backgroundColor: 'red',
        position: 'absolute',
        top: `${state.y}px`,
        left: `${state.x}px`,
      }} />
          <code>{JSON.stringify(state, null, 2)}</code>
          */}
    </div>
  )
}

render(<App />, document.querySelector('#app'));
