import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import type { FieldErrors } from 'react-hook-form';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: string;
  name: string;
  errors?: FieldErrors;
  className?: string;
  outerClassName?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  register?: any;
  multiline?: boolean; // 👈 new prop
  onEnterSubmit?: () => void; // 👈 function to call on Enter
}

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputProps
>(
  (
    {
      type = 'text',
      name,
      errors,
      className = '',
      label,
      placeholder,
      disabled,
      outerClassName = '',
      multiline = false,
      onEnterSubmit = false,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    // handle Enter for textarea
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onEnterSubmit && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // prevent newline
        onEnterSubmit(); // 👈 call the function
      }
    };

    return (
      <div className={clsx('flex flex-col gap-[8px] relative', outerClassName)}>
        {label && <label>{label}</label>}
        <div
          className={clsx(
            'border-1 outline-0 rounded-level1 text-[14px] w-full flex',
            disabled ? 'opacity-[50%]' : '',
            errors?.[name] ? 'border-error' : 'border-main',
            className,
          )}>
          {multiline ? (
            <textarea
              name={name}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...rest}
              placeholder={placeholder}
              disabled={disabled}
              onKeyDown={handleKeyDown} // 👈 trigger submitFunction
              className={clsx(
                'px-[12px] py-[8px] outline-0 rounded-level1 text-[14px] w-full resize-none',
                disabled ? '' : '',
                errors?.[name] ? 'border-error' : 'border-main',
                className,
              )}
            />
          ) : (
            <input
              type={inputType}
              name={name}
              ref={ref as React.Ref<HTMLInputElement>}
              {...rest}
              placeholder={placeholder}
              disabled={disabled}
              className={clsx(
                'px-[12px] py-[8px] outline-0 rounded-level1 text-[14px] w-full',
                disabled ? '' : '',
                errors?.[name] ? 'border-error' : 'border-main',
                className,
              )}
            />
          )}

          {isPassword && !multiline && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-main hover:text-main-hover mx-[12px]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

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

