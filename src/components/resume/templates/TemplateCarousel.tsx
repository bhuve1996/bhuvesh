'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Carousel } from '@/components/ui/Carousel';
import { ResumeTemplate } from '@/types/resume';

import { TemplateCard } from './TemplateCard';

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Remove # if present
  const hex = color.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

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
      <div className='max-w-6xl mx-auto px-4 py-6'>
        {showLabels && (
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3
                className='text-lg font-semibold'
                style={{
                  color: isLightColor('#ffffff') ? '#1f2937' : '#ffffff',
                }}
              >
                Choose Template
              </h3>
              <p
                className='text-sm'
                style={{
                  color: isLightColor('#ffffff') ? '#4b5563' : '#d1d5db',
                }}
              >
                {templates.length} templates available
              </p>
            </div>
            <div
              className='text-sm'
              style={{
                color: isLightColor('#ffffff') ? '#6b7280' : '#9ca3af',
              }}
            >
              {selectedTemplate?.name || 'No template selected'}
            </div>
          </div>
        )}

        <div className='h-20 my-2'>
          <Carousel
            itemsPerView={{ mobile: 3, tablet: 4, desktop: 6 }}
            spacing={8}
            onItemSelect={handleTemplateSelect}
            selectedIndex={selectedIndex}
            showDots={false}
            showArrows={true}
            className='template-carousel h-full'
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
      </div>
    </motion.div>
  );
};

export default TemplateCarousel;
