'use client';

import React from 'react';

interface VisualSeparatorProps {
  type?: 'vertical' | 'horizontal' | 'diagonal';
  position?: 'center' | 'left' | 'right';
  className?: string;
  opacity?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'neutral';
  animated?: boolean;
}

export const VisualSeparator: React.FC<VisualSeparatorProps> = ({
  type = 'vertical',
  position = 'center',
  className = '',
  opacity = 0.1,
  color = 'primary',
  animated = true,
}) => {
  const colorClasses = {
    primary: 'from-primary-500/20 via-primary-500/10 to-transparent',
    secondary: 'from-secondary-500/20 via-secondary-500/10 to-transparent',
    accent: 'from-accent-500/20 via-accent-500/10 to-transparent',
    neutral: 'from-neutral-500/20 via-neutral-500/10 to-transparent',
  };

  const positionClasses = {
    center: 'left-1/2 transform -translate-x-1/2',
    left: 'left-0',
    right: 'right-0',
  };

  const typeClasses = {
    vertical: 'w-px h-full',
    horizontal: 'h-px w-full',
    diagonal: 'w-px h-full transform rotate-45',
  };

  const animationClass = animated ? 'animate-pulse' : '';

  return (
    <div
      className={`
        absolute top-0 pointer-events-none select-none
        ${typeClasses[type]}
        ${positionClasses[position]}
        ${animationClass}
        ${className}
      `}
      style={{ opacity }}
    >
      <div
        className={`
          w-full h-full
          bg-gradient-to-b
          ${colorClasses[color]}
        `}
      />
    </div>
  );
};

export default VisualSeparator;
