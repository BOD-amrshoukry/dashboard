import clsx from 'clsx';
import React from 'react';

interface PageHeadProps {
  head: string;
  size?: 'sm' | 'normal';
}

const PageHead: React.FC<PageHeadProps> = ({ head, size = 'normal' }) => {
  return (
    <h2
      className={clsx(
        'font-bold',
        size === 'sm' ? 'text-[24px]' : 'text-[32px]',
      )}>
      {head}
    </h2>
  );
};

export default PageHead;

