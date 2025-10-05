'use client';

import { useEffect, useState } from 'react';

import { Navigation } from '@/components/layout';
import {
  AboutSection,
  ContactSection,
  HeroSection,
  ProjectsSection,
} from '@/components/sections';
import { Loading } from '@/components/ui';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const handleGetStarted = () => {
    setActiveSection('about');
    scrollToSection('about');
  };

  const handleViewProjects = () => {
    scrollToSection('projects');
  };

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
    }, 2000);

    // Safety timeout to ensure loading doesn't get stuck
    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

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
    <div className='min-h-screen bg-black text-white'>
      <Navigation
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <HeroSection
        onGetStarted={handleGetStarted}
        onViewProjects={handleViewProjects}
      />

      <AboutSection />

      <ProjectsSection />

      <ContactSection />
    </div>
  );
}
