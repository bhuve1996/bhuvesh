import React from 'react';

import type { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  loading = false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background hover-lift hover-glow click-bounce';

  const variantClasses = {
    primary:
      'bg-primary-500 hover:bg-primary-600 text-primary-950 shadow-lg hover:shadow-primary-500/25 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2',
    secondary:
      'bg-secondary-500 hover:bg-secondary-600 text-secondary-950 shadow-lg hover:shadow-secondary-500/25 focus:ring-secondary-500 focus:ring-2 focus:ring-offset-2',
    outline:
      'border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-primary-950 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 dark:text-primary-400 dark:hover:text-primary-950',
    ghost:
      'text-primary-600 hover:bg-primary-500/10 hover:text-primary-700 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2 dark:text-primary-400 dark:hover:text-primary-300',
    destructive:
      'bg-error-500 hover:bg-error-600 text-error-50 shadow-lg hover:shadow-error-500/25 focus:ring-error-500 focus:ring-2 focus:ring-offset-2',
    success:
      'bg-success-500 hover:bg-success-600 text-success-950 shadow-lg hover:shadow-success-500/25 focus:ring-success-500 focus:ring-2 focus:ring-offset-2',
    warning:
      'bg-warning-500 hover:bg-warning-600 text-warning-950 shadow-lg hover:shadow-warning-500/25 focus:ring-warning-500 focus:ring-2 focus:ring-offset-2',
    default:
      'bg-neutral-600 hover:bg-neutral-700 text-neutral-100 shadow-lg hover:shadow-neutral-500/25 focus:ring-neutral-500 focus:ring-2 focus:ring-offset-2',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className='animate-spin -ml-1 mr-2 h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
