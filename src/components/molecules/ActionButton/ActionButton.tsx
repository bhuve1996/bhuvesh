import React from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { cn } from '@/lib/design-tokens';
import type { ButtonProps } from '@/types';

interface ActionButtonProps extends Omit<ButtonProps, 'icon'> {
  icon?: React.ReactNode;
  tooltip?: string;
  showTooltip?: boolean;
  loading?: boolean;
  loadingText?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  tooltip,
  showTooltip = false,
  loading = false,
  loadingText,
  children,
  className = '',
  ...buttonProps
}) => {
  const buttonContent = (
    <Button
      {...buttonProps}
      icon={icon}
      loading={loading}
      className={cn(className)}
    >
      {loading && loadingText ? loadingText : children}
    </Button>
  );

  if (showTooltip && tooltip) {
    return (
      <div className='relative group'>
        {buttonContent}
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-neutral-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10'>
          {tooltip}
          <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-neutral-900'></div>
        </div>
      </div>
    );
  }

  return buttonContent;
};

export default ActionButton;
