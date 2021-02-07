import React, { useState } from 'react';
import withWebsocket from './withWebsocket.js';
import Join from './join.js';
import Loading from './loading.js';
import Play from './play.js';

const webSocketProtocol = window.location.protocol.startsWith('https')
  ? 'wss:'
  : 'ws:';

const webSocketHost = `${webSocketProtocol}//${window.location.host}`;

const Views = {
  'join': (props) => <Join {...props} />,
  'loading': (props) => <Loading {...props} />,
  'play': (props) => <Play {...props} />,
};

export default withWebsocket({
  host: webSocketHost,
})((props) => {
  const [game, setGame] = useState({
    view: 'join',
    id: null,
    name: 'Player_' + Math.random().toString(36).slice(2, 8),
    color: 'purple',
    x: 0,
    y: 0,
  });

  const onSubmit = (nextGame) => {
    props.hostSend('JOIN', {
      name: nextGame.name,
      color: nextGame.color,
    });
    return setGame((previousGame) => ({
      ...previousGame,
      ...nextGame,
      view: 'loading',
    }));
  };

  const onLoad = (nextGame) => {
    return setGame((previousGame) => ({
      ...previousGame,
      ...nextGame,
      view: 'play',
    }));
  };

  const View = Views[game.view];

  return (
    <View
      {...props}
      game={game}
      onSubmit={onSubmit}
      onLoad={onLoad}
    />
  );
});
