import clsx from 'clsx';
import { Link } from 'react-router-dom';
import React, { type MouseEventHandler } from 'react';

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset' | 'label';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: 'default' | 'inverse';
  children: React.ReactNode;
  link?: boolean;
  href?: string;
};

const Button: React.FC<ButtonProps> = ({
  className,
  disabled,
  type = 'submit',
  onClick,
  variant = 'default',
  children,
  link = false,
  href = '',
  ...rest
}) => {
  const baseStyles =
    'flex justify-center items-center rounded-level1 py-[8px] cursor-pointer transition-[0.5s] min-w-[160px] px-[8px]';
  const variantStyles = clsx(
    disabled && 'opacity-[50%]',
    variant === 'inverse'
      ? 'bg-second-background hover:bg-main-background text-main'
      : 'bg-main hover:bg-main-hover text-text-secondary',
  );

  if (type === 'label') {
    return (
      <label className={clsx(baseStyles, variantStyles, className)}>
        {children}
      </label>
    );
  }

  if (link) {
    return (
      <Link to={href} className={clsx(baseStyles, variantStyles, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={clsx(baseStyles, variantStyles, className)}
      {...rest}>
      {children}
    </button>
  );
};

export default Button;

