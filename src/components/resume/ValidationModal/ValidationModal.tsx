'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import { Button } from '@/components/ui/Button';
import {
  ValidationResult,
  getValidationMessages,
} from '@/lib/resume/validation';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  validationResult: ValidationResult;
  actionType: 'save' | 'export';
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  validationResult,
  actionType,
}) => {
  const messages = getValidationMessages(validationResult);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden'
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-bold'>
                  {actionType === 'save' ? 'Save Resume' : 'Export Resume'}
                </h2>
                <p className='text-blue-100 mt-1'>Validation Check</p>
              </div>
              <button
                onClick={onClose}
                className='text-white/80 hover:text-white transition-colors'
              >
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
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='p-6 overflow-y-auto max-h-[60vh]'>
            {/* Status Message */}
            <div
              className={`p-4 rounded-lg mb-6 ${
                messages.canProceed
                  ? validationResult.isValid
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className='flex items-start space-x-3'>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    messages.canProceed
                      ? validationResult.isValid
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                >
                  {validationResult.isValid ? (
                    <svg
                      className='w-4 h-4 text-white'
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
                  ) : (
                    <svg
                      className='w-4 h-4 text-white'
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
                  )}
                </div>
                <div>
                  <p
                    className={`font-medium ${
                      messages.canProceed
                        ? validationResult.isValid
                          ? 'text-green-800'
                          : 'text-yellow-800'
                        : 'text-red-800'
                    }`}
                  >
                    {messages.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Details */}
            {messages.details.length > 0 && (
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900'>Details:</h3>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <ul className='space-y-2 text-sm text-gray-700'>
                    {messages.details.map((detail, index) => (
                      <li
                        key={index}
                        className={detail.startsWith('•') ? 'ml-4' : ''}
                      >
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {validationResult.missingRequired.length > 0 && (
              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <h4 className='font-medium text-blue-900 mb-2'>
                  Quick Actions:
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {validationResult.missingRequired.map(section => (
                    <button
                      key={section}
                      onClick={() => {
                        // This would scroll to the section in the resume builder
                        onClose();
                        // Emit event or use context to navigate to section
                        window.dispatchEvent(
                          new CustomEvent('navigate-to-section', {
                            detail: {
                              section: section
                                .toLowerCase()
                                .replace(/\s+/g, '-'),
                            },
                          })
                        );
                      }}
                      className='px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm rounded-full transition-colors'
                    >
                      Add {section}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='bg-gray-50 px-6 py-4 flex items-center justify-between'>
            <div className='text-sm text-gray-600'>
              {validationResult.isValid
                ? 'All required fields are complete'
                : `${validationResult.missingRequired.length} required section(s) missing`}
            </div>
            <div className='flex space-x-3'>
              <Button variant='outline' onClick={onClose} className='px-6'>
                Cancel
              </Button>
              <Button
                onClick={onProceed}
                disabled={!messages.canProceed}
                className={`px-6 ${
                  messages.canProceed
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {messages.canProceed
                  ? `${actionType === 'save' ? 'Save' : 'Export'} Anyway`
                  : 'Complete Required Fields'}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ValidationModal;
