'use client';

import { motion } from 'framer-motion';
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

interface TabletNavigationProps {
  activeSection: string;
  showResumeDropdown: boolean;
  setShowResumeDropdown: (show: boolean) => void;
  showMoreDropdown: boolean;
  setShowMoreDropdown: (show: boolean) => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}

export const TabletNavigation: React.FC<TabletNavigationProps> = ({
  activeSection,
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
      className={classes.tabletNav}
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
              className={`${classes.navItem} ${
                isActive(item) ? classes.active : ''
              }`}
              tabIndex={0}
            >
              <span className='relative z-10'>{item.label}</span>
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
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
            className={`${classes.navItem} flex items-center space-x-1`}
          >
            <span>More</span>
            <Icons.ChevronDown className={navigationSizing.icon[screenSize]} />
          </button>
        </Tooltip>

        {showMoreDropdown && (
          <>
            <div
              className='fixed inset-0 z-40'
              onClick={() => setShowMoreDropdown(false)}
            />
            <div className={`${classes.dropdown} w-40`}>
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

      {/* Resume Dropdown for Medium Screens */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className='ml-1 relative'
      >
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
              className={`${classes.dropdown} w-72 max-w-[calc(100vw-2rem)] z-50`}
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

      {/* User Profile & Theme Toggle for Medium Screens */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className={`ml-1 ${classes.userControls}`}
      >
        <UserProfile />
        <ThemeToggle size='sm' />
      </motion.div>
    </motion.div>
  );
};

export default TabletNavigation;
