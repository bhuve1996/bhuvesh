'use client';

import { motion } from 'framer-motion';
import React from 'react';

import type { AnimatedProgressProps } from '@/types';

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  steps,
  currentStep: _currentStep,
  className = '',
}) => {
  // Convert ProgressStep[] to AnimatedProgressStep[] by ensuring description is present
  const animatedSteps = steps.map(step => ({
    ...step,
    description: step.description || step.title, // Use title as fallback if description is missing
  }));
  const getStepIcon = (status: string, index: number) => {
    switch (status) {
      case 'completed':
        return (
          <motion.div
            className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
          >
            <motion.svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </motion.svg>
          </motion.div>
        );
      case 'active':
        return (
          <motion.div
            className='w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center'
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(6, 182, 212, 0.4)',
                '0 0 0 10px rgba(6, 182, 212, 0)',
                '0 0 0 0 rgba(6, 182, 212, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className='w-3 h-3 bg-white rounded-full'
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        );
      case 'error':
        return (
          <motion.div
            className='w-8 h-8 bg-red-500 rounded-full flex items-center justify-center'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
          >
            <motion.svg
              className='w-5 h-5 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </motion.svg>
          </motion.div>
        );
      default:
        return (
          <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
            <span className='text-white text-sm font-bold'>{index + 1}</span>
          </div>
        );
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'active':
        return 'text-cyan-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {animatedSteps.map((step, index) => (
        <motion.div
          key={step.id}
          className='flex items-start space-x-4'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          {/* Step Icon */}
          <div className='flex-shrink-0'>{getStepIcon(step.status, index)}</div>

          {/* Step Content */}
          <div className='flex-1 min-w-0'>
            <motion.h4
              className={`text-lg font-semibold ${getStepColor(step.status)}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
            >
              {step.title}
            </motion.h4>
            <motion.p
              className='text-gray-300 mt-1'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {step.description}
            </motion.p>
          </div>

          {/* Connecting Line - Hidden */}
          {/* {index < animatedSteps.length - 1 && step.status === 'completed' && (
            <motion.div
              className='absolute left-4 top-12 w-0.5 h-16 bg-green-500'
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              style={{
                transformOrigin: 'center top',
              }}
            />
          )}
          {index < animatedSteps.length - 1 && step.status !== 'completed' && (
            <motion.div
              className='absolute left-4 top-12 w-0.5 h-16 bg-gray-600'
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 0.3 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              style={{
                transformOrigin: 'center top',
              }}
            />
          )} */}
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedProgress;
