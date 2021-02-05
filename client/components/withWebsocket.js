import React, { useRef, useEffect } from 'react';

export default (options) => (Component) => (props) => {
  const socketRef = useRef(null);
  const listenersRef = useRef([]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(options.host)
    }

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

    socketRef.current.addEventListener('open', onOpen);
    socketRef.current.addEventListener('message', onOpen);
    socketRef.current.addEventListener('error', onError);
    socketRef.current.addEventListener('close', onClose);

    return () => {
      console.log('useEffect.cancel');
      socketRef.current.removeEventListener('open', onOpen);
      socketRef.current.removeEventListener('message', onMessage);
      socketRef.current.removeEventListener('error', onError);
      socketRef.current.removeEventListener('close', onClose);
      socketRef.current.close();
    };
  }, []);

  const websocketSend = (type, payload) => {
    if (!socketRef.current) return;

    socketRef.current.send(JSON.stringify({ type, payload, timestamp: performance.now() }));
  };

  const websocketSubscribe = (callback) => {
    listenerRef.current.push(callback);
    return () => {
      listenerRef.current = listenerRef.current.filter((cb) => cb !== callback);
    };
  };

  const websocketProps = { websocketSend, websocketSubscribe };

  return <Component {...props} {...websocketProps} />;
};
