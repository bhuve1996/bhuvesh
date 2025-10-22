'use client';

import { useEffect, useState } from 'react';

import { Footer, Navigation } from '@/components/layout';
import { ProjectsSection } from '@/components/sections';
import { StructuredData } from '@/components/SEO/StructuredData';
import { Loading } from '@/components/ui';

export default function Projects() {
  const [activeSection, setActiveSection] = useState('projects');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setMounted(true);

    // Loading timer
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Safety timeout to ensure loading doesn't get stuck
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

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

        <Navigation
          activeSection={activeSection}
          onSectionClick={scrollToSection}
        />

        <ProjectsSection />

        <Footer />
      </div>
    </>
  );
}
