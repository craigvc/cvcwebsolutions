'use client';

interface TextareaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helperText?: string;
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  helperText
}: TextareaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-300">
          {label} {required && '*'}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
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
}
