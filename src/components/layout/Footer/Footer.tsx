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
      href: 'https://github.com/bhuvesh-singla',
      icon: Icons.GitHub,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/bhuvesh-singla',
      icon: Icons.LinkedIn,
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/bhuvesh_singla',
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
      <div className='max-w-6xl mx-auto px-6 py-6 mt-8'>
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
            <p className='text-muted-foreground text-sm leading-relaxed mb-6'>
              Full-Stack Developer with 7+ years of experience building modern
              web applications with React, Next.js, TypeScript, and cutting-edge
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
                    className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 p-2 rounded-lg hover:bg-cyan-400/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
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
                    className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
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
                    className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
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
                  href='mailto:bhuve1996@gmail.com'
                  className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
                >
                  bhuve1996@gmail.com
                </a>
              </div>
              <div className='flex items-center space-x-3'>
                <Icons.Location className='w-4 h-4 text-cyan-400 flex-shrink-0' />
                <span className='text-muted-foreground text-sm'>India</span>
              </div>
              <div className='flex items-center space-x-3'>
                <Icons.Globe className='w-4 h-4 text-cyan-400 flex-shrink-0' />
                <span className='text-muted-foreground text-sm'>
                  Available for remote work
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-border pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <div className='text-muted-foreground text-sm'>
              © {currentYear} Bhuvesh Singla. All rights reserved.
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <Link
                href='/privacy'
                className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
              >
                Privacy Policy
              </Link>
              <Link
                href='/terms'
                className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
              >
                Terms of Service
              </Link>
              <Link
                href='/sitemap.xml'
                className='text-muted-foreground hover:text-cyan-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black'
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
