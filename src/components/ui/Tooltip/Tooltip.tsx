'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculateOptimalPosition = () => {
    if (!triggerRef.current) return position;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // More accurate tooltip dimensions based on content length
    const estimatedTooltipWidth = Math.min(
      Math.max(content.length * 7 + 24, 100),
      384 // max-w-sm = 384px
    );
    // Estimate height based on content length and wrapping
    const estimatedTooltipHeight = Math.max(
      40,
      Math.ceil(content.length / 30) * 20 + 20
    );
    const margin = 16;

    // Check if tooltip would go off screen in the preferred position
    switch (position) {
      case 'top':
        if (triggerRect.top - estimatedTooltipHeight - margin < 0) {
          return 'bottom';
        }
        break;
      case 'bottom':
        if (
          triggerRect.bottom + estimatedTooltipHeight + margin >
          viewportHeight
        ) {
          return 'top';
        }
        break;
      case 'left':
        if (triggerRect.left - estimatedTooltipWidth - margin < 0) {
          return 'right';
        }
        break;
      case 'right':
        if (
          triggerRect.right + estimatedTooltipWidth + margin >
          viewportWidth
        ) {
          return 'left';
        }
        break;
    }

    return position;
  };

  const showTooltip = () => {
    if (disabled) return;

    const id = setTimeout(() => {
      const optimalPosition = calculateOptimalPosition();
      setActualPosition(optimalPosition);
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  // Reset actual position when position prop changes
  useEffect(() => {
    setActualPosition(position);
  }, [position]);

  const getPositionClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowClasses = () => {
    switch (actualPosition) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900 dark:border-b-gray-100';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900 dark:border-l-gray-100';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900 dark:border-r-gray-100';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900 dark:border-t-gray-100';
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-[9999] ${getPositionClasses()}`}
          >
            <div className='relative'>
              <div className='bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium px-3 py-2 rounded-md shadow-xl max-w-sm break-words whitespace-normal leading-relaxed'>
                {content}
              </div>
              <div
                className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
                style={{
                  borderTopColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  borderLeftColor: 'transparent',
                  ...(actualPosition === 'top' && {
                    borderTopColor: document.documentElement.classList.contains(
                      'dark'
                    )
                      ? 'rgb(243 244 246)' // gray-100 for dark mode
                      : 'rgb(17 24 39)', // gray-900 for light mode
                  }),
                  ...(actualPosition === 'bottom' && {
                    borderBottomColor:
                      document.documentElement.classList.contains('dark')
                        ? 'rgb(243 244 246)' // gray-100 for dark mode
                        : 'rgb(17 24 39)', // gray-900 for light mode
                  }),
                  ...(actualPosition === 'left' && {
                    borderLeftColor:
                      document.documentElement.classList.contains('dark')
                        ? 'rgb(243 244 246)' // gray-100 for dark mode
                        : 'rgb(17 24 39)', // gray-900 for light mode
                  }),
                  ...(actualPosition === 'right' && {
                    borderRightColor:
                      document.documentElement.classList.contains('dark')
                        ? 'rgb(243 244 246)' // gray-100 for dark mode
                        : 'rgb(17 24 39)', // gray-900 for light mode
                  }),
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
