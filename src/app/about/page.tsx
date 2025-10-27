'use client';

import { AboutSection } from '@/components/sections';
import { StructuredData } from '@/components/SEO/StructuredData';
import { SectionSeparator } from '@/components/ui';

export default function About() {
  const handleGetStarted = () => {
    // Scroll to projects section or redirect to projects page
    window.location.href = '/#projects';
  };

  const handleViewProjects = () => {
    window.location.href = '/#projects';
  };

  return (
    <>
      <StructuredData type='Person' />
      <StructuredData type='WebSite' />

      <div className='min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground relative overflow-hidden'>
        {/* Global Background Effects */}
        <div className='fixed inset-0 -z-10'>
          <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5'></div>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/3 rounded-full blur-3xl animate-pulse-slow'></div>
          <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/3 rounded-full blur-3xl animate-pulse-slow delay-1000'></div>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/2 rounded-full blur-3xl animate-pulse-slow delay-2000'></div>
        </div>

        <AboutSection
          onGetStarted={handleGetStarted}
          onViewProjects={handleViewProjects}
        />

        <SectionSeparator variant='gradient' color='muted' spacing='lg' />
      </div>
    </>
  );
}
