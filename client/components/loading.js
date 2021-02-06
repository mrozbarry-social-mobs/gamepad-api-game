import React, { useEffect, useState } from 'react';

export default (props) => {
  const [progress, setProgress] = useState(undefined);

  useEffect(() => {
    const cancelSub = props.hostSubscribe((message) => {
      switch (message.type) {
        case 'YOU':
          setProgress(2);
          props.onLoad(message.payload);
          return true;
        default:
          console.log('skipping message on loading', message);
      }
    });

    setProgress(1);

    return () => {
      cancelSub();
    };
  }, []);

  return (
    <div>
      <progress max="2" value={progress} />
    </div>
  );
};
