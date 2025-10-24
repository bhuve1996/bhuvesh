import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { VisualSeparator } from '@/components/ui/VisualSeparator';
import { projects } from '@/lib/data';

export const ProjectsSection: React.FC = () => {
  return (
    <Section
      id='projects'
      className='min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative overflow-hidden'
    >
      {/* Background Effects */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-1/4 left-1/3 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl animate-pulse-slow'></div>
        <div className='absolute bottom-1/4 right-1/3 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000'></div>
      </div>

      {/* Visual Separator */}
      <VisualSeparator
        type='vertical'
        position='center'
        color='accent'
        opacity={0.1}
        animated={true}
      />

      <div className='max-w-7xl mx-auto relative z-10'>
        <div className='text-center mb-20'>
          <div className='mb-6 animate-fade-in'>
            <span className='inline-block px-4 py-2 bg-accent-500/10 border border-accent-500/20 rounded-full text-accent-400 text-sm font-medium backdrop-blur-sm'>
              🚀 My Projects
            </span>
          </div>
          <p className='section-subtitle animate-slide-up delay-200 mt-4'>
            Here are some of my recent projects showcasing modern web
            development and innovative solutions
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: '-100px' }}
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className='group card-hover'>
                  {/* Project Header */}
                  <div className='flex justify-between items-start mb-6'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center mr-3'>
                        <span className='text-lg'>🚀</span>
                      </div>
                      <h3 className='text-xl font-bold text-foreground group-hover:text-primary-400 transition-colors duration-300'>
                        {project.title}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Completed'
                          ? 'bg-success-500/20 text-success-400 border border-success-500/30'
                          : 'bg-warning-500/20 text-warning-400 border border-warning-500/30'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Project Description */}
                  <p className='text-muted-foreground mb-6 leading-relaxed'>
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className='mb-6'>
                    <h4 className='text-sm font-semibold text-muted-foreground mb-3'>
                      Tech Stack
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={tech}
                          className='bg-primary-500/10 border border-primary-500/20 text-primary-400 px-3 py-1 rounded-lg text-xs font-medium hover:bg-primary-500/20 transition-colors duration-300'
                          style={{
                            animationDelay: `${index * 100 + techIndex * 50}ms`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-3'>
                    <Button
                      variant='primary'
                      size='sm'
                      className='flex-1 group-hover:scale-105 transition-transform duration-300'
                    >
                      View Project
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      className='group-hover:scale-105 transition-transform duration-300'
                    >
                      Code
                    </Button>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className='text-center mt-16'
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className='bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-2xl p-8 backdrop-blur-sm'
          >
            <h3 className='text-2xl font-bold text-foreground mb-4'>
              Interested in working together?
            </h3>
            <p className='text-muted-foreground mb-6 max-w-2xl mx-auto'>
              I&apos;m always excited to take on new challenges and create
              amazing digital experiences. Let&apos;s discuss your next project!
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='lg' className='group'>
                  <span className='group-hover:text-primary-950 transition-colors duration-200'>
                    Start a Project
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant='outline' size='lg'>
                  View All Projects
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
};

export default ProjectsSection;
