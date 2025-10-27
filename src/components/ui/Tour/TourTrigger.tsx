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
}) => {
  const { startTour, hasCompletedTour, getAvailableTours } = useTour();

  const tours = getAvailableTours();
  const tour = tours.find(t => t.id === tourId);

  if (!tour) {
    // console.warn(`Tour with id "${tourId}" not found`);
    return null;
  }

  const isCompleted = hasCompletedTour(tourId);

  // Always show the button, but with different styling for completed tours
  // if (isCompleted && !showIfCompleted) {
  //   return null;
  // }

  const handleStartTour = () => {
    startTour(tourId);
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleStartTour}
        className={`p-2 rounded-full transition-colors ${
          isCompleted
            ? 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
            : 'hover:bg-muted text-foreground'
        } ${className}`}
        title={`${isCompleted ? 'Restart' : 'Start'} ${tour.name} tour`}
        aria-label={`${isCompleted ? 'Restart' : 'Start'} ${tour.name} tour`}
      >
        {children || (
          <svg
            className={`w-5 h-5 ${isCompleted ? 'text-muted-foreground' : 'text-foreground'}`}
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
        className={`underline transition-colors ${
          isCompleted
            ? 'text-muted-foreground hover:text-foreground'
            : 'text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300'
        } ${className}`}
      >
        {children || `${isCompleted ? 'Restart' : 'Start'} ${tour.name} tour`}
      </button>
    );
  }

  return (
    <Button
      onClick={handleStartTour}
      variant={isCompleted ? 'ghost' : 'outline'}
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
