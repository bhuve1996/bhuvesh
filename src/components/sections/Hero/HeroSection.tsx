import React from 'react';

import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

import type { HeroSectionProps } from '@/types';

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onViewProjects,
}) => {
  return (
    <Section
      id='home'
      className='min-h-screen flex items-center justify-center px-6 pt-20'
    >
      <div className='text-center max-w-4xl mx-auto'>
        <h1 className='text-5xl md:text-7xl font-bold mb-8 text-cyan-400'>
          Welcome to My Portfolio
        </h1>
        <p className='text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed'>
          I&apos;m a passionate{' '}
          <span className='text-cyan-400 font-semibold'>
            Full-Stack Developer
          </span>
        </p>
        <p className='text-lg text-gray-400 mb-12 max-w-2xl mx-auto'>
          Creating amazing digital experiences with modern technologies and
          cutting-edge solutions.
        </p>

        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
          <Button
            onClick={onGetStarted}
            size='lg'
            className='transform hover:scale-105 active:scale-95'
          >
            Get Started
          </Button>
          <Button onClick={onViewProjects} variant='outline' size='lg'>
            View Projects
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
