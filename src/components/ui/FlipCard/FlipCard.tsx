'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { Icons } from '@/components/ui/SVG';

interface FlipCardProps {
  title: string;
  description: string;
  href: string;
  gifSrc: string;
  gifAlt: string;
  iconName: string;
  gradientFrom: string;
  gradientTo: string;
  delay?: number;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  title,
  description,
  href,
  gifSrc,
  gifAlt,
  iconName,
  gradientFrom,
  gradientTo,
  delay = 0,
}) => {
  const IconComponent = Icons[iconName as keyof typeof Icons];
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`group perspective-1000 cursor-pointer animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <div className='absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden'>
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 flex flex-col justify-between relative overflow-hidden`}
          >
            {/* Background GIF */}
            <div className='absolute inset-0 opacity-70 group-hover:opacity-80 transition-opacity duration-500'>
              <Image
                src={gifSrc}
                alt={gifAlt}
                fill
                className='object-cover rounded-2xl'
                unoptimized
              />
            </div>

            {/* Content */}
            <div className='relative z-10'>
              <div className='w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                {IconComponent && (
                  <IconComponent className='w-6 h-6 text-white' />
                )}
              </div>
              <h3 className='text-2xl font-bold text-white mb-2 group-hover:text-white/90 transition-colors'>
                {title}
              </h3>
            </div>

            <div className='relative z-10'>
              <div className='w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ml-auto group-hover:rotate-180 transition-transform duration-500'>
                <svg
                  className='w-5 h-5 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div className='absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden'>
          <div
            className={`w-full h-full bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 flex flex-col justify-center relative overflow-hidden`}
          >
            {/* Background GIF */}
            <div className='absolute inset-0 opacity-60 group-hover:opacity-70 transition-opacity duration-500'>
              <Image
                src={gifSrc}
                alt={gifAlt}
                fill
                className='object-cover rounded-2xl'
                unoptimized
              />
            </div>

            {/* Content */}
            <div className='relative z-10 text-center'>
              <h3 className='text-2xl font-bold text-white mb-4'>{title}</h3>
              <p className='text-white/90 text-sm leading-relaxed mb-6'>
                {description}
              </p>
              <Link
                href={href}
                className='inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105'
              >
                Explore
                <svg
                  className='w-4 h-4 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
