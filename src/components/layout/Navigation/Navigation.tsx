'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { COMMON_CLASSES, NAV_ITEMS } from '@/lib/constants';
import { NavItem } from '@/lib/data-types';
import type { NavigationProps } from '@/types';

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onSectionClick,
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
    <nav
      className='fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className={`${COMMON_CLASSES.container} py-4`}>
        <div className='flex justify-between items-center'>
          {/* Logo */}
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
                className='w-32 h-[50px] rounded-lg object-cover group-hover:scale-105 transition-transform duration-300'
                priority
              />
              <div className='absolute inset-0 bg-primary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1' role='menubar'>
            {navItems.map(item => (
              <React.Fragment key={item.label}>
                {item.href.includes('#') ? (
                  <Link
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    className={`relative px-4 py-2 rounded-lg transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                      isActive(item)
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-foreground hover:text-primary-400 hover:bg-muted/50'
                    }`}
                    role='menuitem'
                    aria-current={isActive(item) ? 'page' : undefined}
                    tabIndex={0}
                  >
                    <span className='relative z-10'>{item.label}</span>
                    {isActive(item) && (
                      <div className='absolute inset-0 bg-primary-500/20 rounded-lg animate-pulse'></div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className='relative px-4 py-2 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                    role='menuitem'
                    tabIndex={0}
                  >
                    <span className='relative z-10'>{item.label}</span>
                    <div className='absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                  </Link>
                )}
              </React.Fragment>
            ))}

            {/* Theme Toggle */}
            <div className='ml-4'>
              <ThemeToggle size='sm' />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden relative p-2 text-foreground hover:text-primary-400 hover:bg-muted/50 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id='mobile-menu'
          className={`md:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          role='menu'
          aria-hidden={!isMobileMenuOpen}
        >
          <div className='pt-4 pb-4 border-t border-border'>
            <div className='flex flex-col space-y-2'>
              {navItems.map(item => (
                <React.Fragment key={item.label}>
                  {item.href.includes('#') ? (
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`px-4 py-3 rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
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
                      className='px-4 py-3 rounded-lg text-foreground hover:text-primary-400 hover:bg-muted/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
                      onClick={() => setIsMobileMenuOpen(false)}
                      role='menuitem'
                      tabIndex={0}
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}

              {/* Mobile Theme Toggle */}
              <div className='px-4 py-3 flex justify-center'>
                <ThemeToggle size='md' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
