import clsx from 'clsx';
import React, { type ReactNode } from 'react';

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className,
}) => {
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

