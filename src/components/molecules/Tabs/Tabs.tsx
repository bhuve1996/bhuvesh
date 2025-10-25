import React, { useEffect, useRef, useState } from 'react';

import type { TabsProps } from '@/types/ui';

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeTab: controlledActiveTab,
  defaultActiveTab,
  className = '',
  variant: _variant = 'default',
  onTabChange,
  ...props
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(
    defaultActiveTab || items[0]?.id || ''
  );

  // Use controlled activeTab if provided, otherwise use internal state
  const activeTab =
    controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  const handleTabChange = (tabId: string) => {
    // Only update internal state if not controlled
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  // Check scroll position and update indicators
  const checkScrollPosition = () => {
    if (navRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Check scroll position on mount and when items change
  useEffect(() => {
    checkScrollPosition();
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', checkScrollPosition);
      return () => nav.removeEventListener('scroll', checkScrollPosition);
    }
    return undefined;
  }, [items]);

  // Scroll to show more tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    if (navRef.current) {
      const scrollAmount = 200; // Adjust scroll distance
      const currentScroll = navRef.current.scrollLeft;
      const newScroll =
        direction === 'left'
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      navRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`tabs flex flex-col h-full ${className}`} {...props}>
      {/* Tab Navigation */}
      <div className='border-b border-gray-200 flex-shrink-0'>
        <div className='px-4 sm:px-6 lg:px-8'>
          <div className='relative'>
            {/* Left scroll indicator */}
            {canScrollLeft && (
              <button
                onClick={() => scrollTabs('left')}
                className='absolute left-0 top-0 bottom-0 z-10 bg-white/80 hover:bg-white dark:bg-neutral-900/80 dark:hover:bg-neutral-900 flex items-center justify-center w-8 transition-all duration-200'
                aria-label='Scroll left to see more tabs'
              >
                <svg
                  className='w-4 h-4 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
            )}

            {/* Right scroll indicator */}
            {canScrollRight && (
              <button
                onClick={() => scrollTabs('right')}
                className='absolute right-0 top-0 bottom-0 z-10 bg-white/80 hover:bg-white dark:bg-neutral-900/80 dark:hover:bg-neutral-900 flex items-center justify-center w-8 transition-all duration-200'
                aria-label='Scroll right to see more tabs'
              >
                <svg
                  className='w-4 h-4 text-gray-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            )}

            {/* Fade gradients to indicate more content */}
            {canScrollLeft && (
              <div className='absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent dark:from-neutral-900 z-5 pointer-events-none' />
            )}
            {canScrollRight && (
              <div className='absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent dark:from-neutral-900 z-5 pointer-events-none' />
            )}

            <nav
              ref={navRef}
              className='-mb-px flex space-x-2 sm:space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide bg-slate-50/80 dark:bg-slate-800/50 border-b-2 border-slate-200 dark:border-slate-600 shadow-sm dark:shadow-slate-900/10 px-2 py-1 rounded-t-lg'
            >
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`
                    py-2 px-3 border-b-2 font-medium text-xs sm:text-sm transition-all duration-300 whitespace-nowrap flex-shrink-0 rounded-t-md
                    ${
                      activeTab === item.id
                        ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-white dark:bg-slate-700/50 shadow-sm'
                        : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/30'
                    }
                    cursor-pointer
                  `}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
        {items.find(item => item.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
