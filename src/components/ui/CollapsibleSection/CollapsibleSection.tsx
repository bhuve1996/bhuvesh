import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode } from 'react';

import { ChevronIcon } from '../ChevronIcon';

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  color: 'green' | 'purple' | 'orange' | 'blue' | 'cyan' | 'primary';
  count: number;
  countLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  color,
  count,
  countLabel,
  isExpanded,
  onToggle,
  children,
}) => {
  const colorClasses = {
    green: {
      border: 'border-l-green-500',
      bg: 'bg-green-500/10',
      text: 'text-green-500',
      countBg: 'bg-green-500/10',
    },
    purple: {
      border: 'border-l-purple-500',
      bg: 'bg-purple-500/10',
      text: 'text-purple-500',
      countBg: 'bg-purple-500/10',
    },
    orange: {
      border: 'border-l-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      countBg: 'bg-orange-500/10',
    },
    blue: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      countBg: 'bg-blue-500/10',
    },
    cyan: {
      border: 'border-l-cyan-500',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-500',
      countBg: 'bg-cyan-500/10',
    },
    primary: {
      border: 'border-l-primary-500',
      bg: 'bg-primary-500/10',
      text: 'text-primary-500',
      countBg: 'bg-primary-500/10',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-4 sm:p-6 border-l-4 ${colors.border}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className='flex items-start sm:items-center justify-between cursor-pointer mb-4 sm:mb-6 gap-3'
        onClick={onToggle}
      >
        <div className='flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0'>
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}
          >
            <span className='text-lg sm:text-2xl'>{icon}</span>
          </div>
          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0 flex-1'>
            <h3 className='text-base sm:text-xl font-bold text-foreground uppercase tracking-wide truncate'>
              {title}
            </h3>
            <span
              className={`text-xs sm:text-sm text-muted-foreground ${colors.countBg} px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0`}
            >
              {count} {countLabel}
            </span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3 }}
          className='flex-shrink-0'
        >
          <ChevronIcon
            direction={isExpanded ? 'up' : 'down'}
            className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`}
          />
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='space-y-4 overflow-hidden'
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CollapsibleSection;
