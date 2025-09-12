import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, disabled, ...rest }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      {/* Hidden default checkbox */}
      <input
        disabled={disabled}
        type="checkbox"
        className="hidden peer myCheck"
        {...rest}
      />

      {/* Custom checkbox */}
      <div
        className="w-5 h-5 border-2 border-main rounded-md flex items-center justify-center
                      peer-checked:bg-main peer-checked:border-main text-transparent peer-checked:text-text-secondary
                      transition-colors">
        {/* Checkmark */}
        <svg className="w-3 h-3 " viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Optional label text */}
      {label && <span className="select-none">{label}</span>}
    </label>
  );
};

export default Checkbox;

