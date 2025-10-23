'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Carousel } from '@/components/ui/Carousel';
import { ResumeTemplate } from '@/types/resume';

import { TemplateCard } from './TemplateCard';

interface TemplateCarouselProps {
  templates: ResumeTemplate[];
  selectedTemplate?: ResumeTemplate | null;
  onTemplateSelect: (template: ResumeTemplate) => void;
  className?: string;
  position?: 'top' | 'bottom';
  showLabels?: boolean;
}

export const TemplateCarousel: React.FC<TemplateCarouselProps> = ({
  templates,
  selectedTemplate,
  onTemplateSelect,
  className = '',
  position = 'bottom',
  showLabels = true,
}) => {
  const selectedIndex = selectedTemplate
    ? templates.findIndex(t => t.id === selectedTemplate.id)
    : 0;

  const handleTemplateSelect = (index: number) => {
    const template = templates[index];
    if (template) {
      onTemplateSelect(template);
    }
  };

  return (
    <motion.div
      initial={{ y: position === 'bottom' ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`w-full bg-white border-t border-slate-200 shadow-lg ${className}`}
    >
      <div className='max-w-6xl mx-auto px-4 py-4'>
        {showLabels && (
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-slate-900'>
                Choose Template
              </h3>
              <p className='text-sm text-slate-600'>
                {templates.length} templates available
              </p>
            </div>
            <div className='text-sm text-slate-500'>
              {selectedTemplate?.name || 'No template selected'}
            </div>
          </div>
        )}

        <Carousel
          itemsPerView={{ mobile: 2, tablet: 3, desktop: 5 }}
          spacing={16}
          onItemSelect={handleTemplateSelect}
          selectedIndex={selectedIndex}
          showDots={false}
          showArrows={true}
          className='template-carousel'
        >
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate?.id === template.id}
              onClick={() => onTemplateSelect(template)}
              size='micro'
              showDetails={false}
            />
          ))}
        </Carousel>
      </div>
    </motion.div>
  );
};

export default TemplateCarousel;
