import React from 'react';

import type { InputProps } from '@/types';

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
    : 'border-border focus:ring-primary-500 focus:border-primary-500';

  const disabledClasses = disabled
    ? 'bg-muted cursor-not-allowed opacity-50'
    : 'bg-background';

  const classes =
    `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`.trim();

  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-foreground'>
          {label}
          {required && (
            <span className='text-red-500 ml-1' aria-label='required'>
              *
            </span>
          )}
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
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error
            ? `${props.id || 'input'}-error`
            : helperText
              ? `${props.id || 'input'}-helper`
              : undefined
        }
        {...props}
      />

      {error && (
        <p
          id={`${props.id || 'input'}-error`}
          className='text-sm text-red-600'
          role='alert'
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={`${props.id || 'input'}-helper`}
          className='text-sm text-muted-foreground'
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
