import clsx from 'clsx';
import React from 'react';

const UnreadCircle = ({ unreadCount, relative = false }) => {
  return (
    <>
      {unreadCount > 0 && (
        <span
          className={clsx(
            ' bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center',
            relative ? '' : 'absolute -top-1 -right-1',
          )}>
          {unreadCount > 9 ? '+9' : unreadCount}
        </span>
      )}
    </>
  );
};

export default UnreadCircle;

