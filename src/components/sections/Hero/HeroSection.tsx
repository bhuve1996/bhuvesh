import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { AnimatedGif } from '@/components/ui/AnimatedGif';
import { Section } from '@/components/ui/Section';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';
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

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='text-center max-w-5xl mx-auto relative z-10'
      >
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className='mb-6'
        >
          <span className='inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium backdrop-blur-sm'>
            👋 Hello, I&apos;m Bhuvesh
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className='text-5xl md:text-7xl lg:text-8xl font-bold mb-8'
        >
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className='gradient-text'
          >
            Full-Stack
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className='text-foreground'
          >
            Developer
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className='text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 leading-relaxed'
        >
          Crafting exceptional digital experiences with{' '}
          <span className='text-primary-400 font-semibold'>
            modern technologies
          </span>{' '}
          and innovative solutions
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className='text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed'
        >
          I specialize in building scalable web applications using React,
          Next.js, TypeScript, and cutting-edge technologies. Let&apos;s create
          something amazing together.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className='flex flex-col sm:flex-row gap-6 justify-center items-center'
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip
              content='Start building your professional resume'
              position='bottom'
              delay={200}
            >
              <Button
                onClick={onGetStarted}
                size='lg'
                className='group relative overflow-hidden'
              >
                <span className='relative z-10'>Get Started</span>
                <div className='absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </Button>
            </Tooltip>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Tooltip
              content='Explore my portfolio and projects'
              position='bottom'
              delay={200}
            >
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
            </Tooltip>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto'
        >
          {[
            {
              number: '7+',
              label: 'Years Experience',
              color: 'text-primary-400',
            },
            {
              number: '50+',
              label: 'Projects Completed',
              color: 'text-secondary-400',
            },
            {
              number: '100%',
              label: 'Client Satisfaction',
              color: 'text-accent-400',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.8 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className='text-center'
            >
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.number}
              </div>
              <div className='text-muted-foreground text-sm'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.2 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className='w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center'
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className='w-1 h-3 bg-primary-400 rounded-full mt-2'
          ></motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default HeroSection;
