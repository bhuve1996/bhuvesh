'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Tabs } from '@/components/molecules/Tabs/Tabs';
import { createFocusTrap, createKeyboardHandlers } from '@/lib/accessibility';
import { cn } from '@/lib/design-tokens';
import { FloatingPanelProps, PanelTab } from '@/types';

import { AIContentTab } from './tabs/AIContentTab';
import { ATSAnalysisTab } from './tabs/ATSAnalysisTab';
import { ExportTab } from './tabs/ExportTab';
import { TemplateCustomizerTab } from './tabs/TemplateCustomizerTab';
import { ValidationTab } from './tabs/ValidationTab';

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  resumeData,
  template,
  onTemplateChange,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('export');
  const panelRef = useRef<HTMLDivElement>(null);

  const togglePanel = () => {
    setIsVisible(!isVisible);
    if (!isVisible) {
      setIsExpanded(false);
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const closePanel = () => {
    setIsVisible(false);
    setIsExpanded(false);
  };

  // Focus management and body scroll lock
  useEffect(() => {
    if (isVisible && panelRef.current) {
      const firstFocusable = panelRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
    return undefined;
  }, [isVisible]);

  // Body scroll lock for mobile when panel is open
  useEffect(() => {
    if (isVisible) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      // Prevent scroll on touch devices
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else {
      // Restore body scroll
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.removeAttribute('data-scroll-y');

      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      const scrollY = document.body.getAttribute('data-scroll-y');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.removeAttribute('data-scroll-y');

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY, 10));
      }
    };
  }, [isVisible]);

  // Keyboard handlers
  const handleKeyDown = createKeyboardHandlers({
    onEscape: closePanel,
  });

  // Focus trap
  useEffect(() => {
    if (isVisible && panelRef.current) {
      const handleFocusTrap = createFocusTrap(
        panelRef as React.RefObject<HTMLElement>,
        closePanel
      );
      document.addEventListener('keydown', handleFocusTrap);
      return () => document.removeEventListener('keydown', handleFocusTrap);
    }
    return undefined;
  }, [isVisible]);

  const tabItems = [
    {
      id: 'export',
      label: 'Export',
      content: (
        <ExportTab
          resumeData={resumeData}
          template={template}
          onTemplateChange={onTemplateChange}
        />
      ),
    },
    {
      id: 'customize',
      label: 'Customize',
      content: (
        <TemplateCustomizerTab
          template={template}
          onTemplateChange={onTemplateChange}
        />
      ),
    },
    {
      id: 'ats',
      label: 'ATS Analysis',
      content: <ATSAnalysisTab resumeData={resumeData} />,
    },
    {
      id: 'ai',
      label: 'AI Content',
      content: (
        <AIContentTab
          data={resumeData}
          onDataUpdate={_updatedData => {
            // Handle data updates from AI analysis
          }}
        />
      ),
    },
    {
      id: 'validate',
      label: 'Validate',
      content: <ValidationTab resumeData={resumeData} />,
    },
  ];

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50',
        className
      )}
      {...props}
    >
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isVisible && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='relative group'
          >
            <Button
              onClick={togglePanel}
              variant='primary'
              size='lg'
              className='rounded-full shadow-lg hover:shadow-xl text-sm sm:text-base'
              aria-label='Open resume tools panel'
              aria-expanded={isVisible}
              aria-haspopup='dialog'
              data-testid='floating-action-button'
              icon={
                <svg
                  className='w-5 h-5 sm:w-6 sm:h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                  />
                </svg>
              }
            >
              <span className='hidden sm:inline'>Quick Actions</span>
              <span className='sm:hidden'>Tools</span>
            </Button>

            <div className='absolute bottom-full right-0 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs sm:text-sm rounded-lg whitespace-nowrap hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
              Access ATS analysis, AI improvements, and more
              <div className='absolute top-full right-4 border-4 border-transparent border-t-neutral-900'></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={panelRef}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cn(
              'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden overflow-y-auto',
              // Mobile: Full width with margins, Tablet: Fixed width, Desktop: Responsive width
              'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-sm sm:max-w-md md:max-w-lg',
              'sm:w-80 sm:h-96',
              'md:w-96 md:h-[600px]',
              isExpanded && 'md:w-[500px] md:h-[700px]'
            )}
            role='dialog'
            aria-modal='true'
            aria-labelledby='panel-title'
            aria-describedby='panel-description'
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className='flex items-center justify-between p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-700'>
              <h3
                id='panel-title'
                className='text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100'
              >
                Resume Tools
              </h3>
              <p id='panel-description' className='sr-only'>
                Panel containing resume analysis, AI improvements,
                customization, validation, and export tools
              </p>
              <div className='flex items-center gap-1 sm:gap-2'>
                <div className='relative group hidden md:block'>
                  <Button
                    onClick={toggleExpanded}
                    variant='ghost'
                    size='sm'
                    className='p-2'
                    aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
                    icon={
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d={
                            isExpanded
                              ? 'M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5'
                              : 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
                          }
                        />
                      </svg>
                    }
                  >
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                  {/* Tooltip */}
                  <div className='absolute top-full right-0 mt-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
                    {isExpanded ? 'Collapse panel' : 'Expand panel'}
                    <div className='absolute bottom-full right-4 border-4 border-transparent border-b-neutral-900'></div>
                  </div>
                </div>

                <div className='relative group'>
                  <Button
                    onClick={closePanel}
                    variant='ghost'
                    size='sm'
                    className='p-2'
                    aria-label='Close panel'
                    icon={
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        aria-hidden='true'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    }
                  >
                    Close
                  </Button>
                  {/* Tooltip */}
                  <div className='absolute top-full right-0 mt-2 px-3 py-2 bg-neutral-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                    Close panel
                    <div className='absolute bottom-full right-4 border-4 border-transparent border-b-neutral-900'></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className={cn(
                'panel-content flex-1 flex flex-col min-h-0',
                'w-full h-full'
              )}
            >
              <Tabs
                items={tabItems}
                defaultActiveTab={activeTab}
                onTabChange={tabId => setActiveTab(tabId as PanelTab)}
                className='flex-1 flex flex-col h-full'
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingPanel;
