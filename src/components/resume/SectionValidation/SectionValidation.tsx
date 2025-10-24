'use client';

import React from 'react';

import { validateSection } from '@/lib/resume/validation';
import { ResumeData } from '@/types/resume';

interface SectionValidationProps {
  section: string;
  resumeData: ResumeData;
  className?: string;
}

export const SectionValidation: React.FC<SectionValidationProps> = ({
  section,
  resumeData,
  className = '',
}) => {
  const validation = validateSection(section, resumeData);

  if (validation.isValid) {
    return null; // Don't show anything if section is valid
  }

  const getValidationColor = () => {
    return 'text-red-600';
  };

  const getValidationIcon = () => {
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
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center space-x-1 ${getValidationColor()}`}>
        {getValidationIcon()}
        <span className='text-sm font-medium'>{validation.message}</span>
      </div>
    </div>
  );
};

export default SectionValidation;
