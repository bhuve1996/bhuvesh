import React from 'react';

import { AnimatedGif } from '@/components/ui/AnimatedGif';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { VisualSeparator } from '@/components/ui/VisualSeparator';
import { sectionGifs } from '@/lib/gifs';
import type { HeroSectionProps } from '@/types';

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onViewProjects,
}) => {
  return (
    <Section
      id='home'
      className='min-h-screen flex items-center justify-center px-6 pt-20 relative overflow-hidden'
    >
      {/* Background Effects */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow delay-2000'></div>
      </div>

      {/* Animated GIFs */}
      {sectionGifs.hero.map(gif => (
        <AnimatedGif
          key={gif.id}
          src={gif.src}
          alt={gif.alt}
          position={gif.position}
          width={gif.width}
          height={gif.height}
          opacity={gif.opacity}
          animation={gif.animation}
          speed={gif.speed}
          zIndex={5}
          showSeparator={gif.showSeparator}
          separatorType={gif.separatorType}
        />
      ))}

      {/* Visual Separator */}
      <VisualSeparator
        type='vertical'
        position='center'
        color='primary'
        opacity={0.15}
        animated={true}
      />

      <div className='text-center max-w-5xl mx-auto relative z-10'>
        {/* Greeting */}
        <div className='mb-6 animate-fade-in'>
          <span className='inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium backdrop-blur-sm'>
            👋 Hello, I&apos;m Bhuvesh
          </span>
        </div>

        {/* Main Heading */}
        <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold mb-8 animate-slide-up'>
          <span className='gradient-text'>Full-Stack</span>
          <br />
          <span className='text-foreground'>Developer</span>
        </h1>

        {/* Subtitle */}
        <p className='text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 leading-relaxed animate-slide-up delay-200'>
          Crafting exceptional digital experiences with{' '}
          <span className='text-primary-400 font-semibold'>
            modern technologies
          </span>{' '}
          and innovative solutions
        </p>

        {/* Description */}
        <p className='text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-300'>
          I specialize in building scalable web applications using React,
          Next.js, TypeScript, and cutting-edge technologies. Let&apos;s create
          something amazing together.
        </p>

        {/* CTA Buttons */}
        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up delay-400'>
          <Button
            onClick={onGetStarted}
            size='lg'
            className='group relative overflow-hidden'
          >
            <span className='relative z-10'>Get Started</span>
            <div className='absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </Button>
          <Button
            onClick={onViewProjects}
            variant='outline'
            size='lg'
            className='group'
          >
            <span className='group-hover:text-primary-950 transition-colors duration-200'>
              View Projects
            </span>
          </Button>
        </div>

        {/* Stats */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up delay-500'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-primary-400 mb-2'>7+</div>
            <div className='text-muted-foreground text-sm'>
              Years Experience
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-secondary-400 mb-2'>
              50+
            </div>
            <div className='text-muted-foreground text-sm'>
              Projects Completed
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-accent-400 mb-2'>100%</div>
            <div className='text-muted-foreground text-sm'>
              Client Satisfaction
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
        <div className='w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center'>
          <div className='w-1 h-3 bg-primary-400 rounded-full mt-2 animate-pulse'></div>
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
