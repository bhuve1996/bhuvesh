'use client';

import React, { ReactNode } from 'react';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn, getAnimationDelay } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scaleIn';
  threshold?: number;
  freezeOnceVisible?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  animation = 'slideUp',
  threshold = 0.1,
  freezeOnceVisible = true,
}) => {
  const [ref, entry] = useIntersectionObserver({
    threshold,
    freezeOnceVisible,
  });

  const isVisible = entry?.isIntersecting;

  const animationClasses = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    scaleIn: 'animate-scale-in',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? animationClasses[animation] : 'opacity-0 translate-y-8',
        className
      )}
      style={{
        animationDelay: getAnimationDelay(0, delay),
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
