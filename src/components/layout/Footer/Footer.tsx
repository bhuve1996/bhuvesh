'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Icons } from '@/components/ui/SVG';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/bhuvesh',
      icon: Icons.GitHub,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/bhuvesh',
      icon: Icons.LinkedIn,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/bhuvesh',
      icon: Icons.Twitter,
    },
  ];

  const quickLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Services', href: '/services' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ];

  const services = [
    { label: 'Web Development', href: '/services#web-development' },
    { label: 'Mobile Apps', href: '/services#mobile-apps' },
    { label: 'Backend Development', href: '/services#backend-development' },
    { label: 'E-commerce', href: '/services#e-commerce' },
    { label: 'Consulting', href: '/services#consulting' },
  ];

  return (
    <footer className='bg-black/90 backdrop-blur-sm border-t border-cyan-400/20'>
      <div className='max-w-6xl mx-auto px-6 py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8'>
          {/* Brand Section */}
          <div className='lg:col-span-1'>
            <Link
              href='/'
              className='inline-block hover:opacity-80 transition-opacity mb-4'
              aria-label='Go to homepage'
            >
              <Image
                src='/logo.png'
                alt='Bhuvesh Logo'
                width={128}
                height={50}
                className='w-32 h-[50px] rounded-lg object-cover'
              />
            </Link>
            <p className='text-gray-400 text-sm leading-relaxed mb-6'>
              Senior Frontend Developer with 7+ years of experience building
              modern web applications with React, Next.js, and cutting-edge
              technologies.
            </p>
            {/* Social Links */}
            <div className='flex space-x-4'>
              {socialLinks.map(social => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-gray-400 hover:text-cyan-400 transition-colors duration-300 p-2 rounded-lg hover:bg-cyan-400/10'
                    aria-label={`Visit ${social.name} profile`}
                  >
                    <IconComponent className='w-5 h-5' />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              {quickLinks.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>Services</h3>
            <ul className='space-y-3'>
              {services.map(service => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className='text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm'
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className='text-white font-semibold text-lg mb-4'>
              Get In Touch
            </h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3'>
                <Icons.Email className='w-4 h-4 text-cyan-400 flex-shrink-0' />
                <a
                  href='mailto:hello@bhuvesh.com'
                  className='text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm'
                >
                  hello@bhuvesh.com
                </a>
              </div>
              <div className='flex items-center space-x-3'>
                <Icons.Location className='w-4 h-4 text-cyan-400 flex-shrink-0' />
                <span className='text-gray-400 text-sm'>San Francisco, CA</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Icons.Globe className='w-4 h-4 text-cyan-400 flex-shrink-0' />
                <span className='text-gray-400 text-sm'>
                  Available for remote work
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-800 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='text-gray-400 text-sm'>
              © {currentYear} Bhuvesh Singla. All rights reserved.
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <Link
                href='/privacy'
                className='text-gray-400 hover:text-cyan-400 transition-colors duration-300'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='text-gray-400 hover:text-cyan-400 transition-colors duration-300'
              >
                Terms of Service
              </Link>
              <Link
                href='/sitemap'
                className='text-gray-400 hover:text-cyan-400 transition-colors duration-300'
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
