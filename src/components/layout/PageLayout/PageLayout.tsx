'use client';

import React from 'react';

import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  activeSection = 'home',
  onSectionClick,
}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground relative overflow-hidden'>
      {/* Global Background Effects */}
      <div className='fixed inset-0 -z-10'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5'></div>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/3 rounded-full blur-3xl animate-pulse-slow delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/2 rounded-full blur-3xl animate-pulse-slow delay-2000'></div>
      </div>

      <Navigation
        activeSection={activeSection}
        onSectionClick={onSectionClick || (() => {})}
      />

      {/* Page Header */}
      <section className='pt-16 pb-16 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='mb-6 animate-fade-in'>
            <span className='inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium backdrop-blur-sm'>
              {title}
            </span>
          </div>
          <h1 className='text-5xl md:text-6xl font-bold mb-6 gradient-text animate-slide-up'>
            {title}
          </h1>
          {description && (
            <p className='text-xl text-neutral-300 mb-8 max-w-2xl mx-auto animate-slide-up delay-200'>
              {description}
            </p>
          )}
        </div>
      </section>

      {/* Page Content */}
      <main className='relative z-10'>{children}</main>

      <Footer />
    </div>
  );
};

export default PageLayout;
