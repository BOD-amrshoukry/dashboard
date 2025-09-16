import clsx from 'clsx';
import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md'; // 👈 enforce valid sizes
}

const Loading: React.FC<LoadingProps> = ({ size = 'md' }) => {
  return (
    <div
      className={clsx(
        'border-4 border-main border-t-second-background rounded-full animate-spin m-[4px]',
        size === 'sm' ? 'w-[18px] h-[18px]' : 'w-[40px] h-[40px]',
      )}
    />
  );
};

export default Loading;

