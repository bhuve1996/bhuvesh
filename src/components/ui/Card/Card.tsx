'use client';

import { motion } from 'framer-motion';
import React from 'react';

import type { EnhancedCardProps } from '@/types';

export const Card: React.FC<EnhancedCardProps> = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  onClick,
  role,
  tabIndex,
  'aria-pressed': ariaPressed,
  'aria-label': ariaLabel,
  onKeyDown,
  ...props
}) => {
  const baseClasses =
    'bg-card/5 backdrop-blur-sm border border-primary-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden hover-lift hover-glow';
  const hoverClasses = hover
    ? 'hover:bg-card/10 transition-all duration-300 cursor-pointer'
    : '';

  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={
        hover
          ? {
              scale: 1.01,
              boxShadow: '0 10px 25px rgba(6, 182, 212, 0.08)',
              borderColor: 'rgba(6, 182, 212, 0.3)',
            }
          : {}
      }
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      aria-pressed={ariaPressed}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      {...props}
    >
      {/* Content */}
      <div className='relative z-10'>{children}</div>
    </motion.div>
  );
};

export default Card;
