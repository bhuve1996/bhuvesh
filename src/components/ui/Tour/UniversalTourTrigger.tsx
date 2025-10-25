'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { TourTrigger } from './TourTrigger';

interface UniversalTourTriggerProps {
  variant?: 'button' | 'link' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
  showIfCompleted?: boolean;
}

export const UniversalTourTrigger: React.FC<UniversalTourTriggerProps> = ({
  variant = 'icon',
  size = 'md',
  className = '',
  children,
  showIfCompleted = false,
}) => {
  const pathname = usePathname();

  // Map paths to tour IDs
  const getTourId = (path: string): string | null => {
    if (path === '/') return 'homepage';
    if (path === '/about') return 'about-page';
    if (path === '/projects') return 'projects-page';
    if (path === '/blog') return 'blog-page';
    if (path === '/contact') return 'contact-page';
    if (path === '/services') return 'services-page';
    if (path === '/resume/ats-checker') return 'ats-checker';
    if (path === '/resume/builder') return 'resume-builder-page';
    if (path === '/resume/templates') return 'resume-builder';
    if (path.startsWith('/resume/')) return 'resume-builder';
    return null;
  };

  const tourId = getTourId(pathname);

  // Don't render if no tour is available for this page
  if (!tourId) {
    return null;
  }

  return (
    <TourTrigger
      tourId={tourId}
      variant={variant}
      size={size}
      className={className}
      showIfCompleted={showIfCompleted}
    >
      {children}
    </TourTrigger>
  );
};

export default UniversalTourTrigger;
