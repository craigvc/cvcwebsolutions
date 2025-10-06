'use client';

import { forwardRef } from 'react';

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className = '',
  onKeyDown,
  onFocus,
  helperText
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-300">
          {label} {required && '*'}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-2 text-white transition-colors border border-gray-700 rounded-lg bg-gray-900/50 focus:outline-none focus:border-purple-500 disabled:opacity-50"
      />
      {helperText && (
        <p className="mt-1 text-xs text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
