import { motion } from 'framer-motion';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { Icons } from '@/components/ui/SVG';

export const ContactSection: React.FC = () => {
  return (
    <Section
      id='contact'
      className='min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative overflow-hidden'
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className='max-w-4xl mx-auto relative z-10'
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-6 text-cyan-400'>
            Get In Touch
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto'>
            Let&apos;s work together to bring your ideas to life
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className='grid lg:grid-cols-2 gap-12'
        >
          {/* Contact Form */}
          <Card>
            <h3 className='text-2xl font-bold text-white mb-6'>
              Send me a message
            </h3>

            <form className='space-y-6'>
              <div>
                <input
                  type='text'
                  placeholder='Your Name'
                  className='w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300'
                />
              </div>

              <div>
                <input
                  type='email'
                  placeholder='Your Email'
                  className='w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300'
                />
              </div>

              <div>
                <textarea
                  placeholder='Your Message'
                  rows={4}
                  className='w-full bg-transparent border-b-2 border-gray-600 text-white placeholder-gray-400 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300 resize-none'
                />
              </div>

              <Button type='submit' className='w-full'>
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information & Social Links */}
          <div className='space-y-6'>
            <Card>
              <h3 className='text-2xl font-bold text-white mb-6'>
                Contact Information
              </h3>
              <div className='space-y-6'>
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center'>
                    <Icons.Email className='text-cyan-400 w-6 h-6' />
                  </div>
                  <div>
                    <p className='text-gray-300 text-sm'>Email</p>
                    <p className='text-white font-medium'>
                      bhuve1996@gmail.com
                    </p>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center'>
                    <Icons.Location className='text-cyan-400 w-6 h-6' />
                  </div>
                  <div>
                    <p className='text-gray-300 text-sm'>Location</p>
                    <p className='text-white font-medium'>India</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className='text-2xl font-bold text-white mb-6'>Follow Me</h3>
              <div className='grid grid-cols-1 gap-3'>
                {[
                  {
                    name: 'GitHub',
                    icon: Icons.GitHub,
                    href: 'https://github.com/bhuvesh-singla',
                  },
                  {
                    name: 'LinkedIn',
                    icon: Icons.LinkedIn,
                    href: 'https://linkedin.com/in/bhuvesh-singla',
                  },
                  {
                    name: 'Twitter',
                    icon: Icons.Twitter,
                    href: 'https://twitter.com/bhuvesh_singla',
                  },
                ].map(social => (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-3 rounded-lg hover:bg-cyan-400/20 transition-colors flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
                  >
                    <social.icon className='w-5 h-5' />
                    <span className='font-medium'>{social.name}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default ContactSection;
