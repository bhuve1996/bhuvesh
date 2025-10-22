'use client';

import Image from 'next/image';
import React from 'react';

interface AnimatedGifProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'left'
    | 'right';
  opacity?: number;
  zIndex?: number;
  animation?: 'float' | 'pulse' | 'spin' | 'bounce' | 'none';
  speed?: 'slow' | 'normal' | 'fast';
  showSeparator?: boolean;
  separatorType?: 'shadow' | 'line' | 'gradient';
}

export const AnimatedGif: React.FC<AnimatedGifProps> = ({
  src,
  alt,
  className = '',
  width = 100,
  height = 100,
  position = 'top-right',
  opacity = 0.2,
  zIndex = 5,
  animation = 'float',
  speed = 'normal',
  showSeparator = false,
  separatorType = 'shadow',
}) => {
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    center: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    left: 'top-1/2 left-4 transform -translate-y-1/2',
    right: 'top-1/2 right-4 transform -translate-y-1/2',
  };

  const animationClasses = {
    float: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    none: '',
  };

  const speedClasses = {
    slow: 'duration-1000',
    normal: 'duration-500',
    fast: 'duration-300',
  };

  const separatorClasses = {
    shadow: 'shadow-2xl shadow-primary-500/20',
    line: 'border-2 border-primary-500/30',
    gradient: 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20',
  };

  return (
    <div
      className={`
        absolute pointer-events-none select-none
        ${positionClasses[position]}
        ${animationClasses[animation]}
        ${speedClasses[speed]}
        ${showSeparator ? separatorClasses[separatorType] : ''}
        ${className}
      `}
      style={{
        zIndex,
        opacity,
      }}
    >
      <div className='relative'>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className='w-full h-full object-contain rounded-lg'
          draggable={false}
          unoptimized
        />
        {showSeparator && separatorType === 'line' && (
          <div className='absolute inset-0 border-2 border-primary-500/30 rounded-lg'></div>
        )}
        {showSeparator && separatorType === 'gradient' && (
          <div className='absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-lg'></div>
        )}
      </div>
    </div>
  );
};

export default AnimatedGif;
