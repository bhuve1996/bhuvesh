'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Card } from '@/components/ui/Card';
import { ResumeData, ResumeTemplate } from '@/types/resume';

import { ImprovedPaginatedTemplatePreview } from './ImprovedPaginatedTemplatePreview';

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

interface TemplateCardProps {
  template: ResumeTemplate;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'micro' | 'xxs' | 'xs' | 'small' | 'medium' | 'large';
  showDetails?: boolean;
  className?: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected = false,
  onClick,
  size = 'medium',
  showDetails = true,
  className = '',
}) => {
  const sizeClasses = {
    micro: {
      container: 'p-0',
      preview: 'aspect-square rounded-sm mb-0 h-8 w-8',
      icon: 'w-2 h-2',
      text: 'text-xs',
      name: 'text-xs',
      score: 'text-xs',
    },
    xxs: {
      container: 'p-0',
      preview: 'aspect-square rounded-sm mb-0',
      icon: 'w-3 h-3',
      text: 'text-xs',
      name: 'text-xs',
      score: 'text-xs',
    },
    xs: {
      container: 'p-0.5',
      preview: 'aspect-square rounded-sm mb-0.5',
      icon: 'w-4 h-4',
      text: 'text-xs',
      name: 'text-xs',
      score: 'text-xs',
    },
    small: {
      container: 'p-1',
      preview: 'aspect-square rounded-sm mb-1',
      icon: 'w-6 h-6',
      text: 'text-xs',
      name: 'text-xs',
      score: 'text-xs',
    },
    medium: {
      container: 'p-2',
      preview: 'aspect-square rounded-md mb-2',
      icon: 'w-8 h-8',
      text: 'text-sm',
      name: 'text-sm',
      score: 'text-sm',
    },
    large: {
      container: 'p-4',
      preview: 'aspect-[4/3] rounded-lg mb-3',
      icon: 'w-12 h-12',
      text: 'text-base',
      name: 'text-lg',
      score: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative ${className}`}
    >
      <Card
        className={`cursor-pointer transition-all duration-300 border-2 ${
          isSelected
            ? 'ring-2 ring-blue-500 shadow-xl scale-105 border-blue-200 bg-blue-50/30'
            : 'border-slate-200 hover:border-slate-300 hover:shadow-lg bg-white'
        }`}
        {...(onClick && { onClick })}
      >
        <div className={currentSize.container}>
          {/* Template Preview */}
          <div
            className={`${currentSize.preview} overflow-hidden shadow-md border-2 border-slate-200 relative group-hover:shadow-xl transition-all duration-300 rounded-lg`}
            style={{
              background: `linear-gradient(135deg, ${template.layout.colors.primary}15, ${template.layout.colors.accent}15, ${template.layout.colors.secondary}10)`,
            }}
          >
            <div className='w-full h-full flex items-center justify-center relative overflow-hidden'>
              {/* Theme Color Bars */}
              <div className='absolute inset-0 flex flex-col'>
                <div
                  className='h-1/3 w-full'
                  style={{
                    backgroundColor: template.layout.colors.primary,
                  }}
                />
                <div
                  className='h-1/3 w-full'
                  style={{
                    backgroundColor: template.layout.colors.accent,
                  }}
                />
                <div
                  className='h-1/3 w-full'
                  style={{
                    backgroundColor: template.layout.colors.secondary,
                  }}
                />
              </div>

              {/* Template Icon */}
              <div className='relative z-10 flex flex-col items-center justify-center'>
                <div
                  className={`${currentSize.icon} rounded-full flex items-center justify-center shadow-lg`}
                  style={{
                    backgroundColor: template.layout.colors.primary,
                  }}
                >
                  <span
                    className={`${currentSize.text} font-bold`}
                    style={{
                      color: template.layout.colors.sidebarText || '#ffffff',
                    }}
                  >
                    {template.name
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .substring(0, 2)}
                  </span>
                </div>
                <div
                  className='w-6 h-1 rounded-full mx-auto'
                  style={{
                    backgroundColor: template.layout.colors.accent,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Template Info */}
          {showDetails && (
            <div className='text-center'>
              <h3
                className={`${currentSize.name} font-bold truncate`}
                style={{
                  color: isLightColor(template.layout.colors.primary)
                    ? '#1f2937'
                    : '#ffffff',
                }}
              >
                {size === 'micro' ||
                size === 'xxs' ||
                size === 'xs' ||
                size === 'small'
                  ? template.name
                      .split(' ')
                      .map(word => word[0])
                      .join('')
                      .substring(0, 3)
                  : template.name}
              </h3>
              <div
                className={`${currentSize.score} text-green-600 font-medium`}
              >
                {template.atsScore}%
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Hover Preview Overlay - Only for medium and large sizes */}
      {(size === 'medium' || size === 'large') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          whileHover={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className='absolute top-0 left-0 w-full h-full pointer-events-none z-20'
          style={{ perspective: '1000px' }}
        >
          <div className='w-full h-full bg-white rounded-xl shadow-2xl border border-slate-200 p-3 transform-gpu'>
            <div className='aspect-[4/3] bg-white rounded-lg mb-2 overflow-hidden shadow-sm border border-slate-200'>
              <ImprovedPaginatedTemplatePreview
                template={template}
                data={template.sampleData as ResumeData}
                className='w-full h-full'
                maxHeight='200px'
              />
            </div>
            <div className='space-y-2'>
              <h3
                className='font-bold text-sm'
                style={{
                  color: isLightColor(template.layout.colors.background)
                    ? '#1f2937'
                    : '#ffffff',
                }}
              >
                {template.name}
              </h3>
              <p
                className='text-xs line-clamp-3 leading-tight'
                style={{
                  color: isLightColor(template.layout.colors.background)
                    ? '#4b5563'
                    : '#d1d5db',
                }}
              >
                {template.description}
              </p>

              {/* Theme Colors Preview */}
              <div className='flex items-center gap-1'>
                <span
                  className='text-xs'
                  style={{
                    color: isLightColor(template.layout.colors.background)
                      ? '#6b7280'
                      : '#9ca3af',
                  }}
                >
                  Theme:
                </span>
                <div className='flex gap-1'>
                  <div
                    className='w-3 h-3 rounded-full border border-slate-300'
                    style={{ backgroundColor: template.layout.colors.primary }}
                    title={`Primary: ${template.layout.colors.primary}`}
                  />
                  <div
                    className='w-3 h-3 rounded-full border border-slate-300'
                    style={{ backgroundColor: template.layout.colors.accent }}
                    title={`Accent: ${template.layout.colors.accent}`}
                  />
                  <div
                    className='w-3 h-3 rounded-full border border-slate-300'
                    style={{
                      backgroundColor: template.layout.colors.secondary,
                    }}
                    title={`Secondary: ${template.layout.colors.secondary}`}
                  />
                </div>
              </div>

              <div className='flex flex-wrap gap-1'>
                <span className='px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap'>
                  {template.category}
                </span>
                <span className='px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap'>
                  {template.experienceLevel}
                </span>
                <span className='px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full whitespace-nowrap'>
                  {template.style}
                </span>
              </div>

              {/* Layout Info */}
              <div
                className='text-xs'
                style={{
                  color: isLightColor(template.layout.colors.background)
                    ? '#6b7280'
                    : '#9ca3af',
                }}
              >
                {template.layout.columns === 2 ? '2-Column' : '1-Column'} •{' '}
                {template.layout.sidebar ? 'Sidebar' : 'No Sidebar'}
              </div>

              <div className='flex items-center justify-between'>
                <span
                  className='text-xs'
                  style={{
                    color: isLightColor(template.layout.colors.background)
                      ? '#6b7280'
                      : '#9ca3af',
                  }}
                >
                  ATS Score
                </span>
                <span className='text-xs font-bold text-green-600'>
                  {template.atsScore}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TemplateCard;
