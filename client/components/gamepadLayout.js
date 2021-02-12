import React from 'react';

export default ({ gamepad }) => {
  const buttonSize = 'w-6 h-6';

  return (
    <div className="bg-gray-900 rounded shadow text-gray-100 pt-8 pb-4">
      <div className="flex flex-row items-center justify-between mx-4">
        <div className="grid grid-cols-3 rounded-full">
          <div className={buttonSize}></div>
          <div className={[buttonSize, 'bg-gray-700', 'border-t', 'border-l', 'border-r', 'border-gray-500'].join(' ')}></div>
          <div className={buttonSize}></div>

          <div className={[buttonSize, 'bg-gray-700', 'border-t', 'border-l', 'border-b', 'border-gray-500'].join(' ')}></div>
          <div className={[buttonSize, 'bg-gray-700'].join(' ')}></div>
          <div className={[buttonSize, 'bg-gray-700', 'border-t', 'border-r', 'border-b', 'border-gray-500'].join(' ')}></div>

          <div className={buttonSize}></div>
          <div className={[buttonSize, 'bg-gray-700', 'border-b', 'border-l', 'border-r', 'border-gray-500'].join(' ')}></div>
          <div className={buttonSize}></div>
        </div>

        <div className="flex flex-inline items-center justify-center">
          <div className="h-2 w-8 rounded border border-gray-500 mr-4"></div>
          <div className="h-2 w-8 rounded border border-gray-500"></div>
        </div>

        <div className="grid grid-cols-3 rounded-full">
          <div className={buttonSize}></div>
          <div className={[buttonSize, 'bg-gray-700', 'border', 'border-gray-500', 'rounded-full'].join(' ')}></div>
          <div className={buttonSize}></div>

          <div className={[buttonSize, 'bg-gray-700', 'border', 'border-gray-500', 'rounded-full'].join(' ')}></div>
          <div className={buttonSize}></div>
          <div className={[buttonSize, 'bg-gray-700', 'border', 'border-gray-500', 'rounded-full'].join(' ')}></div>

          <div className={buttonSize}></div>
          <div className={[buttonSize, 'bg-gray-700', 'border', 'border-gray-500', 'rounded-full'].join(' ')}></div>
          <div className={buttonSize}></div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between mx-24">
        <div className="w-12 h-12 rounded-full border border-gray-500">
          <div className="w-full h-full rounded-full border border-gray-500 bg-gray-700 transform transition-all"></div>
        </div>
        <div className="w-12 h-12 rounded-full border border-gray-500">
          <div className="w-full h-full rounded-full border border-gray-500 bg-gray-700 transform transition-all"></div>
        </div>
      </div>
    </div>
  );
};
