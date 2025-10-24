'use client';

import { motion } from 'framer-motion';

interface CollapsedCarouselHintProps {
  isVisible: boolean;
  onShowCarousel: () => void;
}

export const CollapsedCarouselHint: React.FC<CollapsedCarouselHintProps> = ({
  isVisible,
  onShowCarousel,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className='fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30'
    >
      <button
        onClick={onShowCarousel}
        className='bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2 transition-colors duration-200'
      >
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
            d='M19 9l-7 7-7-7'
          />
        </svg>
        <span>Click to show templates</span>
      </button>
    </motion.div>
  );
};
