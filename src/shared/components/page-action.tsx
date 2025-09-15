import React from 'react';
import Button from './button';

const PageAction = ({ href = true, children, onClick, disabled = false }) => {
  return (
    <Button
      onClick={onClick}
      link={href}
      href={href && href}
      disabled={disabled}
      className="min-w-fit w-[40px] h-[40px]">
      {children}
    </Button>
  );
};

export default PageAction;

