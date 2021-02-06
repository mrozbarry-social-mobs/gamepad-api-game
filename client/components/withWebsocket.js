import React, { useRef, useEffect } from 'react';

export default (options) => (Component) => (props) => {
  const socketRef = useRef(null);
  const listenersRef = useRef([]);
  const backlogRef = useRef([]);

  useEffect(() => {
    socketRef.current = new WebSocket(options.host)

    const onOpen = (event) => {
      console.log('websocket.open');
    };

    const onMessage = (event) => {
      const message = JSON.parse(event.data);
      backlogRef.current.push(message);
      listenersRef.current.forEach((callback) => {
        if (backlogRef.current.length === 0) return;
        backlogRef.current.filter((msg) => !callback(msg));
      });
    };

    const onError = (error) => {
      console.log('websocket.error', error);
    };

    const onClose = (event) => {
      console.log('websocket.close', event);
    };

    socketRef.current.addEventListener('open', onOpen);
    socketRef.current.addEventListener('message', onMessage);
    socketRef.current.addEventListener('error', onError);
    socketRef.current.addEventListener('close', onClose);

    return () => {
      socketRef.current.removeEventListener('open', onOpen);
      socketRef.current.removeEventListener('message', onMessage);
      socketRef.current.removeEventListener('error', onError);
      socketRef.current.removeEventListener('close', onClose);
      socketRef.current.close();
    };
  });

  const hostSend = (type, payload) => {
    if (!socketRef.current) return;

    socketRef.current.send(JSON.stringify({ type, payload, timestamp: performance.now() }));
  };

  const hostSubscribe = (callback) => {
    listenersRef.current.push(callback);
    backlogRef.current.filter((message) => !callback(message));
    return () => {
      listenersRef.current = listenersRef.current.filter((cb) => cb !== callback);
    };
  };

  const hostProps = { hostSend, hostSubscribe };

  return <Component {...props} {...hostProps} />;
};
