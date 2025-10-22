import React from 'react';

import { AnimatedSection } from '@/components/common/AnimatedSection';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  className?: string;
  centered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  badge,
  className = '',
  centered = true,
}) => {
  return (
    <div className={cn('mb-16', centered && 'text-center', className)}>
      {badge && (
        <AnimatedSection animation='fadeIn' delay={0}>
          <span className='inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full text-primary-400 text-sm font-medium backdrop-blur-sm mb-6'>
            {badge}
          </span>
        </AnimatedSection>
      )}

      <AnimatedSection animation='slideUp' delay={100}>
        <h2 className='text-4xl md:text-5xl font-bold mb-6 gradient-text'>
          {title}
        </h2>
      </AnimatedSection>

      {subtitle && (
        <AnimatedSection animation='slideUp' delay={200}>
          <p className='text-xl text-neutral-300 max-w-3xl mx-auto'>
            {subtitle}
          </p>
        </AnimatedSection>
      )}

      {description && (
        <AnimatedSection animation='slideUp' delay={300}>
          <p className='text-lg text-neutral-400 max-w-4xl mx-auto mt-4'>
            {description}
          </p>
        </AnimatedSection>
      )}
    </div>
  );
};

export default SectionHeader;
