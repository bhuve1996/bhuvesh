'use client';

import React from 'react';

interface SectionSeparatorProps {
  variant?: 'line' | 'gradient' | 'dots' | 'shadow';
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'muted';
  thickness?: 'thin' | 'medium' | 'thick';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SectionSeparator: React.FC<SectionSeparatorProps> = ({
  variant = 'gradient',
  className = '',
  color = 'muted',
  thickness = 'medium',
  spacing = 'lg',
}) => {
  const colorClasses = {
    primary:
      'from-primary-500/20 via-primary-500/10 to-transparent dark:from-primary-400/20 dark:via-primary-400/10',
    secondary:
      'from-secondary-500/20 via-secondary-500/10 to-transparent dark:from-secondary-400/20 dark:via-secondary-400/10',
    accent:
      'from-accent-500/20 via-accent-500/10 to-transparent dark:from-accent-400/20 dark:via-accent-400/10',
    neutral:
      'from-neutral-500/20 via-neutral-500/10 to-transparent dark:from-neutral-400/20 dark:via-neutral-400/10',
    muted:
      'from-muted-foreground/20 via-muted-foreground/10 to-transparent dark:from-muted-foreground/30 dark:via-muted-foreground/20',
  };

  const thicknessClasses = {
    thin: 'h-px',
    medium: 'h-0.5',
    thick: 'h-1',
  };

  const spacingClasses = {
    sm: 'my-8',
    md: 'my-12',
    lg: 'my-16',
    xl: 'my-20',
  };

  const renderSeparator = () => {
    switch (variant) {
      case 'line':
        return (
          <div
            className={`
              w-full ${thicknessClasses[thickness]}
              bg-gradient-to-r ${colorClasses[color]}
              ${spacingClasses[spacing]}
              ${className}
            `}
          />
        );

      case 'gradient':
        return (
          <div
            className={`
              w-full ${thicknessClasses[thickness]}
              bg-gradient-to-r ${colorClasses[color]}
              ${spacingClasses[spacing]}
              ${className}
            `}
          />
        );

      case 'dots':
        return (
          <div
            className={`
              flex justify-center items-center
              ${spacingClasses[spacing]}
              ${className}
            `}
          >
            <div className='flex space-x-2'>
              <div className='w-2 h-2 bg-muted-foreground/30 dark:bg-muted-foreground/40 rounded-full'></div>
              <div className='w-2 h-2 bg-muted-foreground/50 dark:bg-muted-foreground/60 rounded-full'></div>
              <div className='w-2 h-2 bg-muted-foreground/30 dark:bg-muted-foreground/40 rounded-full'></div>
            </div>
          </div>
        );

      case 'shadow':
        return (
          <div
            className={`
              w-full h-px
              ${spacingClasses[spacing]}
              ${className}
            `}
            style={{
              boxShadow:
                '0 1px 3px hsl(var(--muted-foreground) / 0.1), 0 1px 2px hsl(var(--muted-foreground) / 0.06)',
            }}
          />
        );

      default:
        return (
          <div
            className={`
              w-full ${thicknessClasses[thickness]}
              bg-gradient-to-r ${colorClasses[color]}
              ${spacingClasses[spacing]}
              ${className}
            `}
          />
        );
    }
  };

  return renderSeparator();
};

export default SectionSeparator;
