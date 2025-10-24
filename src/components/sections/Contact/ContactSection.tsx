import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { Icons } from '@/components/ui/SVG';
import { useTheme } from '@/contexts/ThemeContext';

export const ContactSection: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  // Theme-aware GIF URLs
  const getGifUrl = () => {
    if (theme === 'light') {
      // Light theme - bright, clean coding GIF
      return 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif';
    } else {
      // Dark theme - darker, more dramatic coding GIF
      return 'https://media.giphy.com/media/L1R1tvI9svkIWwpVYr/giphy.gif';
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Using a simple mailto link for now - in production, you'd want to use a service like EmailJS or a backend API
      const subject = `Contact Form from ${formData.name}`;
      const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;

      const mailtoLink = `mailto:bhuve1996@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink, '_blank');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* GIF Background for this section */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        {/* Theme-aware fallback pattern background */}
        <div
          className={`absolute inset-0 ${
            theme === 'light'
              ? 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
              : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
          }`}
        ></div>
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='${theme === 'light' ? '0.05' : '0.1'}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Theme-aware animated coding GIF */}
        <div className='absolute inset-0 opacity-85'>
          <img
            src={getGifUrl()}
            alt='Coding animation background'
            className='w-full h-full object-cover'
            style={{
              filter:
                theme === 'light'
                  ? 'brightness(1.1) contrast(1.0) saturate(1.1)'
                  : 'brightness(0.9) contrast(1.1) saturate(1.2)',
              objectPosition: 'center center',
            }}
            onError={e => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <div
          className={`absolute inset-0 ${
            theme === 'light'
              ? 'bg-gradient-to-br from-white/20 via-slate-100/15 to-white/20'
              : 'bg-gradient-to-br from-slate-900/15 via-slate-800/10 to-slate-900/15'
          }`}
        ></div>
      </div>

      <Section
        id='contact'
        className='min-h-screen flex items-center justify-center px-6 pt-24 pb-20 relative z-10'
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='w-full relative z-20'
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className='text-center mb-16'
          >
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent'
              }`}
            >
              Get In Touch
            </h2>
            <p
              className={`text-xl max-w-3xl mx-auto ${
                theme === 'light' ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
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
            <Card
              className={`backdrop-blur-md border-cyan-400/20 shadow-2xl shadow-cyan-500/10 ${
                theme === 'light'
                  ? 'bg-gradient-to-br from-white/80 via-slate-50/70 to-white/80 border-cyan-500/30 shadow-cyan-600/20'
                  : 'bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40'
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-6 ${
                  theme === 'light' ? 'text-slate-800' : 'text-white'
                }`}
              >
                Send me a message
              </h3>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Your Name'
                    required
                    className={`w-full bg-transparent border-b-2 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300 ${
                      theme === 'light'
                        ? 'border-slate-300 text-slate-800 placeholder-slate-500 focus:border-cyan-500'
                        : 'border-slate-500 text-white placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='Your Email'
                    required
                    className={`w-full bg-transparent border-b-2 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300 ${
                      theme === 'light'
                        ? 'border-slate-300 text-slate-800 placeholder-slate-500 focus:border-cyan-500'
                        : 'border-slate-500 text-white placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder='Your Message'
                    rows={4}
                    required
                    className={`w-full bg-transparent border-b-2 py-3 focus:border-cyan-400 focus:outline-none transition-colors duration-300 resize-none ${
                      theme === 'light'
                        ? 'border-slate-300 text-slate-800 placeholder-slate-500 focus:border-cyan-500'
                        : 'border-gray-600 text-white placeholder-gray-400'
                    }`}
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className='text-green-400 text-sm text-center'>
                    ✓ Message sent successfully! Your email client should open.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className='text-red-400 text-sm text-center'>
                    ✗ Something went wrong. Please try again.
                  </div>
                )}

                <Button
                  type='submit'
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>

            {/* Contact Information & Social Links */}
            <div className='space-y-6'>
              <Card
                className={`backdrop-blur-md border-cyan-400/20 shadow-2xl shadow-cyan-500/10 ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-white/80 via-slate-50/70 to-white/80 border-cyan-500/30 shadow-cyan-600/20'
                    : 'bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40'
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  }`}
                >
                  Contact Information
                </h3>
                <div className='space-y-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center'>
                      <Icons.Email className='text-cyan-400 w-6 h-6' />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'light'
                            ? 'text-slate-600'
                            : 'text-slate-300'
                        }`}
                      >
                        Email
                      </p>
                      <p
                        className={`font-medium ${
                          theme === 'light' ? 'text-slate-800' : 'text-white'
                        }`}
                      >
                        bhuve1996@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center'>
                      <Icons.Phone className='text-cyan-400 w-6 h-6' />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'light'
                            ? 'text-slate-600'
                            : 'text-slate-300'
                        }`}
                      >
                        Phone
                      </p>
                      <p
                        className={`font-medium ${
                          theme === 'light' ? 'text-slate-800' : 'text-white'
                        }`}
                      >
                        +91 - 9530529550
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center'>
                      <Icons.Location className='text-cyan-400 w-6 h-6' />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'light'
                            ? 'text-slate-600'
                            : 'text-slate-300'
                        }`}
                      >
                        Location
                      </p>
                      <p
                        className={`font-medium ${
                          theme === 'light' ? 'text-slate-800' : 'text-white'
                        }`}
                      >
                        Gurugram, India
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-cyan-400/10 rounded-full flex items-center justify-center'>
                      <Icons.Briefcase className='text-cyan-400 w-6 h-6' />
                    </div>
                    <div>
                      <p
                        className={`text-sm ${
                          theme === 'light'
                            ? 'text-slate-600'
                            : 'text-slate-300'
                        }`}
                      >
                        Current Role
                      </p>
                      <p
                        className={`font-medium ${
                          theme === 'light' ? 'text-slate-800' : 'text-white'
                        }`}
                      >
                        Senior Software Developer at AKQA
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={`backdrop-blur-md border-cyan-400/20 shadow-2xl shadow-cyan-500/10 ${
                  theme === 'light'
                    ? 'bg-gradient-to-br from-white/80 via-slate-50/70 to-white/80 border-cyan-500/30 shadow-cyan-600/20'
                    : 'bg-gradient-to-br from-slate-800/40 via-slate-700/30 to-slate-800/40'
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-6 ${
                    theme === 'light' ? 'text-slate-800' : 'text-white'
                  }`}
                >
                  Follow Me
                </h3>
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
                      className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 shadow-lg ${
                        theme === 'light'
                          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 text-cyan-600 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:border-cyan-500/50 focus:ring-offset-white shadow-cyan-600/10'
                          : 'bg-gradient-to-r from-cyan-400/10 to-blue-400/10 border border-cyan-400/30 text-cyan-400 hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-blue-400/20 hover:border-cyan-400/50 focus:ring-offset-slate-900 shadow-cyan-500/10'
                      }`}
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
    </div>
  );
};

export default ContactSection;
