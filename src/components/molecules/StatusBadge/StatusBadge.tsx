import React from 'react';

import { createAccessibleStatusProps } from '@/lib/accessibility';
import { cn } from '@/lib/design-tokens';

interface StatusBadgeProps {
  status: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'solid' | 'outline' | 'soft';
  [key: string]: unknown; // Allow data-testid and other props
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  icon,
  size = 'md',
  className = '',
  variant = 'soft',
  ...props
}) => {
  const statusConfig = {
    success: {
      solid: 'bg-success-500 text-success-50',
      outline: 'border border-success-500 text-success-600 bg-transparent',
      soft: 'bg-success-50 text-success-700 border border-success-200',
    },
    error: {
      solid: 'bg-error-500 text-error-50',
      outline: 'border border-error-500 text-error-600 bg-transparent',
      soft: 'bg-error-50 text-error-700 border border-error-200',
    },
    warning: {
      solid: 'bg-warning-500 text-warning-50',
      outline: 'border border-warning-500 text-warning-600 bg-transparent',
      soft: 'bg-warning-50 text-warning-700 border border-warning-200',
    },
    info: {
      solid: 'bg-primary-500 text-primary-50',
      outline: 'border border-primary-500 text-primary-600 bg-transparent',
      soft: 'bg-primary-50 text-primary-700 border border-primary-200',
    },
    neutral: {
      solid: 'bg-neutral-500 text-neutral-50',
      outline: 'border border-neutral-500 text-neutral-600 bg-transparent',
      soft: 'bg-neutral-50 text-neutral-700 border border-neutral-200',
    },
  };

  const sizeConfig = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizeConfig = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const classes = cn(
    'inline-flex items-center gap-1.5 rounded-full font-medium',
    statusConfig[status][variant],
    sizeConfig[size],
    className
  );

  const accessibleProps =
    status === 'neutral'
      ? {}
      : createAccessibleStatusProps(
          status as 'error' | 'success' | 'info' | 'warning'
        );

  return (
    <span className={classes} {...accessibleProps} {...props}>
      {icon && (
        <span className={iconSizeConfig[size]} aria-hidden='true'>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

export default StatusBadge;
