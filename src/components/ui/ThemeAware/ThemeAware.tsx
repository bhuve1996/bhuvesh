/**
 * Theme-Aware Component Wrapper
 * Provides consistent theme-aware styling for components
 */

import React from 'react';

import { useThemeStyles } from '@/hooks/useThemeStyles';

// Simple utility to combine classes
const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface ThemeAwareProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'glass' | 'elevated' | 'interactive';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark' | 'auto';
}

export const ThemeAware: React.FC<ThemeAwareProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  theme: _theme = 'auto',
}) => {
  const { getThemeClasses } = useThemeStyles();

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm';
      case 'glass':
        return 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 rounded-lg';
      case 'elevated':
        return 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg';
      case 'interactive':
        return 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3 text-sm';
      case 'lg':
        return 'p-8 text-lg';
      default:
        return 'p-6 text-base';
    }
  };

  const baseClasses = combineClasses(
    getVariantClasses(),
    getSizeClasses(),
    className
  );

  return <div className={baseClasses}>{children}</div>;
};

/**
 * Theme-Aware Button Component
 */
interface ThemeAwareButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const ThemeAwareButton: React.FC<ThemeAwareButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const { classes } = useThemeStyles();

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return classes.button.primary;
      case 'secondary':
        return classes.button.secondary;
      case 'outline':
        return classes.button.outline;
      case 'ghost':
        return classes.button.ghost;
      case 'destructive':
        return classes.button.destructive;
      default:
        return classes.button.primary;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const buttonClasses = combineClasses(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    getVariantClasses(),
    getSizeClasses(),
    className
  );

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && (
        <svg
          className='mr-2 h-4 w-4 animate-spin'
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

/**
 * Theme-Aware Input Component
 */
interface ThemeAwareInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  help?: string;
  variant?: 'default' | 'error';
}

export const ThemeAwareInput: React.FC<ThemeAwareInputProps> = ({
  label,
  error,
  help,
  variant = 'default',
  className = '',
  ...props
}) => {
  const { classes } = useThemeStyles();

  const inputClasses = combineClasses(
    classes.input.base,
    variant === 'error' ? classes.input.error : '',
    className
  );

  return (
    <div className='space-y-2'>
      {label && <label className={classes.form.label}>{label}</label>}
      <input className={inputClasses} {...props} />
      {error && <p className={classes.form.error}>{error}</p>}
      {help && !error && <p className={classes.form.help}>{help}</p>}
    </div>
  );
};

/**
 * Theme-Aware Card Component
 */
interface ThemeAwareCardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
}

export const ThemeAwareCard: React.FC<ThemeAwareCardProps> = ({
  children,
  title,
  description,
  className = '',
  variant = 'default',
}) => {
  const { classes } = useThemeStyles();

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return classes.card.elevated;
      case 'glass':
        return classes.card.glass;
      case 'interactive':
        return classes.card.interactive;
      default:
        return classes.card.base;
    }
  };

  const cardClasses = combineClasses(getVariantClasses(), className);

  return (
    <div className={cardClasses}>
      {(title || description) && (
        <div className='mb-4'>
          {title && (
            <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
          )}
          {description && (
            <p className='text-sm text-muted-foreground mt-1'>{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

/**
 * Theme-Aware Badge Component
 */
interface ThemeAwareBadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeAwareBadge: React.FC<ThemeAwareBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const { getBadgeClass } = useThemeStyles();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3 py-1 text-base';
      default:
        return 'px-2.5 py-0.5 text-sm';
    }
  };

  const badgeClasses = combineClasses(
    getBadgeClass(variant),
    getSizeClasses(),
    className
  );

  return <span className={badgeClasses}>{children}</span>;
};

/**
 * Theme-Aware Alert Component
 */
interface ThemeAwareAlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  title?: string;
  className?: string;
}

export const ThemeAwareAlert: React.FC<ThemeAwareAlertProps> = ({
  children,
  variant = 'default',
  title,
  className = '',
}) => {
  const { getAlertClass } = useThemeStyles();

  const alertClasses = combineClasses(
    getAlertClass(variant),
    'rounded-lg p-4',
    className
  );

  return (
    <div className={alertClasses}>
      {title && <h4 className='font-semibold mb-2'>{title}</h4>}
      <div>{children}</div>
    </div>
  );
};

/**
 * Theme-Aware Progress Component
 */
interface ThemeAwareProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ThemeAwareProgress: React.FC<ThemeAwareProgressProps> = ({
  value,
  max = 100,
  label,
  className = '',
  showPercentage = true,
}) => {
  const { classes } = useThemeStyles();

  const percentage = Math.min((value / max) * 100, 100);

  const progressClasses = combineClasses(
    classes.progress.container,
    className
  );

  return (
    <div className='space-y-2'>
      {label && (
        <div className='flex justify-between items-center'>
          <span className={classes.progress.label}>{label}</span>
          {showPercentage && (
            <span className='text-sm text-muted-foreground'>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={progressClasses}>
        <div
          className={classes.progress.bar}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Theme-Aware Loading Component
 */
interface ThemeAwareLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const ThemeAwareLoading: React.FC<ThemeAwareLoadingProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  const { classes } = useThemeStyles();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-8 w-8';
      default:
        return 'h-6 w-6';
    }
  };

  const spinnerClasses = combineClasses(
    classes.loading.spinner,
    getSizeClasses(),
    className
  );

  return (
    <div className='flex items-center justify-center space-x-2'>
      <div className={spinnerClasses} />
      {text && <span className='text-sm text-muted-foreground'>{text}</span>}
    </div>
  );
};

/**
 * Theme-Aware Divider Component
 */
interface ThemeAwareDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const ThemeAwareDivider: React.FC<ThemeAwareDividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  const { classes } = useThemeStyles();

  const dividerClasses = combineClasses(
    orientation === 'horizontal'
      ? classes.divider.horizontal
      : classes.divider.vertical,
    className
  );

  return <div className={dividerClasses} />;
};

/**
 * Theme-Aware Skeleton Component
 */
interface ThemeAwareSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const ThemeAwareSkeleton: React.FC<ThemeAwareSkeletonProps> = ({
  className = '',
  width,
  height,
}) => {
  const { classes } = useThemeStyles();

  const skeletonClasses = combineClasses(
    classes.loading.skeleton,
    className
  );

  const style = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && {
      height: typeof height === 'number' ? `${height}px` : height,
    }),
  };

  return <div className={skeletonClasses} style={style} />;
};

export default ThemeAware;
