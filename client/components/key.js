import React from 'react';

export default ({ label, description }) => {
  const classes = [
    'w-14',
    'h-14',
    'p-1',
    'flex',
    'flex-col',
    'items-center',
    description ? 'justify-end' : 'justify-center',
    'bg-gray-900',
    'text-white',
    'mr-1',
    'shadow-lg',
    'rounded',
    'border',
    'border-gray-100',
    'transition-all',
    'transform',
    'translate-x-0',
    'hover:translate-x-0.5',
    'hover:translate-y-0.5',
    'hover:mt-2',
    'hover:shadow-none',
    'cursor-default',
  ];
  return (
    <div className={classes.join(' ')}>
      <div className="text-normal">{label}</div>
      <div className="text-xs">{description}</div>
    </div>
  );
};
