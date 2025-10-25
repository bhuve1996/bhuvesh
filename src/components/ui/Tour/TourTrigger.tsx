'use client';

import React from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { useTour } from '@/contexts/TourContext';

interface TourTriggerProps {
  tourId: string;
  variant?: 'button' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIfCompleted?: boolean;
}

export const TourTrigger: React.FC<TourTriggerProps> = ({
  tourId,
  variant = 'button',
  size = 'md',
  className = '',
  children,
  showIfCompleted = false,
}) => {
  const { startTour, hasCompletedTour, getAvailableTours } = useTour();

  const tours = getAvailableTours();
  const tour = tours.find(t => t.id === tourId);

  if (!tour) {
    // console.warn(`Tour with id "${tourId}" not found`);
    return null;
  }

  const isCompleted = hasCompletedTour(tourId);

  // Don't show if completed and showIfCompleted is false
  if (isCompleted && !showIfCompleted) {
    return null;
  }

  const handleStartTour = () => {
    startTour(tourId);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleStartTour}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        title={`Start ${tour.name} tour`}
        aria-label={`Start ${tour.name} tour`}
      >
        {children || (
          <svg
            className='w-5 h-5 text-gray-600 dark:text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        )}
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleStartTour}
        className={`text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors ${className}`}
      >
        {children || `Start ${tour.name} tour`}
      </button>
    );
  }

  return (
    <Button
      onClick={handleStartTour}
      variant='outline'
      size={size}
      className={className}
    >
      {children || (
        <>
          <svg
            className='w-4 h-4 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          {isCompleted ? 'Replay Tour' : `Start ${tour.name}`}
        </>
      )}
    </Button>
  );
};

export default TourTrigger;
