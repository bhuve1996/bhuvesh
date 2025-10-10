import React from 'react';

import { InputProps } from './types';

export const Input: React.FC<InputProps> = ({
  value = '',
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  error,
  label,
  helperText,
  type = 'text',
  className = '',
  ...props
}) => {
  const baseClasses =
    'w-full px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = error
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-cyan-500 focus:border-cyan-500';

  const disabledClasses = disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-50'
    : 'bg-white';

  const classes =
    `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`.trim();

  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={classes}
        {...props}
      />

      {error && <p className='text-sm text-red-600'>{error}</p>}

      {helperText && !error && (
        <p className='text-sm text-gray-500'>{helperText}</p>
      )}
    </div>
  );
};

export default Input;
