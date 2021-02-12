import React from 'react';
import Key from './key.js';

export default () => (
  <div className="grid grid-cols-2">
    <div>
      <div className="flex flex-row items-center justify-start mb-1">
        <Key label="Q" description="Emote" />
        <Key label="W" description="Emote" />
      </div>
      <div className="flex flex-row items-center justify-start mb-1 ml-2">
        <Key label="A" description="Foo bar" />
        <Key label="S" description="Foo bar" />
      </div>
      <div className="flex flex-row items-center justify-start mb-1 ml-4">
        <Key label="Z" description="Cancel" />
        <Key label="X" description="Interact" />
      </div>
    </div>
    <div>
      <div>
        <div className="flex flex-row items-center justify-center mb-1">
          <Key label="▲" description="Up" />
        </div>
        <div className="flex flex-row items-center justify-center mb-1">
          <Key label="◄" description="Left" />
          <Key label="▼" description="Down" />
          <Key label="►" description="Right" />
        </div>
      </div>
    </div>
  </div>
);
