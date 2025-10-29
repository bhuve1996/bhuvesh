'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingNavigationProps {
  className?: string;
}

export const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const handleNavigateToBuilder = () => {
    router.push('/resume/builder');
    setIsExpanded(false);
  };

  const handleNavigateToTemplates = () => {
    router.push('/resume/templates');
    setIsExpanded(false);
  };

  const handleNavigateToATSChecker = () => {
    router.push('/resume/ats-checker');
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 print:hidden ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className='mb-4 space-y-3'
          >
            {/* Resume Builder Button */}
            <Tooltip content='Go to Resume Builder' position='left'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={handleNavigateToBuilder}
                  variant='primary'
                  size='lg'
                  className={`
                    w-full sm:w-auto px-6 py-3 rounded-lg shadow-lg hover:shadow-xl
                    transition-all duration-200 transform hover:scale-105 active:scale-95
                    ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    }
                    text-white font-medium
                  `}
                >
                  <span className='flex items-center space-x-3'>
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
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                    <span className='text-base font-semibold'>
                      Resume Builder
                    </span>
                  </span>
                </Button>
              </motion.div>
            </Tooltip>

            {/* Templates Button */}
            <Tooltip content='View Resume Templates' position='left'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  onClick={handleNavigateToTemplates}
                  variant='secondary'
                  size='lg'
                  className={`
                    w-full sm:w-auto px-6 py-3 rounded-lg shadow-lg hover:shadow-xl
                    transition-all duration-200 transform hover:scale-105 active:scale-95
                    ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border border-emerald-400/30'
                    }
                    text-white font-medium
                  `}
                >
                  <span className='flex items-center space-x-3'>
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
                        d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                      />
                    </svg>
                    <span className='text-base font-semibold'>Templates</span>
                  </span>
                </Button>
              </motion.div>
            </Tooltip>

            {/* ATS Checker Button */}
            <Tooltip content='ATS Resume Checker' position='left'>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleNavigateToATSChecker}
                  variant='secondary'
                  size='lg'
                  className={`
                    w-full sm:w-auto px-6 py-3 rounded-lg shadow-lg hover:shadow-xl
                    transition-all duration-200 transform hover:scale-105 active:scale-95
                    ${
                      theme === 'dark'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 border border-purple-500/30'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border border-purple-400/30'
                    }
                    text-white font-medium
                  `}
                >
                  <span className='flex items-center space-x-3'>
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
                    <span className='text-base font-semibold'>ATS Checker</span>
                  </span>
                </Button>
              </motion.div>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Tooltip
          content={isExpanded ? 'Close Menu' : 'Open Menu'}
          position='left'
        >
          <Button
            onClick={toggleExpanded}
            variant='primary'
            size='lg'
            className={`
              ${isExpanded ? 'w-auto px-4 py-3' : 'w-16 h-16'} rounded-full shadow-lg hover:shadow-xl
              transition-all duration-200 flex items-center justify-center
              ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
              }
              text-white font-semibold
            `}
            aria-label={isExpanded ? 'Close navigation' : 'Open navigation'}
          >
            <motion.div
              className='flex items-center space-x-2'
              animate={{ scale: isExpanded ? 1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <motion.svg
                className='w-7 h-7'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d={
                    isExpanded
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </motion.svg>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className='text-base font-semibold whitespace-nowrap'
                >
                  Close
                </motion.span>
              )}
            </motion.div>
          </Button>
        </Tooltip>
      </motion.div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/20 backdrop-blur-sm sm:hidden'
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};
