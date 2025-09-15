import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
  variant?: 'default' | 'inverse';
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  disabled,
  variant = 'default',
  ...rest
}) => {
  const baseClasses =
    'w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors';

  const checkedClasses =
    variant === 'inverse'
      ? 'peer-checked:bg-main-background peer-checked:border-main-background text-transparent peer-checked:text-main'
      : 'peer-checked:bg-main border-main text-transparent peer-checked:text-text-secondary';

  const borderClasses =
    variant === 'inverse' ? 'border-main-background' : 'border-main';
  const labelColor =
    variant === 'inverse' ? 'text-main-background' : 'text-black';

  return (
    <label
      className={`flex items-center space-x-2 cursor-pointer ${
        disabled ? 'opacity-50' : ''
      }`}>
      {/* Hidden default checkbox */}
      <input
        disabled={disabled}
        type="checkbox"
        className="hidden peer"
        {...rest}
      />

      {/* Custom checkbox */}
      <div
        className={`${baseClasses} ${borderClasses} ${checkedClasses} relative`}>
        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Optional label text */}
      {label && <span className={`select-none ${labelColor}`}>{label}</span>}
    </label>
  );
};

export default Checkbox;

