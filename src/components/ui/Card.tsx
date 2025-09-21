import React from 'react';
import { CardProps } from '@/types';

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = true,
}) => {
  const baseClasses =
    'bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6';
  const hoverClasses = hover ? 'hover:bg-white/10 transition-colors' : '';

  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  return <div className={classes}>{children}</div>;
};

export default Card;
