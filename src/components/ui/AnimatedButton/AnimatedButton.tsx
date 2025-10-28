'use client';

import { animated, useSpring } from '@react-spring/web';
import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'success';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ripple?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ripple = true,
}) => {
  const [springs, api] = useSpring(() => ({
    scale: 1,
    y: 0,
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  }));

  const [rippleSpring, rippleApi] = useSpring(() => ({
    scale: 0,
    opacity: 0,
  }));

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg',
    secondary:
      'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg',
    outline:
      'border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white',
    ghost: 'text-cyan-600 hover:bg-cyan-500/10 hover:text-cyan-700',
    destructive:
      'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg',
    success:
      'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const handleMouseEnter = () => {
    if (!disabled && !loading) {
      api.start({
        scale: 1.05,
        y: -2,
        boxShadow: '0 8px 25px rgba(6, 182, 212, 0.3)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (!disabled && !loading) {
      api.start({
        scale: 1,
        y: 0,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      });
    }
  };

  const handleClick = (_e: React.MouseEvent) => {
    if (disabled || loading) return;

    // Ripple effect
    if (ripple) {
      rippleApi.start({
        scale: 4,
        opacity: 0.6,
        from: { scale: 0, opacity: 0 },
        config: { duration: 600 },
        onRest: () => {
          rippleApi.start({ scale: 0, opacity: 0 });
        },
      });
    }

    // Click animation
    api.start({
      scale: 0.95,
      y: 1,
      onRest: () => {
        api.start({
          scale: 1.05,
          y: -2,
        });
      },
    });

    if (onClick) onClick();
  };

  return (
    <animated.button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-lg
        transition-all duration-300 focus:outline-none focus:ring-2
        focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50
        disabled:cursor-not-allowed relative overflow-hidden
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      style={springs}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Ripple effect */}
      {ripple && (
        <animated.div
          className='absolute inset-0 bg-white/30 rounded-full'
          style={{
            ...rippleSpring,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <animated.div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2' />
      )}

      {/* Button content */}
      <span className='relative z-10'>{children}</span>
    </animated.button>
  );
};

export default AnimatedButton;
