'use client';

import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { StatusBadge } from '@/components/molecules/StatusBadge/StatusBadge';
import { Card } from '@/components/ui/Card';
import { validateResumeData } from '@/lib/resume/validation';
import type { ValidationTabProps } from '@/types';

export const ValidationTab: React.FC<ValidationTabProps> = ({ resumeData }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    score: number;
    issues: string[];
    recommendations: string[];
  } | null>(null);

  const validateResume = async () => {
    setIsValidating(true);
    try {
      const validation = validateResumeData(resumeData);

      setValidationResult({
        score: validation.score,
        issues: validation.issues,
        recommendations: validation.recommendations,
      });
    } catch {
      // Validation Error: error
    } finally {
      setIsValidating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className='p-4 space-y-4 h-full overflow-y-auto'>
      <div className='text-center'>
        <h4 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
          Resume Validation
        </h4>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          Validate your resume for completeness and quality
        </p>
      </div>

      {!validationResult ? (
        <div className='space-y-4'>
          <Card className='p-4 text-center'>
            <div className='w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-primary-600 dark:text-primary-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-2'>
              Ready to Validate
            </h5>
            <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-4'>
              Click the button below to validate your resume
            </p>
            <Button
              onClick={validateResume}
              loading={isValidating}
              variant='primary'
              fullWidth
            >
              {isValidating ? 'Validating...' : 'Validate Resume'}
            </Button>
          </Card>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Score Display */}
          <Card className='p-4 text-center'>
            <div className='mb-4'>
              <div className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
                {validationResult.score}/100
              </div>
              <StatusBadge
                status={getScoreColor(validationResult.score)}
                variant='soft'
                size='md'
              >
                {getScoreLabel(validationResult.score)}
              </StatusBadge>
            </div>
            <Button
              onClick={validateResume}
              loading={isValidating}
              variant='outline'
              size='sm'
            >
              Re-validate
            </Button>
          </Card>

          {/* Issues */}
          {validationResult.issues.length > 0 && (
            <Card className='p-4'>
              <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-3'>
                Issues Found
              </h5>
              <ul className='space-y-2'>
                {validationResult.issues.map((issue, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <StatusBadge status='error' size='sm' icon='⚠️'>
                      Issue
                    </StatusBadge>
                    <span className='text-sm text-neutral-700 dark:text-neutral-300'>
                      {issue}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Recommendations */}
          {validationResult.recommendations.length > 0 && (
            <Card className='p-4'>
              <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-3'>
                Recommendations
              </h5>
              <ul className='space-y-2'>
                {validationResult.recommendations.map(
                  (recommendation, index) => (
                    <li key={index} className='flex items-start gap-2'>
                      <StatusBadge status='info' size='sm' icon='💡'>
                        Tip
                      </StatusBadge>
                      <span className='text-sm text-neutral-700 dark:text-neutral-300'>
                        {recommendation}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ValidationTab;
