import React, { useState } from 'react'
import { render } from 'react-dom';

import Intro from './components/intro.js';
import Game from './components/game.js';

const onGameStart = props => (input) => {
  props.setInput(input);
  props.setScreen('game');
};
const Screens = {
  'intro': (props) => <Intro onGameStart={onGameStart(props)} />,
  'game': (props) => <Game input={props.input} />,
};

function App(){
  const [screen, setScreen] = useState('intro');
  const [input, setInput] = useState(null);

  const Component = Screens[screen];
  const componentProps = {
    setScreen,
    setInput,
    input,
  };

  return (
    <Component {...componentProps} />
  )
}

render(<App />, document.querySelector('#app'));
