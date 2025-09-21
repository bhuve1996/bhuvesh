import React from 'react';

import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { skillsList } from '@/lib/data';

export const AboutSection: React.FC = () => {
  return (
    <Section
      id='about'
      className='min-h-screen flex items-center justify-center px-6 py-20'
    >
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-cyan-400'>
            About Me
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Passionate developer with expertise in modern web technologies
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          <div className='space-y-6'>
            <Card>
              <h3 className='text-2xl font-bold text-white mb-4'>My Journey</h3>
              <p className='text-gray-300 leading-relaxed mb-4'>
                I&apos;m a passionate developer with expertise in modern web
                technologies. I love creating beautiful, performant applications
                that solve real-world problems.
              </p>
              <p className='text-gray-300 leading-relaxed'>
                My journey has led me to master React, Next.js, TypeScript, and
                modern CSS frameworks. I&apos;m always learning and staying
                up-to-date with the latest technologies.
              </p>
            </Card>

            <Card>
              <h3 className='text-2xl font-bold text-white mb-6'>
                Skills & Technologies
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                {skillsList.map(skill => (
                  <div
                    key={skill}
                    className='bg-cyan-400/10 border border-cyan-400/30 rounded-full px-4 py-2 text-center text-sm text-cyan-400 hover:bg-cyan-400/20 transition-colors cursor-pointer'
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className='flex items-center justify-center'>
            <div className='w-80 h-80 relative'>
              <div className='absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl'></div>
              <div className='relative w-full h-full bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-full flex items-center justify-center border border-cyan-400/20'>
                <div className='text-6xl'>🚀</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutSection;
