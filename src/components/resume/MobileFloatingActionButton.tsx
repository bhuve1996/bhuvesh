'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button/Button';

interface MobileFloatingActionButtonProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const MobileFloatingActionButton: React.FC<
  MobileFloatingActionButtonProps
> = ({ isVisible, onToggle }) => {
  if (!isVisible) return null;

  return (
    <div className='fixed bottom-20 right-4 z-50 sm:hidden'>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={onToggle}
          className='w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
          aria-label='Export Resume'
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
              d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
        </Button>
      </motion.div>
    </div>
  );
};
