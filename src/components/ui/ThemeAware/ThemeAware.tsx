/**
 * Theme-Aware Component Wrapper
 * Provides consistent theme-aware styling for components
 */

import React from 'react';

import { useThemeStyles } from '@/hooks/useThemeStyles';

// Simple utility to combine classes
const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

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
        return 'bg-red-600 text-white hover:bg-red-700';
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

  const inputClasses = combineClasses(
    'px-3 py-2 rounded-md border transition-colors',
    classes.input.background,
    classes.input.border,
    classes.input.text,
    classes.input.placeholder,
    classes.input.focus,
    variant === 'error' ? 'border-red-500' : '',
    className
  );

  return (
    <div className='space-y-2'>
      {label && (
        <label className={`text-sm font-medium ${classes.text.primary}`}>
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className={`text-sm text-red-500`}>{error}</p>}
      {help && !error && (
        <p className={`text-sm ${classes.text.muted}`}>{help}</p>
      )}
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return `${classes.background.card} border ${classes.border.primary} rounded-lg shadow-lg`;
      case 'glass':
        return `${classes.background.card} backdrop-blur-sm border ${classes.border.secondary} rounded-lg`;
      case 'interactive':
        return `${classes.background.card} border ${classes.border.primary} rounded-lg shadow-sm hover:shadow-md transition-shadow`;
      default:
        return `${classes.background.card} border ${classes.border.primary} rounded-lg shadow-sm`;
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

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

  const getBadgeVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 text-white';
      case 'success':
        return 'bg-green-600 text-white';
      case 'warning':
        return 'bg-yellow-600 text-white';
      case 'error':
        return 'bg-red-600 text-white';
      case 'info':
        return 'bg-cyan-600 text-white';
      case 'outline':
        return `border ${classes.border.primary} ${classes.text.primary}`;
      default:
        return `${classes.background.secondary} ${classes.text.primary}`;
    }
  };

  const badgeClasses = combineClasses(
    'inline-flex items-center rounded-full font-medium',
    getBadgeVariantClasses(),
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

  const getAlertVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300';
      case 'error':
        return 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
      case 'info':
        return 'bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
      default:
        return `${classes.background.card} border ${classes.border.primary} ${classes.text.primary}`;
    }
  };

  const alertClasses = combineClasses(
    getAlertVariantClasses(),
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

  const percentage = Math.min((value / max) * 100, 100);

  const progressClasses = combineClasses(
    'w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2',
    className
  );

  return (
    <div className='space-y-2'>
      {label && (
        <div className='flex justify-between items-center'>
          <span className={`text-sm font-medium ${classes.text.primary}`}>
            {label}
          </span>
          {showPercentage && (
            <span className={`text-sm ${classes.text.muted}`}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={progressClasses}>
        <div
          className='bg-blue-600 dark:bg-cyan-400 h-2 rounded-full transition-all duration-300'
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

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
    'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-cyan-400',
    getSizeClasses(),
    className
  );

  return (
    <div className='flex items-center justify-center space-x-2'>
      <div className={spinnerClasses} />
      {text && <span className={`text-sm ${classes.text.muted}`}>{text}</span>}
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
  const { getThemeClasses } = useThemeStyles();
  const classes = getThemeClasses();

  const dividerClasses = combineClasses(
    orientation === 'horizontal'
      ? `w-full h-px ${classes.border.primary}`
      : `h-full w-px ${classes.border.primary}`,
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
  const skeletonClasses = combineClasses(
    'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
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
