'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';
import { ResumeAnalytics } from '@/lib/analytics/resume-analytics';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';

interface FloatingActionsProps {
  resumeData: ResumeData;
  onSave: () => void;
  className?: string;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  resumeData,
  onSave,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const { setResumeData, setShowDataChoice, selectedTemplate } =
    useResumeStore();

  const handlePreviewWithTemplates = () => {
    // Track analytics event
    ResumeAnalytics.trackPreviewOpened({
      templateId: selectedTemplate?.id || 'default',
      templateName: selectedTemplate?.name || 'Default Template',
    });

    // Save current data to store and trigger data choice dialog
    setResumeData(resumeData);
    setShowDataChoice(true);
    router.push('/resume/templates');
  };

  const handleEditResume = () => {
    // This would scroll to the top of the builder or switch to edit mode
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsExpanded(false);
  };

  const handleSaveResume = () => {
    onSave();
    setIsExpanded(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className='mb-4 space-y-3'
          >
            {/* Preview with Templates */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tooltip
                content='Preview your resume with different templates'
                position='left'
                delay={200}
              >
                <Button
                  onClick={handlePreviewWithTemplates}
                  className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                  size='sm'
                >
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
                      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                    />
                  </svg>
                  Preview with Templates
                </Button>
              </Tooltip>
            </motion.div>

            {/* Edit Resume */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tooltip
                content='Scroll to top to continue editing your resume'
                position='left'
                delay={200}
              >
                <Button
                  onClick={handleEditResume}
                  variant='outline'
                  className='w-full bg-white hover:bg-gray-50 border-2 border-cyan-500 text-cyan-600 hover:text-cyan-700 shadow-lg hover:shadow-xl transition-all duration-200'
                  size='sm'
                >
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
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                  Edit Resume
                </Button>
              </Tooltip>
            </motion.div>

            {/* Save Resume */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tooltip
                content='Save your resume data to continue later'
                position='left'
                delay={200}
              >
                <Button
                  onClick={handleSaveResume}
                  className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-200'
                  size='sm'
                >
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
                      d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4'
                    />
                  </svg>
                  Save Resume
                </Button>
              </Tooltip>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Action Button */}
      <Tooltip
        content={isExpanded ? 'Close actions menu' : 'Open actions menu'}
        position='left'
        delay={200}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
              isExpanded
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
            }`}
            aria-label={
              isExpanded
                ? 'Close floating actions menu'
                : 'Open floating actions menu'
            }
          >
            <motion.svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d={
                  isExpanded
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M12 6v6m0 0v6m0-6h6m-6 0H6'
                }
              />
            </motion.svg>
          </Button>
        </motion.div>
      </Tooltip>
    </div>
  );
};

export default FloatingActions;
