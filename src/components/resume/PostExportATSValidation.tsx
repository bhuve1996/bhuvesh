'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';

interface PostExportATSValidationProps {
  onValidate: () => void;
  className?: string;
}

export const PostExportATSValidation: React.FC<
  PostExportATSValidationProps
> = ({ onValidate, className = '' }) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    score: number;
    issues: string[];
    recommendations: string[];
  } | null>(null);

  const handleValidation = async () => {
    setIsValidating(true);

    // Simulate ATS validation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = {
      score: 87,
      issues: [
        'Some formatting may not be ATS-friendly',
        'Consider adding more quantifiable achievements',
      ],
      recommendations: [
        'Use standard section headings (Experience, Education, Skills)',
        'Include relevant keywords from job descriptions',
        'Use bullet points for achievements',
        'Save as PDF for best ATS compatibility',
      ],
    };

    setValidationResult(result);
    setIsValidating(false);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2'>
          📋 Post-Export ATS Validation
        </h3>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          Validate your exported resume for ATS compatibility and get
          improvement suggestions.
        </p>
      </div>

      <div className='space-y-4'>
        <Button
          onClick={handleValidation}
          disabled={isValidating}
          className='w-full'
        >
          {isValidating ? (
            <div className='flex items-center justify-center space-x-2'>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Validating...</span>
            </div>
          ) : (
            'Validate Exported Resume'
          )}
        </Button>

        {validationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-4'
          >
            {/* Reset Button */}
            <div className='flex justify-end'>
              <Button
                onClick={() => setValidationResult(null)}
                variant='outline'
                size='sm'
                className='text-xs'
              >
                Reset / Collapse
              </Button>
            </div>
            {/* Score */}
            <div className='text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg'>
              <div className='text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1'>
                {validationResult.score}%
              </div>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                ATS Compatibility Score
              </p>
            </div>

            {/* Issues */}
            {validationResult.issues.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-red-600 dark:text-red-400 mb-2'>
                  ⚠️ Issues Found
                </h4>
                <ul className='space-y-1'>
                  {validationResult.issues.map((issue, index) => (
                    <li
                      key={index}
                      className='text-sm text-red-600 dark:text-red-400'
                    >
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            <div>
              <h4 className='text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2'>
                💡 Recommendations
              </h4>
              <ul className='space-y-1'>
                {validationResult.recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className='text-sm text-blue-600 dark:text-blue-400'
                  >
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className='flex space-x-2 pt-4'>
              <Button
                onClick={() => setValidationResult(null)}
                variant='outline'
                className='flex-1'
              >
                Close
              </Button>
              <Button
                onClick={onValidate}
                className='flex-1 bg-blue-600 hover:bg-blue-700'
              >
                Apply Suggestions
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default PostExportATSValidation;
