'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  itemsPerView?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  spacing?: number;
  onItemSelect?: (index: number) => void;
  selectedIndex?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className = '',
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 3000,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 },
  spacing = 16,
  onItemSelect,
  selectedIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView.desktop);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && totalItems > itemsPerView.desktop) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % (maxIndex + 1));
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, maxIndex, totalItems, itemsPerView.desktop]);

  // Handle touch/mouse events with improved swipe detection
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setTranslateX(0);

    // Clear any existing scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);

    // Prevent default scrolling behavior during drag
    if (Math.abs(diff) > 10) {
      // setIsScrolling(true);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    const velocity = Math.abs(translateX);

    // More sensitive swipe detection
    if (velocity > threshold || (velocity > 20 && Math.abs(translateX) > 30)) {
      if (translateX > 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (translateX < 0 && currentIndex < maxIndex) {
        setCurrentIndex(prev => prev + 1);
      }
    }

    setTranslateX(0);

    // Reset scrolling state after a delay
    scrollTimeoutRef.current = setTimeout(() => {
      // setIsScrolling(false);
    }, 100);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const selectItem = (index: number) => {
    if (onItemSelect) {
      onItemSelect(index);
    }
  };

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      goToSlide(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className='overflow-hidden'
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0]?.clientX || 0)}
        onTouchMove={e => handleMove(e.touches[0]?.clientX || 0)}
        onTouchEnd={handleEnd}
      >
        <motion.div
          className='flex'
          animate={{
            x: `calc(-${currentIndex * (100 / itemsPerView.desktop)}% + ${translateX}px)`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
          style={{
            width: `${(totalItems * 100) / itemsPerView.desktop}%`,
          }}
        >
          {children.map((child, index) => (
            <motion.div
              key={index}
              className='flex-shrink-0'
              style={{
                width: `${100 / totalItems}%`,
                paddingRight: index < totalItems - 1 ? `${spacing}px` : '0',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`cursor-pointer transition-all duration-300 flex justify-center ${
                  selectedIndex === index
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'hover:shadow-md'
                }`}
                onClick={() => selectItem(index)}
              >
                {child}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > itemsPerView.desktop && (
        <>
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className='absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-blue-500/90 hover:bg-blue-600 shadow-lg rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Previous slide'
          >
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className='absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-slate-600/90 hover:bg-slate-700 shadow-lg rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Next slide'
          >
            <svg
              className='w-4 h-4 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalItems > itemsPerView.desktop && (
        <div className='flex justify-center mt-4 space-x-2'>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                currentIndex === index
                  ? 'bg-blue-500 w-6'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
