import React from 'react';

import { SectionSeparator } from '@/components/ui/SectionSeparator';
import type { SectionProps } from '@/types';

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  showSeparator = false,
  separatorVariant = 'gradient',
  separatorColor = 'muted',
}) => {
  return (
    <>
      {showSeparator && (
        <SectionSeparator
          variant={separatorVariant}
          color={separatorColor}
          spacing='lg'
        />
      )}
      <section id={id} className={className}>
        {children}
      </section>
    </>
  );
};

export default Section;
