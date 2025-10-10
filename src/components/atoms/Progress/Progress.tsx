import React from 'react';

import { ProgressProps } from './types';

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  showValue = false,
  animated = false,
  striped = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-gray-200 rounded-full overflow-hidden';

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const variantClasses = {
    default: 'bg-cyan-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const progressClasses = `${variantClasses[variant]} ${animated ? 'animate-pulse' : ''} ${striped ? 'bg-stripes' : ''}`;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <div
        className={`h-full transition-all duration-300 ease-in-out ${progressClasses}`}
        style={{ width: `${percentage}%` }}
        role='progressbar'
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {showValue && (
          <div className='flex items-center justify-center h-full text-xs font-medium text-white'>
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
