'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { useTour } from '@/contexts/TourContext';

export const Tour: React.FC = () => {
  const {
    isActive,
    currentStep,
    currentTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
  } = useTour();

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const [tooltipStyle, setTooltipStyle] = useState<Record<string, unknown>>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  // Find and highlight the target element
  useEffect(() => {
    if (!isActive || !currentTour) return;

    const step = currentTour.steps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (!element) {
      // console.warn(`Tour target not found: ${step.target}`);
      return;
    }

    setTargetElement(element);

    // Calculate overlay position and size
    const rect = element.getBoundingClientRect();

    // Calculate the hole in the overlay for the target element
    const holeRect = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };

    setOverlayStyle({
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9998,
      pointerEvents: 'none',
    });

    // Calculate tooltip position
    const tooltipWidth = 320;
    const tooltipHeight = 200;
    const margin = 16;

    let tooltipTop = holeRect.top + holeRect.height + margin;
    let tooltipLeft = holeRect.left;

    // Adjust position if tooltip would go off screen
    if (tooltipLeft + tooltipWidth > window.innerWidth) {
      tooltipLeft = window.innerWidth - tooltipWidth - margin;
    }
    if (tooltipTop + tooltipHeight > window.innerHeight) {
      tooltipTop = holeRect.top - tooltipHeight - margin;
    }
    if (tooltipLeft < margin) {
      tooltipLeft = margin;
    }
    if (tooltipTop < margin) {
      tooltipTop = margin;
    }

    setTooltipStyle({
      position: 'fixed',
      top: tooltipTop,
      left: tooltipLeft,
      width: tooltipWidth,
      zIndex: 9999,
    });
  }, [isActive, currentStep, currentTour]);

  // Add highlight class to target element
  useEffect(() => {
    if (targetElement) {
      targetElement.classList.add('tour-highlight');
      return () => {
        targetElement.classList.remove('tour-highlight');
      };
    }
    return undefined;
  }, [targetElement]);

  if (!isActive || !currentTour) return null;

  const step = currentTour.steps[currentStep];
  if (!step) return null;

  const progress = ((currentStep + 1) / currentTour.steps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className='fixed inset-0 z-50'
      >
        {/* Overlay with hole */}
        <div ref={overlayRef} style={overlayStyle} className='tour-overlay'>
          {/* Top overlay */}
          <div
            className='absolute bg-black/50'
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: targetElement
                ? `${targetElement.getBoundingClientRect().top}px`
                : '100%',
            }}
          />

          {/* Bottom overlay */}
          {targetElement && (
            <>
              <div
                className='absolute bg-black/50'
                style={{
                  top: `${targetElement.getBoundingClientRect().bottom}px`,
                  left: 0,
                  width: '100%',
                  height: `${window.innerHeight - targetElement.getBoundingClientRect().bottom}px`,
                }}
              />

              {/* Left overlay */}
              <div
                className='absolute bg-black/50'
                style={{
                  top: `${targetElement.getBoundingClientRect().top}px`,
                  left: 0,
                  width: `${targetElement.getBoundingClientRect().left}px`,
                  height: `${targetElement.getBoundingClientRect().height}px`,
                }}
              />

              {/* Right overlay */}
              <div
                className='absolute bg-black/50'
                style={{
                  top: `${targetElement.getBoundingClientRect().top}px`,
                  left: `${targetElement.getBoundingClientRect().right}px`,
                  width: `${window.innerWidth - targetElement.getBoundingClientRect().right}px`,
                  height: `${targetElement.getBoundingClientRect().height}px`,
                }}
              />
            </>
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={tooltipStyle}
          className='bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6'
        >
          {/* Progress bar */}
          {currentTour.showProgress !== false && (
            <div className='mb-4'>
              <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2'>
                <span>
                  Step {currentStep + 1} of {currentTour.steps.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
              {step.title}
            </h3>
            <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
              {step.content}
            </p>
            {step.actionText && (
              <div className='mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg'>
                <p className='text-sm text-blue-700 dark:text-blue-300 font-medium'>
                  💡 {step.actionText}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-between items-center'>
            <div className='flex gap-2'>
              {step.skipable !== false && (
                <Button
                  onClick={skipTour}
                  variant='ghost'
                  size='sm'
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  Skip Tour
                </Button>
              )}
            </div>

            <div className='flex gap-2'>
              {currentStep > 0 && (
                <Button onClick={previousStep} variant='outline' size='sm'>
                  Previous
                </Button>
              )}

              <Button
                onClick={
                  currentStep === currentTour.steps.length - 1
                    ? completeTour
                    : nextStep
                }
                variant='primary'
                size='sm'
              >
                {currentStep === currentTour.steps.length - 1
                  ? 'Finish'
                  : 'Next'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tour;
