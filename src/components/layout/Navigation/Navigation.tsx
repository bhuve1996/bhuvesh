'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { UserProfile } from '@/components/auth';
import { ResumeDropdownContent } from '@/components/layout/ResumeDropdownContent';
import { Tooltip, UniversalTourTrigger } from '@/components/ui';
import { Icons } from '@/components/ui/SVG/SVG';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  COMMON_CLASSES,
  MAIN_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
} from '@/lib/constants';
import { useMultiResumeStore } from '@/store/multiResumeStore';
import { useResumeStore } from '@/store/resumeStore';
import type { NavigationProps } from '@/types';
import { NavItem } from '@/types';

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onSectionClick,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  // Multi-resume state
  const { loadGroups } = useMultiResumeStore();

  // Load groups on mount
  React.useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const mainNavItems: NavItem[] = MAIN_NAV_ITEMS.map(item => ({
    label: item.label,
    href: item.href,
  }));

  const secondaryNavItems: NavItem[] = SECONDARY_NAV_ITEMS.map(item => ({
    label: item.label,
    href: item.href,
  }));

  const handleNavClick = (item: NavItem) => {
    // Handle hash links like /#about
    if (item.href.includes('#')) {
      const sectionId = item.href.split('#')[1];
      if (sectionId && onSectionClick) {
        onSectionClick(sectionId);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (item: NavItem) => {
    // Handle hash links like /#about
    if (item.href.includes('#')) {
      const sectionId = item.href.split('#')[1];
      return activeSection === sectionId;
    }
    return false;
  };

  const handleResumeSelect = (_groupId: string, _variantId: string) => {
    // Load resume data into the main resume store
    const resume = useMultiResumeStore.getState().currentResume;
    if (resume) {
      useResumeStore.getState().setResumeData(resume.data);
    }
    setShowResumeDropdown(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`w-full bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 ${className || ''}`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className={`${COMMON_CLASSES.container} py-4`}>
        <div className='flex justify-between items-center min-h-[4rem]'>
          {/* Logo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href='/'
              className='group hover:opacity-90 transition-all duration-300'
              aria-label='Go to homepage'
            >
              <div className='relative'>
                <Image
                  src='/logo.png'
                  alt='Bhuvesh Logo'
                  width={128}
                  height={50}
                  className='w-24 h-8 sm:w-28 sm:h-10 lg:w-32 lg:h-[50px] rounded-lg object-cover group-hover:scale-105 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-primary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='hidden lg:flex items-center space-x-1 h-full flex-nowrap'
            data-tour='navigation'
          >
            {mainNavItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                {item.href.includes('#') ? (
                  <Tooltip
                    content={`Go to ${item.label} section`}
                    position='bottom'
                    delay={200}
                  >
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`relative px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base ${
                        isActive(item)
                          ? 'text-primary-400 bg-primary-500/10'
                          : 'text-foreground hover:text-primary-400 hover:bg-muted/50'
                      }`}
                      aria-current={isActive(item) ? 'page' : undefined}
                      tabIndex={0}
                    >
                      <span className='relative z-10'>{item.label}</span>
                      {isActive(item) && (
                        <div className='absolute inset-0 bg-primary-500/20 rounded-lg animate-pulse'></div>
                      )}
                      <div className='absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </Link>
                  </Tooltip>
                ) : (
                  <Tooltip
                    content={`Go to ${item.label} page`}
                    position='bottom'
                    delay={200}
                  >
                    <Link
                      href={item.href}
                      className='relative px-3 sm:px-4 py-2 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base'
                      tabIndex={0}
                    >
                      <span className='relative z-10'>{item.label}</span>
                      <div className='absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </Link>
                  </Tooltip>
                )}
              </motion.div>
            ))}

            {/* More Dropdown */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className='ml-2 relative'
            >
              <Tooltip content='More options' position='bottom' delay={200}>
                <button
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  className='flex items-center space-x-1 px-3 py-2 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base'
                >
                  <span>More</span>
                  <Icons.ChevronDown className='w-4 h-4' />
                </button>
              </Tooltip>

              {showMoreDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowMoreDropdown(false)}
                  />

                  {/* Dropdown */}
                  <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <div className='py-1'>
                      {secondaryNavItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShowMoreDropdown(false)}
                          className='block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Resume Dropdown */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className='ml-4 relative'
            >
              <Tooltip
                content='Manage your resumes'
                position='bottom'
                delay={200}
              >
                <button
                  onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                  className='flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                >
                  <span>📄 My Resumes</span>
                  <Icons.ChevronDown className='w-4 h-4' />
                </button>
              </Tooltip>

              {showResumeDropdown && (
                <>
                  {/* Backdrop */}
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowResumeDropdown(false)}
                  />

                  {/* Dropdown */}
                  <div className='absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <ResumeDropdownContent
                      onResumeSelect={handleResumeSelect}
                      onClose={() => setShowResumeDropdown(false)}
                    />
                  </div>
                </>
              )}
            </motion.div>

            {/* User Profile & Theme Toggle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className='ml-4 flex items-center gap-3 h-full'
            >
              <UserProfile />
              <ThemeToggle size='sm' />
              {/* Universal Tour Trigger - Shows appropriate tour for current page */}
              <Tooltip
                content='Take a guided tour of this page'
                position='bottom'
                delay={200}
              >
                <UniversalTourTrigger
                  variant='icon'
                  className='p-2 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
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
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </UniversalTourTrigger>
              </Tooltip>
            </motion.div>
          </motion.div>

          {/* Medium Screen Navigation (Tablet) */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='hidden md:flex lg:hidden items-center space-x-0.5 h-full flex-nowrap'
          >
            {mainNavItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <Tooltip
                  content={`Go to ${item.label} page`}
                  position='bottom'
                  delay={200}
                >
                  <Link
                    href={item.href}
                    className='relative px-2 py-2 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-xs'
                    tabIndex={0}
                  >
                    <span className='relative z-10'>{item.label}</span>
                    <div className='absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </Link>
                </Tooltip>
              </motion.div>
            ))}

            {/* More Dropdown for Medium Screens */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className='ml-1 relative'
            >
              <Tooltip content='More options' position='bottom' delay={200}>
                <button
                  onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                  className='flex items-center space-x-1 px-2 py-2 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-xs'
                >
                  <span>More</span>
                  <Icons.ChevronDown className='w-3 h-3' />
                </button>
              </Tooltip>

              {showMoreDropdown && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowMoreDropdown(false)}
                  />
                  <div className='absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <div className='py-1'>
                      {secondaryNavItems.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setShowMoreDropdown(false)}
                          className='block px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Resume Dropdown for Medium Screens */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className='ml-1 relative'
            >
              <Tooltip
                content='Manage your resumes'
                position='bottom'
                delay={200}
              >
                <button
                  onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                  className='flex items-center space-x-1 px-2 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-xs'
                >
                  <span>📄</span>
                  <Icons.ChevronDown className='w-3 h-3' />
                </button>
              </Tooltip>

              {showResumeDropdown && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowResumeDropdown(false)}
                  />
                  <div className='absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <ResumeDropdownContent
                      onResumeSelect={handleResumeSelect}
                      onClose={() => setShowResumeDropdown(false)}
                    />
                  </div>
                </>
              )}
            </motion.div>

            {/* User Profile & Theme Toggle for Medium Screens */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className='ml-1 flex items-center gap-1 h-full'
            >
              <UserProfile />
              <ThemeToggle size='sm' />
            </motion.div>
          </motion.div>

          {/* Mobile Navigation Controls */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className='md:hidden flex items-center gap-2'
          >
            {/* Resume Dropdown for Mobile */}
            <div className='relative'>
              <Tooltip
                content='Manage your resumes'
                position='bottom'
                delay={200}
              >
                <button
                  onClick={() => setShowResumeDropdown(!showResumeDropdown)}
                  className='flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm'
                >
                  <span>📄</span>
                  <Icons.ChevronDown className='w-3 h-3' />
                </button>
              </Tooltip>

              {showResumeDropdown && (
                <>
                  <div
                    className='fixed inset-0 z-40'
                    onClick={() => setShowResumeDropdown(false)}
                  />
                  <div className='absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] sm:right-0 sm:left-auto left-1/2 sm:left-auto sm:transform-none transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50'>
                    <ResumeDropdownContent
                      onResumeSelect={handleResumeSelect}
                      onClose={() => setShowResumeDropdown(false)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* User Profile & Theme Toggle for Mobile */}
            <div className='flex items-center gap-2'>
              <UserProfile />
              <ThemeToggle size='sm' />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='relative p-2 text-foreground hover:text-primary-400 hover:bg-muted/50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }
              }}
              aria-label='Toggle mobile menu'
              aria-expanded={isMobileMenuOpen}
              aria-controls='mobile-menu'
              tabIndex={0}
            >
              <div className='relative w-6 h-6'>
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-1'}`}
                ></span>
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                ></span>
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-1'}`}
                ></span>
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id='mobile-menu'
              data-testid='mobile-menu'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='lg:hidden overflow-hidden'
              role='navigation'
              aria-label='Mobile navigation'
              aria-hidden={!isMobileMenuOpen}
            >
              <div className='pt-4 pb-4 border-t border-border'>
                <div className='flex flex-col space-y-2'>
                  {mainNavItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {item.href.includes('#') ? (
                        <Link
                          href={item.href}
                          onClick={() => handleNavClick(item)}
                          className={`px-4 py-3 rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base ${
                            isActive(item)
                              ? 'text-primary-400 bg-primary-500/10 border border-primary-500/20'
                              : 'text-foreground hover:text-primary-400 hover:bg-muted/50'
                          }`}
                          aria-current={isActive(item) ? 'page' : undefined}
                          tabIndex={0}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <Link
                          href={item.href}
                          className='px-4 py-3 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base'
                          onClick={() => setIsMobileMenuOpen(false)}
                          tabIndex={0}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}

                  {/* Resume Management Section */}
                  <div className='pt-2 border-t border-border'>
                    <div className='px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                      Resume Management
                    </div>
                    <div className='px-4 py-2'>
                      <ResumeDropdownContent
                        onResumeSelect={(groupId, variantId) => {
                          handleResumeSelect(groupId, variantId);
                          setIsMobileMenuOpen(false);
                        }}
                        onClose={() => setIsMobileMenuOpen(false)}
                      />
                    </div>
                  </div>

                  {/* Secondary Navigation Items */}
                  <div className='pt-2 border-t border-border'>
                    <div className='px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider'>
                      More
                    </div>
                    <div className='flex flex-col space-y-1'>
                      {secondaryNavItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: (mainNavItems.length + index) * 0.1,
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className='px-4 py-3 rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm sm:text-base text-foreground hover:text-primary-400 hover:bg-muted/50'
                            tabIndex={0}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
