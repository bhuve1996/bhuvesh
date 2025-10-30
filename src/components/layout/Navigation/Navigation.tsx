'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { useTheme } from '@/contexts/ThemeContext';
import {
  getLogoClasses,
  getNavigationClasses,
} from '@/lib/design-system/navigation';
import type { NavigationProps } from '@/types';

import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import { TabletNavigation } from './TabletNavigation';

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onSectionClick,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumeDropdown, setShowResumeDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );

  // Theme context
  const { theme } = useTheme();

  // Handle responsive screen size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get theme-aware classes
  const classes = getNavigationClasses(theme, screenSize);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`${classes.container} ${className || ''}`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className={classes.nav}>
        {/* Logo */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={classes.logo}
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
                width={160}
                height={60}
                className={getLogoClasses(screenSize)}
              />
              <div className='absolute inset-0 bg-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation - Only visible on desktop */}
        <DesktopNavigation
          activeSection={activeSection}
          onSectionClick={onSectionClick || (() => {})}
          showResumeDropdown={showResumeDropdown}
          setShowResumeDropdown={setShowResumeDropdown}
          showMoreDropdown={showMoreDropdown}
          setShowMoreDropdown={setShowMoreDropdown}
          screenSize={screenSize}
        />

        {/* Tablet Navigation - Only visible on tablet */}
        <TabletNavigation
          activeSection={activeSection}
          showResumeDropdown={showResumeDropdown}
          setShowResumeDropdown={setShowResumeDropdown}
          showMoreDropdown={showMoreDropdown}
          setShowMoreDropdown={setShowMoreDropdown}
          screenSize={screenSize}
        />

        {/* Mobile Navigation - Only visible on mobile */}
        <MobileNavigation
          activeSection={activeSection}
          onSectionClick={onSectionClick || (() => {})}
          showResumeDropdown={showResumeDropdown}
          setShowResumeDropdown={setShowResumeDropdown}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          screenSize={screenSize}
        />
      </div>
    </motion.nav>
  );
};

export default Navigation;
