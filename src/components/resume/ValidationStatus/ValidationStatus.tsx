'use client';

import React from 'react';

import { validateResumeData } from '@/lib/resume/validation';
import { ResumeData } from '@/types/resume';

interface ValidationStatusProps {
  resumeData: ResumeData;
  className?: string;
}

export const ValidationStatus: React.FC<ValidationStatusProps> = ({
  resumeData,
  className = '',
}) => {
  const validation = validateResumeData(resumeData);
  const { isValid, missingRequired, missingRecommended } = validation;

  const getStatusColor = () => {
    if (isValid && missingRecommended.length === 0) return 'text-green-600';
    if (isValid && missingRecommended.length > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (isValid && missingRecommended.length === 0) {
      return (
        <svg
          className='w-4 h-4'
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
      );
    }
    if (isValid && missingRecommended.length > 0) {
      return (
        <svg
          className='w-4 h-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z'
          />
        </svg>
      );
    }
    return (
      <svg
        className='w-4 h-4'
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
    );
  };

  const getStatusText = () => {
    if (isValid && missingRecommended.length === 0) {
      return 'Resume Complete';
    }
    if (isValid && missingRecommended.length > 0) {
      return `${missingRecommended.length} section(s) recommended`;
    }
    return `${missingRequired.length} required section(s) missing`;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className='text-sm font-medium'>{getStatusText()}</span>
      </div>
    </div>
  );
};

export default ValidationStatus;
