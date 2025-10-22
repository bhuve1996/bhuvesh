'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
}) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get theme from localStorage or system preference
    const storedTheme = localStorage.getItem('bhuvesh-theme') as
      | 'dark'
      | 'light';
    const initialTheme = storedTheme || 'light'; // Default to light theme
    setTheme(initialTheme);

    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('bhuvesh-theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={`${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-muted animate-pulse`}
      />
    );
  }

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]}
        relative rounded-lg
        bg-card
        border border-border
        hover:bg-muted
        transition-all duration-300
        flex items-center justify-center
        group
        ${className}
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon - Enhanced with rays */}
      <svg
        className={`
          ${iconSizes[size]}
          absolute transition-all duration-500 ease-in-out
          ${
            theme === 'dark'
              ? 'rotate-180 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }
          text-yellow-500 drop-shadow-sm
        `}
        fill='currentColor'
        viewBox='0 0 24 24'
      >
        <circle cx='12' cy='12' r='5' />
        <path
          d='M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>

      {/* Moon Icon - Enhanced with stars */}
      <svg
        className={`
          ${iconSizes[size]}
          absolute transition-all duration-500 ease-in-out
          ${
            theme === 'light'
              ? 'rotate-180 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }
          text-blue-400 drop-shadow-sm
        `}
        fill='currentColor'
        viewBox='0 0 24 24'
      >
        <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
        <circle cx='18' cy='6' r='1' fill='white' opacity='0.8' />
        <circle cx='20' cy='10' r='0.5' fill='white' opacity='0.6' />
        <circle cx='16' cy='8' r='0.5' fill='white' opacity='0.7' />
      </svg>

      {/* Hover effect */}
      <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/20 to-secondary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
    </motion.button>
  );
};

export default ThemeToggle;
