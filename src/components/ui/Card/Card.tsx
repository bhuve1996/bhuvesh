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
    'bg-card/5 backdrop-blur-sm border border-primary-500/20 rounded-2xl p-6 relative overflow-hidden';
  const hoverClasses = hover
    ? 'hover:bg-card/10 transition-all duration-300'
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
              scale: 1.02,
              boxShadow: '0 20px 40px rgba(6, 182, 212, 0.1)',
              borderColor: 'rgba(6, 182, 212, 0.4)',
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
      {/* Animated background gradient */}
      <div className='absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

      {/* Content */}
      <div className='relative z-10'>{children}</div>
    </motion.div>
  );
};

export default Card;
