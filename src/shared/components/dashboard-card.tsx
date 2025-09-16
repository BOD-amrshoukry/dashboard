import clsx from 'clsx';
import React from 'react';

const DashboardCard = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'bg-second-background p-4 rounded-level1 shadow w-full',
        className,
      )}>
      {children}
    </div>
  );
};

export default DashboardCard;

