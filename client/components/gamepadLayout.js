import React from 'react';

const Button = ({ pressed, otherClasses, ...props }) => (
  <div {...props} className={[...otherClasses, pressed ? 'bg-yellow-700' :  'bg-gray-700', 'border-gray-500'].join(' ')}></div>
);

const DpadBorders = {
  up: 'ltr',
  left: 'tlb',
  down: 'rbl',
  right: 'trb',
};

const DpadButton = ({ pressed, direction }) => (
  <Button pressed={pressed} otherClasses={['w-6 h-6', ...DpadBorders[direction].split('').map(d => `border-${d}`)]} />
);

const MiddleButton = ({ pressed }) => (
  <Button pressed={pressed} otherClasses={['h-4 w-12', 'rounded', 'border', 'rounded-full', 'mr-8']} />
);

export default ({ gamepad }) => {
  const buttonSize = 'w-6 h-6';

  return (
    <div className="bg-gray-900 rounded shadow text-gray-100 pt-8 pb-4">
      <div className="flex flex-row items-center justify-between mx-10">
        <div className="grid grid-cols-3 rounded-full">
          <div className={buttonSize}></div>
          <DpadButton pressed={gamepad.axes[7] < 0} direction="up" />
          <div className={buttonSize}></div>

          <DpadButton pressed={gamepad.axes[6] < 0} direction="left" />
          <div className={[buttonSize, 'bg-gray-700'].join(' ')}></div>
          <DpadButton pressed={gamepad.axes[6] > 0} direction="right" />

          <div className={buttonSize}></div>
          <DpadButton pressed={gamepad.axes[7] > 0} direction="down" />
          <div className={buttonSize}></div>
        </div>

        <div className="flex flex-inline items-center justify-center">
          <MiddleButton pressed={gamepad.buttons[10].pressed} />
          <MiddleButton pressed={gamepad.buttons[11].pressed} />
        </div>

        <div className="grid grid-cols-3 rounded-full">
          <div className={buttonSize}></div>
          <Button pressed={gamepad.buttons[3].pressed} otherClasses={[buttonSize, 'border', 'rounded-full']} />
          <div className={buttonSize}></div>

          <Button pressed={gamepad.buttons[4].pressed} otherClasses={[buttonSize, 'border', 'rounded-full']} />
          <div className={buttonSize}></div>
          <Button pressed={gamepad.buttons[0].pressed} otherClasses={[buttonSize, 'border', 'rounded-full']} />

          <div className={buttonSize}></div>
          <Button pressed={gamepad.buttons[1].pressed} otherClasses={[buttonSize, 'border', 'rounded-full']} />
          <div className={buttonSize}></div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between mx-32">
        <div className="w-16 h-16 rounded-full border border-gray-500">
          <Button
            pressed={gamepad.buttons[13].pressed}
            otherClasses={['h-full w-full', 'border', 'rounded-full']}
            style={{ transform: `translate(${gamepad.axes[0] * 8}px, ${gamepad.axes[1] * 8}px)` }}
          />
        </div>
        <div className="w-16 h-16 rounded-full border border-gray-500">
          <Button
            pressed={gamepad.buttons[14].pressed}
            otherClasses={['h-full w-full', 'border', 'rounded-full']}
            style={{ transform: `translate(${gamepad.axes[2] * 8}px, ${gamepad.axes[3] * 8}px)` }}
          />
        </div>
      </div>
    </div>
  );
};
