import React, { type ReactNode } from 'react';
import Button from '../../../shared/components/button';

interface TempAuthProps {
  head: string;
  icon?: ReactNode;
  description: string;
  href: string;
  hrefText: string;
}

const TempAuth: React.FC<TempAuthProps> = ({
  head,
  icon,
  description,
  href,
  hrefText,
}) => {
  return (
    <div className="flex flex-col gap-[16px] items-center">
      <p className="text-[40px] font-black">{head}</p>
      {icon && <div>{icon}</div>}
      <p className="text-center">{description}</p>
      <Button link={true} href={href} className="w-full mt-[32px]">
        {hrefText}
      </Button>
    </div>
  );
};

export default TempAuth;

