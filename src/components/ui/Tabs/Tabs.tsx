'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import type { TabsProps } from '@/types';

export const Tabs: React.FC<TabsProps> = ({
  items,
  defaultActiveTab,
  className = '',
  variant = 'default',
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || items[0]?.id);

  const activeTabContent = items.find(item => item.id === activeTab);

  const getTabVariantClasses = () => {
    switch (variant) {
      case 'pills':
        return {
          container: 'bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg',
          tab: 'px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-300',
          activeTab: 'bg-cyan-500 text-white shadow-lg',
          inactiveTab:
            'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50',
        };
      case 'underline':
        return {
          container: 'border-b border-slate-200 dark:border-slate-700',
          tab: 'px-4 py-2 text-sm font-medium transition-all duration-300 relative',
          activeTab: 'text-cyan-500 dark:text-cyan-400',
          inactiveTab:
            'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white',
        };
      default:
        return {
          container:
            'bg-slate-100 dark:bg-slate-800/30 p-1 rounded-lg border border-slate-200 dark:border-slate-700',
          tab: 'px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-300',
          activeTab: 'bg-cyan-500 text-white shadow-lg',
          inactiveTab:
            'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700/50',
        };
    }
  };

  const variantClasses = getTabVariantClasses();

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Headers */}
      <div className={`flex gap-1 ${variantClasses.container}`}>
        {items.map(item => (
          <motion.button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${variantClasses.tab} ${
              activeTab === item.id
                ? variantClasses.activeTab
                : variantClasses.inactiveTab
            }`}
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            <div className='flex items-center gap-1.5'>
              {item.icon && <span className='text-sm'>{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && (
                <span className='px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-xs'>
                  {item.badge}
                </span>
              )}
            </div>
            {variant === 'underline' && activeTab === item.id && (
              <motion.div
                className='absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400'
                layoutId='activeTab'
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode='wait'>
        {activeTabContent && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='mt-6'
          >
            {activeTabContent.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tabs;
