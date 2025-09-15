import clsx from 'clsx';
import React from 'react';

const PageHead = ({ head, size = 'normal' }) => {
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

