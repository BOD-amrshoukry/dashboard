import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { FieldErrors } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: any;
}

interface PortalSelectProps {
  options: Option[];
  value?: Option | null;
  onChange: (value: Option) => void;
  placeholder?: string;
  className?: string;
  outerClassName?: string;
  label?: string;
  name: string;
  errors?: FieldErrors; // 🔹 added
}

export default function Select({
  options,
  value,
  onChange,
  placeholder,
  className,
  outerClassName,
  label,
  name,
  errors,
}: PortalSelectProps) {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update dropdown position
  useLayoutEffect(() => {
    if (showDropdown && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left,
        width: rect.width,
      });
    }
  }, [showDropdown]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    console.log(option);
    onChange(option);
    setShowDropdown(false);
  };

  const dropdown = showDropdown && options.length > 0 && (
    <div
      ref={dropdownRef}
      className="rounded-level1 bg-second-background border border-main overflow-hidden shadow z-50"
      style={{
        position: 'absolute',
        top: position.top + 8,
        left: position.left,
        width: position.width,
      }}>
      <ul className="max-h-48 overflow-y-auto w-full">
        {options.map((option) => (
          <li
            key={option.value}
            onClick={() => handleSelect(option)}
            className="px-2 py-1 cursor-pointer hover:bg-main-background">
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className={clsx('flex flex-col gap-[8px] relative', outerClassName)}
      ref={inputRef}>
      {/* Label */}
      {label && <label>{label}</label>}

      {/* Input-like clickable field */}
      <div
        className={clsx(
          'border-1 outline-0 rounded-level1 text-[14px] w-full flex',
          errors?.[name] ? 'border-error' : 'border-main',
          className,
        )}
        onClick={() => setShowDropdown((prev) => !prev)}>
        <input
          readOnly
          value={value?.label || ''}
          placeholder={placeholder || t('general.text.select')}
          className={clsx(
            'px-[12px] py-[8px] outline-0 rounded-level1 text-[14px] w-full cursor-pointer',
            errors?.[name] ? 'border-error' : 'border-main',
          )}
        />
      </div>

      {/* Dropdown portal */}
      {showDropdown && createPortal(dropdown, document.body)}

      {/* Error message */}
      {errors?.[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}

