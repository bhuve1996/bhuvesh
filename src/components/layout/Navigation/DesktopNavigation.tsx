'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { UserProfile } from '@/components/auth';
import { ResumeDropdownContent } from '@/components/layout/ResumeDropdownContent';
import { Tooltip, UniversalTourTrigger } from '@/components/ui';
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

interface DesktopNavigationProps {
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  showResumeDropdown: boolean;
  setShowResumeDropdown: (show: boolean) => void;
  showMoreDropdown: boolean;
  setShowMoreDropdown: (show: boolean) => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  activeSection,
  onSectionClick,
  showResumeDropdown,
  setShowResumeDropdown,
  showMoreDropdown,
  setShowMoreDropdown,
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
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={classes.desktopNav}
      data-tour='navigation'
    >
      {mainNavItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
        >
          <Tooltip
            content={`Go to ${item.label} ${item.href.includes('#') ? 'section' : 'page'}`}
            position='bottom'
            delay={200}
          >
            <Link
              href={item.href}
              onClick={() => handleNavClick(item)}
              className={`${classes.navItem} ${
                isActive(item) ? classes.active : ''
              }`}
              aria-current={isActive(item) ? 'page' : undefined}
              tabIndex={0}
            >
              <span className='relative z-10'>{item.label}</span>
              {isActive(item) && (
                <div className='absolute inset-0 bg-blue-500/20 rounded-lg animate-pulse'></div>
              )}
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </Link>
          </Tooltip>
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
            className={`${classes.navItem} flex items-center space-x-1`}
          >
            <span>More</span>
            <Icons.ChevronDown className={navigationSizing.icon[screenSize]} />
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
            <div className={classes.dropdown}>
              <div className='py-1'>
                {secondaryNavItems.map(item => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setShowMoreDropdown(false)}
                    className={`${classes.mobileItem} block`}
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
        <Tooltip content='Manage your resumes' position='bottom' delay={200}>
          <button
            onClick={() => setShowResumeDropdown(!showResumeDropdown)}
            className={`${getButtonClasses('primary', theme, screenSize)} flex items-center justify-between`}
          >
            <span>📄 My Resumes</span>
            <Icons.ChevronDown
              className={`${navigationSizing.icon[screenSize]} ml-2`}
            />
          </button>
        </Tooltip>

        {showResumeDropdown && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 z-40'
              onClick={() => setShowResumeDropdown(false)}
              onMouseDown={() => setShowResumeDropdown(false)}
            />

            {/* Dropdown */}
            <div
              className={`${classes.dropdown} w-80 max-w-[calc(100vw-2rem)] z-50`}
              onClick={e => e.stopPropagation()}
            >
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
        className={`ml-4 ${classes.userControls}`}
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
            className={`p-2 rounded-lg ${classes.navItem}`}
          >
            <svg
              className={navigationSizing.icon[screenSize]}
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
  );
};

export default DesktopNavigation;
