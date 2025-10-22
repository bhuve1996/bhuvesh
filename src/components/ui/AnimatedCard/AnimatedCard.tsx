'use client';

import { animated, useSpring } from '@react-spring/web';
import React, { useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'rotate';
  duration?: number;
  hover?: boolean;
  onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 600,
  hover = true,
  onClick,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const getInitialTransform = useCallback(() => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 50, scale: 0.9 };
      case 'down':
        return { opacity: 0, y: -50, scale: 0.9 };
      case 'left':
        return { opacity: 0, x: 50, scale: 0.9 };
      case 'right':
        return { opacity: 0, x: -50, scale: 0.9 };
      case 'scale':
        return { opacity: 0, scale: 0.5 };
      case 'rotate':
        return { opacity: 0, rotate: 180, scale: 0.8 };
      default:
        return { opacity: 0, y: 50, scale: 0.9 };
    }
  }, [direction]);

  const getFinalTransform = useCallback(() => {
    switch (direction) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        return { opacity: 1, x: 0, y: 0, scale: 1 };
      case 'scale':
        return { opacity: 1, scale: 1 };
      case 'rotate':
        return { opacity: 1, rotate: 0, scale: 1 };
      default:
        return { opacity: 1, x: 0, y: 0, scale: 1 };
    }
  }, [direction]);

  const [springs, api] = useSpring(() => ({
    from: getInitialTransform(),
    to: inView ? getFinalTransform() : getInitialTransform(),
    config: {
      tension: 300,
      friction: 30,
      duration,
    },
    delay,
  }));

  const [hoverSprings, hoverApi] = useSpring(() => ({
    scale: 1,
    y: 0,
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  }));

  React.useEffect(() => {
    api.start({
      to: inView ? getFinalTransform() : getInitialTransform(),
    });
  }, [inView, api, getFinalTransform, getInitialTransform]);

  const handleMouseEnter = () => {
    if (hover) {
      hoverApi.start({
        scale: 1.05,
        y: -8,
        boxShadow: '0 20px 40px rgba(6, 182, 212, 0.2)',
      });
    }
  };

  const handleMouseLeave = () => {
    if (hover) {
      hoverApi.start({
        scale: 1,
        y: 0,
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      });
    }
  };

  const handleClick = () => {
    // Click animation
    hoverApi.start({
      scale: 0.95,
      y: 2,
    });

    setTimeout(() => {
      hoverApi.start({
        scale: 1.05,
        y: -8,
      });
    }, 100);

    if (onClick) onClick();
  };

  return (
    <animated.div
      ref={ref}
      style={{
        ...springs,
        ...hoverSprings,
      }}
      className={`bg-card/5 backdrop-blur-sm border border-primary-500/20 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Animated background gradient */}
      <animated.div
        className='absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-blue-500/5'
        style={{
          opacity: hoverSprings.scale.to(s => (s - 1) * 2),
        }}
      />

      {/* Content */}
      <div className='relative z-10'>{children}</div>
    </animated.div>
  );
};

export default AnimatedCard;
