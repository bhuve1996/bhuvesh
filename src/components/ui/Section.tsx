import React from 'react';
import { SectionProps } from '@/types';

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
}) => {
  return (
    <section id={id} className={className}>
      {children}
    </section>
  );
};

export default Section;
