import clsx from 'clsx';
import React from 'react';

const Loading = ({ size }) => {
  return (
    <div
      className={clsx(
        'border-4 border-main border-t-second-background rounded-full animate-spin m-[4px]',
        size === 'sm' ? 'w-[18px] h-[18px]' : 'w-[40px] h-[40px]',
      )}></div>
  );
};

export default Loading;

