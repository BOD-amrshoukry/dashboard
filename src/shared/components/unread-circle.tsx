import clsx from 'clsx';
import React from 'react';

interface UnreadCircleProps {
  unreadCount: number;
  relative?: boolean;
}

const UnreadCircle: React.FC<UnreadCircleProps> = ({
  unreadCount,
  relative = false,
}) => {
  if (unreadCount <= 0) return null;

  return (
    <span
      className={clsx(
        'bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center',
        relative ? '' : 'absolute -top-1 -right-1',
      )}>
      {unreadCount > 9 ? '+9' : unreadCount}
    </span>
  );
};

export default UnreadCircle;

