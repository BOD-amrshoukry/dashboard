import React from 'react';
import Button from './button';

interface PageActionProps {
  href?: string | undefined; // href should be a string, not boolean
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  disabled?: boolean;
}

const PageAction: React.FC<PageActionProps> = ({
  href,
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      onClick={onClick}
      link={!!href} // true if href exists
      href={href}
      disabled={disabled}
      className="min-w-fit w-[40px] h-[40px]">
      {children}
    </Button>
  );
};

export default PageAction;

