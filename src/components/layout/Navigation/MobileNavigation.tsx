'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { UserProfile } from '@/components/auth';
import { ResumeDropdownContent } from '@/components/layout/ResumeDropdownContent';
import { Tooltip } from '@/components/ui';
import { Icons } from '@/components/ui/SVG/SVG';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/lib/constants';
import {
  getButtonClasses,
  getNavigationClasses,
  navigationSizing,
} from '@/lib/design-system/navigation';
import { useMultiResumeStore } from '@/store/multiResumeStore';
import { useResumeStore } from '@/store/resumeStore';
import { NavItem } from '@/types';

interface MobileNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  showResumeDropdown: boolean;
  setShowResumeDropdown: (show: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeSection,
  onSectionClick,
  showResumeDropdown,
  setShowResumeDropdown,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  screenSize,
}) => {
  const { theme } = useTheme();
  const { loadGroups } = useMultiResumeStore();

  // Load groups on mount
  React.useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Handle escape key to close dropdown
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showResumeDropdown) {
        setShowResumeDropdown(false);
      }
    };

    if (showResumeDropdown) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
    return undefined;
  }, [showResumeDropdown, setShowResumeDropdown]);

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

  const classes = getNavigationClasses(theme, screenSize);

  return (
    <>
      {/* Mobile Navigation Controls */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className={classes.mobileControls}
      >
        {/* Resume Dropdown for Mobile */}
        <div className='relative'>
          <Tooltip content='Manage your resumes' position='bottom' delay={200}>
            <button
              onClick={() => setShowResumeDropdown(!showResumeDropdown)}
              className={`${getButtonClasses('primary', theme, screenSize)} flex items-center justify-between`}
            >
              <span>📄</span>
              <Icons.ChevronDown
                className={`${navigationSizing.icon[screenSize]} ml-1`}
              />
            </button>
          </Tooltip>

          {showResumeDropdown && (
            <>
              <div
                className='fixed inset-0 z-40'
                onClick={() => setShowResumeDropdown(false)}
                onMouseDown={() => setShowResumeDropdown(false)}
              />
              <div
                className={`${classes.dropdown} w-80 max-w-[calc(100vw-2rem)] left-1/2 transform -translate-x-1/2 sm:right-0 sm:left-auto sm:transform-none z-50`}
                onClick={e => e.stopPropagation()}
              >
                <ResumeDropdownContent
                  onResumeSelect={handleResumeSelect}
                  onClose={() => setShowResumeDropdown(false)}
                />
              </div>
            </>
          )}
        </div>

        {/* User Profile & Theme Toggle for Mobile */}
        <div className={classes.userControls}>
          <UserProfile />
          <ThemeToggle size='sm' />
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${classes.navItem} relative`}
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

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id='mobile-menu'
            data-testid='mobile-menu'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='md:hidden overflow-hidden'
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
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`${classes.mobileItem} ${
                        isActive(item) ? classes.active : ''
                      }`}
                      aria-current={isActive(item) ? 'page' : undefined}
                      tabIndex={0}
                    >
                      {item.label}
                    </Link>
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
                          className={classes.mobileItem}
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
    </>
  );
};

export default MobileNavigation;
