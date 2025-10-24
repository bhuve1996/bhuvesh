'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button/Button';

interface DataChoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUseUserData: () => void;
  onUseSampleData: () => void;
}

export const DataChoiceDialog: React.FC<DataChoiceDialogProps> = ({
  isOpen,
  onClose,
  onUseUserData,
  onUseSampleData,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className='bg-white rounded-xl shadow-2xl p-6 max-w-md w-full relative'
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors'
              aria-label='Close dialog'
            >
              <svg
                className='w-5 h-5'
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

            <h3 className='text-xl font-bold text-slate-900 mb-4 pr-8'>
              Choose Data Source
            </h3>
            <p className='text-slate-600 mb-6'>
              We found your existing resume data. Would you like to use it for
              the preview, or use sample data instead?
            </p>

            <div className='space-y-3'>
              <Button
                onClick={onUseUserData}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white'
              >
                Use My Resume Data
              </Button>
              <Button
                onClick={onUseSampleData}
                variant='outline'
                className='w-full'
              >
                Use Sample Data
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
