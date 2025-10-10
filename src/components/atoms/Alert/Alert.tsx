import React from 'react';

import type { AlertProps } from '@/types';

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  icon,
  dismissible = false,
  onDismiss,
  action,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'p-4 rounded-lg border';

  const variantClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  const getIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={classes} role='alert' {...props}>
      <div className='flex items-start'>
        <div className='flex-shrink-0 mr-3'>
          <span className='text-lg'>{getIcon()}</span>
        </div>

        <div className='flex-1'>
          {title && <h3 className='text-sm font-medium mb-1'>{title}</h3>}

          {description && <p className='text-sm'>{description}</p>}

          {children && <div className='mt-2'>{children}</div>}

          {action && <div className='mt-3'>{action}</div>}
        </div>

        {dismissible && onDismiss && (
          <div className='flex-shrink-0 ml-3'>
            <button
              onClick={onDismiss}
              className='text-current opacity-50 hover:opacity-75 focus:outline-none focus:opacity-75'
              aria-label='Dismiss alert'
            >
              <span className='sr-only'>Dismiss</span>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
