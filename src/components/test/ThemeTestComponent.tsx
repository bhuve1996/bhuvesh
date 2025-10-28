/**
 * Theme Test Component
 * Used to verify theme system is working correctly
 */

'use client';

import React from 'react';

import {
  ThemeAwareBadge,
  ThemeAwareButton,
  ThemeAwareCard,
} from '@/components/ui/ThemeAware';
import { useThemeStyles } from '@/hooks/useThemeStyles';

export const ThemeTestComponent: React.FC = () => {
  const {
    theme,
    toggleTheme,
    getThemeClasses: _getThemeClasses,
  } = useThemeStyles();

  return (
    <div className='space-y-6 p-6'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold text-foreground mb-4'>
          Theme System Test
        </h2>
        <p className='text-muted-foreground mb-6'>
          Current theme:{' '}
          <span className='font-semibold text-primary'>{theme}</span>
        </p>

        <ThemeAwareButton onClick={toggleTheme} variant='primary'>
          Switch to {theme === 'dark' ? 'light' : 'dark'} theme
        </ThemeAwareButton>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Theme-Aware Cards */}
        <ThemeAwareCard variant='default' title='Default Card'>
          <p className='text-muted-foreground'>
            This is a default theme-aware card that automatically adapts to the
            current theme.
          </p>
        </ThemeAwareCard>

        <ThemeAwareCard variant='elevated' title='Elevated Card'>
          <p className='text-muted-foreground'>
            This card has elevated styling with shadows that adapt to the theme.
          </p>
        </ThemeAwareCard>

        <ThemeAwareCard variant='glass' title='Glass Card'>
          <p className='text-muted-foreground'>
            This card uses glass morphism effects that work in both themes.
          </p>
        </ThemeAwareCard>

        <ThemeAwareCard variant='interactive' title='Interactive Card'>
          <p className='text-muted-foreground'>
            This card has interactive hover effects that are theme-aware.
          </p>
        </ThemeAwareCard>
      </div>

      {/* Theme-Aware Buttons */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Theme-Aware Buttons
        </h3>
        <div className='flex flex-wrap gap-4'>
          <ThemeAwareButton variant='primary'>Primary</ThemeAwareButton>
          <ThemeAwareButton variant='secondary'>Secondary</ThemeAwareButton>
          <ThemeAwareButton variant='outline'>Outline</ThemeAwareButton>
          <ThemeAwareButton variant='ghost'>Ghost</ThemeAwareButton>
          <ThemeAwareButton variant='destructive'>Destructive</ThemeAwareButton>
        </div>
      </div>

      {/* Theme-Aware Badges */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Theme-Aware Badges
        </h3>
        <div className='flex flex-wrap gap-4'>
          <ThemeAwareBadge variant='default'>Default</ThemeAwareBadge>
          <ThemeAwareBadge variant='primary'>Primary</ThemeAwareBadge>
          <ThemeAwareBadge variant='success'>Success</ThemeAwareBadge>
          <ThemeAwareBadge variant='warning'>Warning</ThemeAwareBadge>
          <ThemeAwareBadge variant='error'>Error</ThemeAwareBadge>
          <ThemeAwareBadge variant='info'>Info</ThemeAwareBadge>
          <ThemeAwareBadge variant='outline'>Outline</ThemeAwareBadge>
        </div>
      </div>

      {/* Score Colors Test */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Score Colors Test
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[95, 85, 65, 45].map(score => (
            <div
              key={score}
              className={`p-4 rounded-lg border ${
                score >= 90
                  ? 'bg-green-500/20 text-green-500 border-green-500'
                  : score >= 80
                    ? 'bg-blue-500/20 text-blue-500 border-blue-500'
                    : score >= 70
                      ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                      : 'bg-red-500/20 text-red-500 border-red-500'
              }`}
            >
              <div className='text-center'>
                <div className='text-2xl font-bold'>{score}</div>
                <div className='text-sm opacity-75'>Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Colors Test */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Category Colors Test
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {[
            'ats',
            'keyword',
            'formatting',
            'content',
            'structure',
            'other',
          ].map(category => (
            <div
              key={category}
              className={`p-4 rounded-lg bg-gradient-to-r ${
                category === 'ats'
                  ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
                  : category === 'keyword'
                    ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
                    : category === 'formatting'
                      ? 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
                      : category === 'content'
                        ? 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
                        : category === 'experience'
                          ? 'from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20'
                          : category === 'skills'
                            ? 'from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20'
                            : category === 'education'
                              ? 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20'
                              : category === 'structure'
                                ? 'from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20'
                                : 'from-slate-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-800/20'
              }`}
            >
              <div className='text-center'>
                <div className='text-lg font-semibold capitalize'>
                  {category}
                </div>
                <div className='text-sm opacity-75'>Category</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Elements Test */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Form Elements Test
        </h3>
        <div className='max-w-md space-y-4'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Theme-Aware Input
            </label>
            <input
              className='w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
              placeholder='Type something...'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Theme-Aware Textarea
            </label>
            <textarea
              className='w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical'
              rows={3}
              placeholder='Enter your message...'
            />
          </div>
        </div>
      </div>

      {/* Status Messages Test */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-foreground'>
          Status Messages Test
        </h3>
        <div className='space-y-3'>
          <div className='p-4 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 text-success-800 dark:text-success-200'>
            <strong>Success:</strong> This is a success message that adapts to
            the theme.
          </div>

          <div className='p-4 rounded-lg bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-200'>
            <strong>Warning:</strong> This is a warning message that adapts to
            the theme.
          </div>

          <div className='p-4 rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 text-error-800 dark:text-error-200'>
            <strong>Error:</strong> This is an error message that adapts to the
            theme.
          </div>

          <div className='p-4 rounded-lg bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 text-info-800 dark:text-info-200'>
            <strong>Info:</strong> This is an info message that adapts to the
            theme.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestComponent;
