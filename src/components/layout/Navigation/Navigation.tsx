'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { UserProfile } from '@/components/auth';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';
import { COMMON_CLASSES, NAV_ITEMS } from '@/lib/constants';
import { NavItem } from '@/lib/data-types';
import type { NavigationProps } from '@/types';

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onSectionClick,
  className,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = NAV_ITEMS.map(item => ({
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

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`w-full bg-background border-b border-border ${className || ''}`}
      role='navigation'
      aria-label='Main navigation'
    >
      <div className={`${COMMON_CLASSES.container} py-4`}>
        <div className='flex justify-between items-center'>
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
            className='hidden md:flex items-center space-x-1'
          >
            {navItems.map((item, index) => (
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

            {/* User Profile & Theme Toggle */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className='ml-4 flex items-center gap-3'
            >
              <UserProfile />
              <ThemeToggle size='sm' />
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='md:hidden relative p-2 text-foreground hover:text-primary-400 hover:bg-muted/50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
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
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id='mobile-menu'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='md:hidden overflow-hidden'
              role='menu'
              aria-hidden={!isMobileMenuOpen}
            >
              <div className='pt-4 pb-4 border-t border-border'>
                <div className='flex flex-col space-y-2'>
                  {navItems.map((item, index) => (
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
                          role='menuitem'
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
                          role='menuitem'
                          tabIndex={0}
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
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
