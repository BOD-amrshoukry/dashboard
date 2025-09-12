import clsx from 'clsx';
import React, { useState } from 'react';
import type { FieldError, FieldErrors } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react'; // optional icon library

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  name: string;
  errors?: FieldErrors;
  className?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  register?: any;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name,
      errors,
      className = '',
      label,
      placeholder,
      disabled,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="flex flex-col gap-[8px] relative">
        {label && <p>{label}</p>}
        <div
          className={clsx(
            'border-1  outline-0 rounded-level1 text-[14px] w-full flex',
            disabled ? 'bg-disabled' : '',
            errors?.[name] ? 'border-error' : 'border-main',
            className,
          )}>
          <input
            type={inputType}
            name={name}
            ref={ref}
            {...rest}
            placeholder={placeholder}
            disabled={disabled}
            className={clsx(
              'px-[12px] py-[8px] outline-0 rounded-level1 text-[14px] w-full',
              disabled ? 'bg-disabled' : '',
              errors?.[name] ? 'border-error' : 'border-main',
              className,
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className=" text-main hover:text-main-hover mx-[12px]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* Show/Hide password icon */}

        {errors?.[name] && (
          <p className="text-sm text-red-500">
            {errors[name]?.message as string}
          </p>
        )}
      </div>
    );
  },
);

export default Input;

