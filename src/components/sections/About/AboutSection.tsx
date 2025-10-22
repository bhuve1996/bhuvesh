import React from 'react';

import { AnimatedSection, SectionHeader, TechStack } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionSeparator } from '@/components/ui/SectionSeparator';
import { VisualSeparator } from '@/components/ui/VisualSeparator';
import { COMMON_CLASSES } from '@/lib/constants';
import { skillsList } from '@/lib/data';

interface AboutSectionProps {
  onGetStarted?: () => void;
  onViewProjects?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onGetStarted,
  onViewProjects,
}) => {
  return (
    <Section
      id='about'
      className='min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative overflow-hidden'
    >
      {/* Background Effects */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-1/3 right-1/4 w-72 h-72 bg-secondary-500/5 rounded-full blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-1/3 left-1/4 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000'></div>
      </div>

      {/* Visual Separator */}
      <VisualSeparator
        type='vertical'
        position='center'
        color='secondary'
        opacity={0.12}
        animated={true}
      />

      <div className={COMMON_CLASSES.container}>
        {/* Hero Content */}
        <div className='text-center max-w-5xl mx-auto relative z-10 mb-20'>
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
            Next.js, TypeScript, and cutting-edge technologies. Let&apos;s
            create something amazing together.
          </p>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up delay-400 mb-16'>
            {onGetStarted && (
              <Button
                onClick={onGetStarted}
                size='lg'
                className='group relative overflow-hidden'
              >
                <span className='relative z-10'>Get Started</span>
                <div className='absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </Button>
            )}
            {onViewProjects && (
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
            )}
          </div>

          {/* Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-slide-up delay-500'>
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
              <div className='text-3xl font-bold text-accent-400 mb-2'>
                100%
              </div>
              <div className='text-muted-foreground text-sm'>
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>

        <SectionSeparator variant='gradient' color='muted' spacing='xl' />

        <SectionHeader
          title='About Me'
          subtitle='Passionate developer with expertise in modern web technologies and innovative solutions'
          badge='💻 Developer'
        />

        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Content */}
          <div className='space-y-8'>
            <AnimatedSection animation='slideUp' delay={300}>
              <Card className={COMMON_CLASSES.cardHover}>
                <div className='flex items-center mb-6'>
                  <div className='w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mr-4'>
                    <span className='text-2xl'>🚀</span>
                  </div>
                  <h3 className='text-2xl font-bold text-foreground'>
                    My Journey
                  </h3>
                </div>
                <p className='text-muted-foreground leading-relaxed mb-4'>
                  I&apos;m a passionate developer with 7+ years of experience in
                  modern web technologies. I love creating beautiful, performant
                  applications that solve real-world problems and deliver
                  exceptional user experiences.
                </p>
                <p className='text-muted-foreground leading-relaxed'>
                  My journey has led me to master React, Next.js, TypeScript,
                  and modern CSS frameworks. I&apos;m always learning and
                  staying up-to-date with the latest technologies to deliver
                  cutting-edge solutions.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation='slideUp' delay={400}>
              <Card className={COMMON_CLASSES.cardHover}>
                <div className='flex items-center mb-6'>
                  <div className='w-12 h-12 bg-secondary-500/10 rounded-lg flex items-center justify-center mr-4'>
                    <span className='text-2xl'>⚡</span>
                  </div>
                  <h3 className='text-2xl font-bold text-foreground'>
                    Skills & Technologies
                  </h3>
                </div>
                <TechStack
                  technologies={skillsList}
                  columns={3}
                  variant='default'
                />
              </Card>
            </AnimatedSection>
          </div>

          {/* Visual Element */}
          <div className='flex items-center justify-center animate-slide-up delay-500'>
            <div className='relative w-96 h-96'>
              {/* Outer Ring */}
              <div className='absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 rounded-full blur-2xl animate-pulse-slow'></div>

              {/* Middle Ring */}
              <div className='absolute inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-xl animate-pulse-slow delay-500'></div>

              {/* Inner Circle */}
              <div className='relative w-full h-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full flex items-center justify-center border border-primary-500/20 backdrop-blur-sm'>
                <div className='text-center'>
                  <div className='text-8xl mb-4 animate-bounce'>🚀</div>
                  <div className='text-primary-400 font-semibold text-lg'>
                    Full-Stack
                  </div>
                  <div className='text-secondary-400 font-semibold text-lg'>
                    Developer
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className='absolute -top-4 -right-4 w-8 h-8 bg-primary-500/20 rounded-full animate-bounce delay-1000'></div>
              <div className='absolute -bottom-4 -left-4 w-6 h-6 bg-secondary-500/20 rounded-full animate-bounce delay-1500'></div>
              <div className='absolute top-1/4 -left-8 w-4 h-4 bg-accent-500/20 rounded-full animate-bounce delay-2000'></div>
            </div>
          </div>
        </div>

        <SectionSeparator variant='gradient' color='muted' spacing='xl' />

        {/* Stats Section */}
        <div className='mt-20 grid grid-cols-1 md:grid-cols-4 gap-8 animate-slide-up delay-600'>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/20 transition-colors duration-300'>
              <span className='text-2xl'>💼</span>
            </div>
            <div className='text-3xl font-bold text-primary-400 mb-2'>7+</div>
            <div className='text-muted-foreground text-sm'>
              Years Experience
            </div>
          </div>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-secondary-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-500/20 transition-colors duration-300'>
              <span className='text-2xl'>🎯</span>
            </div>
            <div className='text-3xl font-bold text-secondary-400 mb-2'>
              50+
            </div>
            <div className='text-muted-foreground text-sm'>
              Projects Delivered
            </div>
          </div>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-500/20 transition-colors duration-300'>
              <span className='text-2xl'>⭐</span>
            </div>
            <div className='text-3xl font-bold text-accent-400 mb-2'>100%</div>
            <div className='text-muted-foreground text-sm'>
              Client Satisfaction
            </div>
          </div>
          <div className='text-center group'>
            <div className='w-16 h-16 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success-500/20 transition-colors duration-300'>
              <span className='text-2xl'>🚀</span>
            </div>
            <div className='text-3xl font-bold text-success-400 mb-2'>24/7</div>
            <div className='text-muted-foreground text-sm'>
              Support Available
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
