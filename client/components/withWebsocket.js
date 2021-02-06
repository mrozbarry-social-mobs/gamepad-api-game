import React, { useRef, useEffect } from 'react';

export default (options) => (Component) => (props) => {
  const socketRef = useRef(null);
  const listenersRef = useRef([]);

  useEffect(() => {
    const socket = new WebSocket(options.host)

    const onOpen = (event) => {
      console.log('websocket.open', event);
    };

    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      listenersRef.current.forEach((callback) => callback(message));
    };

    const onError = (error) => {
      console.log('websocket.error', error);
    };

    const onClose = (event) => {
      console.log('websocket.close', event);
    };

    socket.addEventListener('open', onOpen);
    socket.addEventListener('message', onMessage);
    socket.addEventListener('error', onError);
    socket.addEventListener('close', onClose);

    return () => {
      console.log('useEffect.cancel');
      socket.removeEventListener('open', onOpen);
      socket.removeEventListener('message', onMessage);
      socket.removeEventListener('error', onError);
      socket.removeEventListener('close', onClose);
      socket.close();
    };
  });

  const hostSend = (type, payload) => {
    if (!socketRef.current) return;

    socketRef.current.send(JSON.stringify({ type, payload, timestamp: performance.now() }));
  };

  const hostSubscribe = (callback) => {
    listenerRef.current.push(callback);
    return () => {
      listenerRef.current = listenerRef.current.filter((cb) => cb !== callback);
    };
  };

  const hostProps = { hostSend, hostSubscribe };

  return <Component {...props} {...hostProps} />;
};
