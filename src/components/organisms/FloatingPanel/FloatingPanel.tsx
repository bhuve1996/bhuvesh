'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Tabs } from '@/components/molecules/Tabs/Tabs';
import { useDraggablePanel } from '@/hooks/useDraggablePanel';
import { createFocusTrap, createKeyboardHandlers } from '@/lib/accessibility';
import { cn } from '@/lib/design-tokens';
import { FloatingPanelProps, PanelTab } from '@/types';

import { ATSAnalysisTab } from './tabs/ATSAnalysisTab';
import { ExportTab } from './tabs/ExportTab';
import { PageBreaksTab } from './tabs/PageBreaksTab';
import { TemplateCustomizerTab } from './tabs/TemplateCustomizerTab';
import { ValidationTab } from './tabs/ValidationTab';

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  resumeData,
  template,
  onTemplateChange,
  resumeElement,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('export');
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize draggable panel functionality (disabled on mobile)
  const { isDragging, dragHandleProps, panelStyle, resetPosition } =
    useDraggablePanel({
      initialPosition: { x: 0, y: 100 }, // Will be overridden by saved position or default
      boundary: 'viewport',
      persistPosition: true,
      storageKey: 'floating-panel-position',
    });

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
    if (isVisible && isMobile) {
      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent body scroll on mobile only
      document.body.style.overflow = 'hidden';
      // Prevent scroll on touch devices
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    } else if (!isVisible) {
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
  }, [isVisible, isMobile]);

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
      'data-tour': 'export-tab',
      content: (
        <ExportTab
          resumeData={resumeData}
          template={template}
          onTemplateChange={onTemplateChange}
          resumeElement={resumeElement || null}
        />
      ),
    },
    {
      id: 'page-breaks',
      label: 'Page Breaks',
      'data-tour': 'page-breaks-tab',
      content: (
        <PageBreaksTab
          resumeData={resumeData}
          template={template}
          onTemplateChange={onTemplateChange}
          resumeElement={resumeElement || null}
        />
      ),
    },
    {
      id: 'customize',
      label: 'Customize',
      'data-tour': 'customize-tab',
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
      'data-tour': 'ats-tab',
      content: <ATSAnalysisTab resumeData={resumeData} />,
    },
    {
      id: 'validate',
      label: 'Validate',
      'data-tour': 'validation-tab',
      content: <ValidationTab resumeData={resumeData} />,
    },
  ];

  return (
    <>
      {/* Mobile Side Button */}
      <AnimatePresence>
        {isMobile && !isVisible && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='fixed right-4 top-1/2 -translate-y-1/2 z-50'
          >
            <Button
              onClick={togglePanel}
              variant='primary'
              size='lg'
              className='rounded-l-full rounded-r-none shadow-lg hover:shadow-xl text-sm px-4 py-3'
              aria-label='Open resume builder tools panel'
              aria-expanded={isVisible}
              aria-haspopup='dialog'
              data-testid='mobile-side-button'
              icon={
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  aria-hidden='true'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              }
            >
              Tools
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Floating Action Button */}
      <div
        className={cn(
          'fixed bottom-20 right-8 sm:bottom-24 sm:right-12 z-50',
          isMobile && 'hidden', // Hide desktop button on mobile
          className
        )}
        {...props}
      >
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
                aria-label='Open resume builder tools panel'
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
                <span className='hidden sm:inline'>Resume Builder</span>
                <span className='sm:hidden'>Builder</span>
              </Button>

              <div className='absolute bottom-full right-0 mb-2 px-3 py-2 bg-neutral-900 text-white text-xs sm:text-sm rounded-lg whitespace-nowrap hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
                Build, customize, and export your resume with professional tools
                <div className='absolute top-full right-4 border-4 border-transparent border-t-neutral-900'></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={panelRef}
            initial={
              isMobile
                ? { x: '100%', opacity: 0 }
                : { scale: 0.8, opacity: 0, y: 20 }
            }
            animate={
              isMobile ? { x: 0, opacity: 1 } : { scale: 1, opacity: 1, y: 0 }
            }
            exit={
              isMobile
                ? { x: '100%', opacity: 0 }
                : { scale: 0.8, opacity: 0, y: 20 }
            }
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={
              isMobile
                ? {
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 50,
                  }
                : {
                    position: 'fixed',
                    left: `${panelStyle.left}`,
                    top: `${panelStyle.top}`,
                    zIndex: 50,
                    transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                    transition: isDragging
                      ? 'none'
                      : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: isDragging ? 'transform, left, top' : 'auto',
                  }
            }
            className={cn(
              'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 overflow-hidden flex flex-col',
              // Mobile: Full height slide-in panel
              isMobile
                ? 'w-[calc(100vw-2rem)] max-w-sm h-full rounded-l-xl'
                : cn(
                    'rounded-xl',
                    // Desktop: Responsive width
                    'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)] max-w-sm sm:max-w-md md:max-w-lg',
                    'sm:w-80 sm:h-96',
                    'md:w-96 md:h-[600px]',
                    isExpanded && 'md:w-[500px] md:h-[700px]',
                    isDragging &&
                      'shadow-3xl ring-2 ring-cyan-500/20 dark:ring-cyan-400/20'
                  )
            )}
            role='dialog'
            aria-modal='true'
            aria-labelledby='panel-title'
            aria-describedby='panel-description'
            onKeyDown={handleKeyDown}
          >
            {/* Header */}
            <div className='flex items-center justify-between p-2 sm:p-3 border-b border-neutral-200 dark:border-neutral-700 flex-shrink-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md'>
              {/* Drag Handle - Hidden on mobile */}
              {!isMobile && (
                <div
                  {...dragHandleProps}
                  className={cn(
                    'flex items-center gap-1.5 flex-1 cursor-grab active:cursor-grabbing min-w-0',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md p-1 -m-1 transition-all duration-200',
                    'hover:shadow-sm dark:hover:shadow-neutral-900/20',
                    isDragging &&
                      'cursor-grabbing bg-neutral-100 dark:bg-neutral-800'
                  )}
                  title='Drag to move panel'
                >
                  <svg
                    className={cn(
                      'w-3.5 h-3.5 flex-shrink-0 transition-colors duration-200',
                      'text-neutral-400 dark:text-neutral-500',
                      isDragging && 'text-neutral-600 dark:text-neutral-300'
                    )}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 8h16M4 16h16'
                    />
                  </svg>
                  <h3
                    id='panel-title'
                    className={cn(
                      'text-sm sm:text-base font-semibold truncate transition-colors duration-200',
                      'text-neutral-900 dark:text-neutral-100',
                      isDragging && 'text-neutral-800 dark:text-neutral-200'
                    )}
                  >
                    Resume Tools
                  </h3>
                </div>
              )}

              {/* Mobile Title */}
              {isMobile && (
                <h3
                  id='panel-title'
                  className='text-base font-semibold text-neutral-900 dark:text-neutral-100 flex-1'
                >
                  Resume Tools
                </h3>
              )}
              <p id='panel-description' className='sr-only'>
                Panel containing resume analysis, customization, validation, and
                export tools
              </p>
              <div className='flex items-center gap-0.5 sm:gap-1 flex-shrink-0'>
                {/* Reset Position Button - Hidden on mobile */}
                {!isMobile && (
                  <div className='relative group'>
                    <Button
                      onClick={resetPosition}
                      variant='ghost'
                      size='sm'
                      className='p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200'
                      aria-label='Reset panel position'
                      icon={
                        <svg
                          className='w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          aria-hidden='true'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                          />
                        </svg>
                      }
                    />
                    {/* Tooltip */}
                    <div className='absolute top-full right-0 mt-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
                      Reset panel position
                      <div className='absolute bottom-full right-4 border-4 border-transparent border-b-neutral-900 dark:border-b-neutral-100'></div>
                    </div>
                  </div>
                )}

                <div className='relative group hidden md:block'>
                  <Button
                    onClick={toggleExpanded}
                    variant='ghost'
                    size='sm'
                    className='p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200'
                    aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
                    icon={
                      <svg
                        className='w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400'
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
                  />
                  {/* Tooltip */}
                  <div className='absolute top-full right-0 mt-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10'>
                    {isExpanded ? 'Collapse panel' : 'Expand panel'}
                    <div className='absolute bottom-full right-4 border-4 border-transparent border-b-neutral-900 dark:border-b-neutral-100'></div>
                  </div>
                </div>

                <div className='relative group'>
                  <Button
                    onClick={closePanel}
                    variant='ghost'
                    size='sm'
                    className='p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200'
                    aria-label='Close panel'
                    icon={
                      <svg
                        className='w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400'
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
                  />
                  {/* Tooltip */}
                  <div className='absolute top-full right-0 mt-2 px-3 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                    Close panel
                    <div className='absolute bottom-full right-4 border-4 border-transparent border-b-neutral-900 dark:border-b-neutral-100'></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className={cn(
                'panel-content flex-1 flex flex-col min-h-0 overflow-y-auto',
                'w-full'
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
    </>
  );
};

export default FloatingPanel;
