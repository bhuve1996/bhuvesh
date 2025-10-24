import React from 'react';

import {
  createAccessibleButtonProps,
  createKeyboardHandlers,
} from '@/lib/accessibility';
import { buttonVariants, cn } from '@/lib/design-tokens';
import type { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Filter out motion props to prevent them from being passed to DOM elements
  const {
    whileHover: _whileHover,
    whileTap: _whileTap,
    initial: _initial,
    animate: _animate,
    exit: _exit,
    transition: _transition,
    ...domProps
  } = props as ButtonProps & {
    whileHover?: unknown;
    whileTap?: unknown;
    initial?: unknown;
    animate?: unknown;
    exit?: unknown;
    transition?: unknown;
  };

  const widthClasses = fullWidth ? 'w-full' : '';

  const classes = cn(
    buttonVariants.base,
    buttonVariants.variants[variant],
    buttonVariants.sizes[size],
    widthClasses,
    className
  );

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleKeyDown = createKeyboardHandlers({
    onEnter: () => {
      if (onClick && !disabled && !loading) {
        onClick();
      }
    },
    onSpace: () => {
      if (onClick && !disabled && !loading) {
        onClick();
      }
    },
  });

  const accessibleProps = createAccessibleButtonProps({
    disabled: disabled || loading,
    loading,
    describedBy: loading ? 'loading-description' : undefined,
    label: loading ? 'Loading...' : undefined,
  } as Record<string, unknown>);

  const renderIcon = () => {
    if (loading) {
      return (
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
      );
    }

    if (icon) {
      return (
        <span className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
          {icon}
        </span>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (iconPosition === 'right') {
      return (
        <>
          {children}
          {renderIcon()}
        </>
      );
    }

    return (
      <>
        {renderIcon()}
        {children}
      </>
    );
  };

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      {...accessibleProps}
      {...domProps}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
