'use client';

import React from 'react';

import type { ProgressStepsProps, ProgressStep } from '@/types';

export const ProgressSteps: React.FC<ProgressStepsProps> = ({
  steps,
  currentStep,
  className = '',
}) => {
  const getStepStatus = (index: number): ProgressStep['status'] => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepClasses = (status: ProgressStep['status']) => {
    const baseClasses =
      'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ease-in-out';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-green-400 to-emerald-500 border-green-400 text-white shadow-lg shadow-green-400/25`;
      case 'active':
        return `${baseClasses} bg-gradient-to-r from-cyan-400 to-blue-500 border-cyan-400 text-white shadow-lg shadow-cyan-400/25 animate-pulse`;
      case 'error':
        return `${baseClasses} bg-gradient-to-r from-red-400 to-pink-500 border-red-400 text-white shadow-lg shadow-red-400/25`;
      default:
        return `${baseClasses} bg-gray-800 border-gray-600 text-gray-400`;
    }
  };

  const getLineClasses = (status: ProgressStep['status']) => {
    const baseClasses = 'h-0.5 transition-all duration-500 ease-in-out';

    switch (status) {
      case 'completed':
        return `${baseClasses} bg-gradient-to-r from-green-400 to-emerald-500`;
      case 'active':
        return `${baseClasses} bg-gradient-to-r from-green-400 to-cyan-400`;
      default:
        return `${baseClasses} bg-gray-700`;
    }
  };

  const getTextClasses = (status: ProgressStep['status']) => {
    const baseClasses = 'transition-all duration-300';

    switch (status) {
      case 'completed':
        return `${baseClasses} text-green-400`;
      case 'active':
        return `${baseClasses} text-cyan-400 font-semibold`;
      case 'error':
        return `${baseClasses} text-red-400`;
      default:
        return `${baseClasses} text-gray-400`;
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className='relative'>
        {/* Progress Line */}
        <div className='absolute top-6 left-6 right-6 h-0.5 bg-gray-700 -z-10'>
          <div
            className='h-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 transition-all duration-1000 ease-out'
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className='flex justify-between items-start'>
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className='flex flex-col items-center flex-1'>
                {/* Step Circle */}
                <div className='relative z-10'>
                  <div className={getStepClasses(status)}>
                    {status === 'completed' && (
                      <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    )}
                    {status === 'active' && (
                      <div className='w-6 h-6 flex items-center justify-center'>
                        <div className='w-3 h-3 bg-white rounded-full animate-ping' />
                      </div>
                    )}
                    {status === 'error' && (
                      <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    )}
                    {status === 'pending' && (
                      <span className='text-lg font-bold'>{step.icon}</span>
                    )}
                  </div>

                  {/* Pulse effect for active step */}
                  {status === 'active' && (
                    <div className='absolute inset-0 w-12 h-12 rounded-full bg-cyan-400/20 animate-ping' />
                  )}
                </div>

                {/* Step Content */}
                <div className='mt-4 text-center max-w-48'>
                  <h3
                    className={`text-sm font-medium ${getTextClasses(status)}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${status === 'active' ? 'text-gray-300' : 'text-gray-500'}`}
                  >
                    {step.description}
                  </p>
                </div>

                {/* Connection Line */}
                {!isLast && (
                  <div className='absolute top-6 left-1/2 w-full h-0.5 -z-10'>
                    <div className={getLineClasses(status)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step Details */}
      {steps[currentStep] && (
        <div className='mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>
                {steps[currentStep].icon}
              </span>
            </div>
            <div>
              <h4 className='text-white font-semibold'>
                {steps[currentStep].title}
              </h4>
              <p className='text-gray-300 text-sm'>
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressSteps;
