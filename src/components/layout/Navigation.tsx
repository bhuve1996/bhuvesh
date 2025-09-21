'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { NavItem } from '@/types';
import { Icons } from '@/components/ui/SVG';

interface NavigationProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection = 'home',
  onSectionClick,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Resume', href: '/resume' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.href.startsWith('#')) {
      const sectionId = item.href.substring(1);
      onSectionClick?.(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  const isActive = (item: NavItem) => {
    if (item.href.startsWith('#')) {
      return activeSection === item.href.substring(1);
    }
    return false;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-cyan-400/20">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-white">Bhuvesh</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <React.Fragment key={item.label}>
                {item.href.startsWith('#') ? (
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`transition-colors duration-300 ${
                      isActive(item)
                        ? 'text-cyan-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <Icons.Close className="w-6 h-6" />
            ) : (
              <Icons.Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-cyan-400/20">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <React.Fragment key={item.label}>
                  {item.href.startsWith('#') ? (
                    <button
                      onClick={() => handleNavClick(item)}
                      className={`text-left transition-colors duration-300 ${
                        isActive(item)
                          ? 'text-cyan-400'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300"
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
