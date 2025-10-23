'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface FloatingPostExportATSValidationProps {
  onValidate: () => void;
  className?: string;
}

export const FloatingPostExportATSValidation: React.FC<
  FloatingPostExportATSValidationProps
> = ({ onValidate, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    score: number;
    issues: string[];
    recommendations: string[];
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Show the floating button after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // Show after other floating buttons
    return () => clearTimeout(timer);
  }, []);

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
    setIsExpanded(true);
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className='relative group'>
              <Button
                onClick={() => setIsExpanded(true)}
                disabled={isValidating}
                className='w-14 h-14 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
                aria-label='Post-Export ATS Validation'
              >
                {isValidating ? (
                  <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : (
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
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                )}
              </Button>

              {/* Tooltip */}
              {showTooltip && (
                <div className='absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                  <div className='bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowTooltip(false);
                      }}
                      className='absolute -top-1 -right-1 w-4 h-4 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xs text-white transition-colors pointer-events-auto'
                      title='Close tooltip'
                    >
                      ×
                    </button>
                    <div className='font-medium'>
                      📋 Post-Export ATS Validation
                    </div>
                    <div className='text-xs text-gray-300 mt-1'>
                      Validate exported resume for ATS compatibility
                    </div>
                    <div className='absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45'></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className='w-80 max-h-96 overflow-y-auto'
          >
            <Card className='p-4 bg-white shadow-xl border border-gray-200'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-orange-600'
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
                  Post-Export ATS Validation
                </h3>
                <Button
                  onClick={() => {
                    setIsExpanded(false);
                    setValidationResult(null);
                  }}
                  variant='outline'
                  size='sm'
                  className='w-8 h-8 p-0'
                >
                  ×
                </Button>
              </div>

              <div className='space-y-4'>
                {!validationResult ? (
                  <div>
                    <p className='text-sm text-gray-600 mb-4'>
                      Validate your exported resume for ATS compatibility and
                      get improvement suggestions.
                    </p>
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
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='space-y-4'
                  >
                    {/* Score */}
                    <div className='text-center p-4 bg-slate-50 rounded-lg'>
                      <div className='text-3xl font-bold text-slate-900 mb-1'>
                        {validationResult.score}%
                      </div>
                      <p className='text-sm text-slate-600'>
                        ATS Compatibility Score
                      </p>
                    </div>

                    {/* Issues */}
                    {validationResult.issues.length > 0 && (
                      <div>
                        <h4 className='text-sm font-semibold text-red-600 mb-2'>
                          ⚠️ Issues Found
                        </h4>
                        <ul className='space-y-1'>
                          {validationResult.issues.map((issue, index) => (
                            <li
                              key={index}
                              className='text-sm text-red-600 bg-red-50 p-2 rounded'
                            >
                              • {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {validationResult.recommendations.length > 0 && (
                      <div>
                        <h4 className='text-sm font-semibold text-green-600 mb-2'>
                          💡 Recommendations
                        </h4>
                        <ul className='space-y-1'>
                          {validationResult.recommendations.map(
                            (rec, index) => (
                              <li
                                key={index}
                                className='text-sm text-green-700 bg-green-50 p-2 rounded'
                              >
                                • {rec}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Reset Button */}
                    <div className='flex justify-end pt-2'>
                      <Button
                        onClick={() => setValidationResult(null)}
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        Run New Validation
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingPostExportATSValidation;
