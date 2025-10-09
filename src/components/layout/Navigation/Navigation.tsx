'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { Icons } from '@/components/ui/SVG';
import { NavItem } from '@/lib/data-types';

import { NavigationProps } from './types';

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onSectionClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'ATS Checker', href: '/resume/ats-checker' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ];

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
    <nav className='fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-400/20'>
      <div className='max-w-6xl mx-auto px-6 py-4'>
        <div className='flex justify-between items-center'>
          {/* Logo */}
          <Link
            href='/'
            className='hover:opacity-80 transition-opacity'
            aria-label='Go to homepage'
          >
            <Image
              src='/logo.png'
              alt='Bhuvesh Logo'
              width={128}
              height={50}
              className='w-32 h-[50px] rounded-lg object-cover'
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-8'>
            {navItems.map(item => (
              <React.Fragment key={item.label}>
                {item.href.includes('#') ? (
                  <Link
                    href={item.href}
                    onClick={() => handleNavClick(item)}
                    className={`transition-colors duration-300 ${
                      isActive(item)
                        ? 'text-cyan-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className='text-gray-300 hover:text-white transition-colors duration-300'
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden text-white'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <Icons.Close className='w-6 h-6' />
            ) : (
              <Icons.Menu className='w-6 h-6' />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className='md:hidden mt-4 pb-4 border-t border-cyan-400/20'>
            <div className='flex flex-col space-y-4 pt-4'>
              {navItems.map(item => (
                <React.Fragment key={item.label}>
                  {item.href.includes('#') ? (
                    <Link
                      href={item.href}
                      onClick={() => handleNavClick(item)}
                      className={`text-left transition-colors duration-300 ${
                        isActive(item)
                          ? 'text-cyan-400'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className='text-gray-300 hover:text-white transition-colors duration-300'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
