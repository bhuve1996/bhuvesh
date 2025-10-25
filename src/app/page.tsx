'use client';

import { useEffect, useState } from 'react';

import { Footer, Navigation } from '@/components/layout';
import { StructuredData } from '@/components/SEO/StructuredData';
import { FlipCard, Loading, OrbitingElements } from '@/components/ui';
import { pageCards } from '@/lib/pageCards';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
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
    <>
      <StructuredData type='Person' />
      <StructuredData type='WebSite' />

      <div className='min-h-screen bg-gradient-to-br from-background via-background to-background text-foreground relative overflow-hidden'>
        {/* Orbiting Elements */}
        <OrbitingElements />

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

        {/* Homepage Content - Flip Card Gallery */}
        <main className='flex-1 min-h-screen pt-24 pb-20'>
          <div className='max-w-7xl mx-auto px-6'>
            {/* Header */}
            <div className='text-center mb-16' data-tour='homepage-welcome'>
              <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent'>
                Welcome to My Portfolio
              </h1>
              <p className='text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto'>
                Explore my work, learn about my journey, and discover how I can
                help bring your ideas to life.
              </p>
            </div>

            {/* Flip Card Gallery */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
              {pageCards.map(card => {
                const tourAttribute =
                  card.title === 'Resume Builder'
                    ? 'resume-card'
                    : card.title === 'My Projects'
                      ? 'projects-card'
                      : card.title === 'Get In Touch'
                        ? 'contact-card'
                        : undefined;

                return (
                  <div
                    key={card.title}
                    {...(tourAttribute && { 'data-tour': tourAttribute })}
                  >
                    <FlipCard
                      title={card.title}
                      description={card.description}
                      href={card.href}
                      gifSrc={card.gifSrc}
                      gifAlt={card.gifAlt}
                      iconName={card.iconName}
                      gradientFrom={card.gradientFrom}
                      gradientTo={card.gradientTo}
                      delay={card.delay}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
