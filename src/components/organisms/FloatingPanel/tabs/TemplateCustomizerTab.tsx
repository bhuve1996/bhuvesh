'use client';

import React, { useState } from 'react';

import { Card } from '@/components/ui/Card';
import { ResumeTemplate } from '@/types/resume';

interface TemplateCustomizerTabProps {
  template: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

export const TemplateCustomizerTab: React.FC<TemplateCustomizerTabProps> = ({
  template,
  onTemplateChange,
}) => {
  const [customizations, setCustomizations] = useState({
    fontSize: template.fontSize || '14',
    fontFamily: template.fontFamily || 'Arial',
    colorScheme: template.colorScheme || 'blue',
    spacing: template.spacing || 'normal',
  });

  const handleCustomizationChange = (key: string, value: any) => {
    const newCustomizations = { ...customizations, [key]: value };
    setCustomizations(newCustomizations);

    onTemplateChange({
      ...template,
      ...newCustomizations,
    });
  };

  return (
    <div className='p-3 sm:p-4 space-y-3 sm:space-y-4 h-full overflow-y-auto'>
      <div className='text-center'>
        <h4 className='text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
          Template Customization
        </h4>
        <p className='text-xs sm:text-sm text-neutral-600 dark:text-neutral-400'>
          Customize your resume template appearance
        </p>
      </div>

      <div className='space-y-3 sm:space-y-4'>
        {/* Font Size */}
        <Card className='p-3 sm:p-4'>
          <label className='block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
            Font Size
          </label>
          <input
            type='range'
            min='10'
            max='18'
            value={customizations.fontSize}
            onChange={e =>
              handleCustomizationChange('fontSize', parseInt(e.target.value))
            }
            className='w-full'
          />
          <div className='text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1'>
            {customizations.fontSize}px
          </div>
        </Card>

        {/* Font Family */}
        <Card className='p-3 sm:p-4'>
          <label className='block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
            Font Family
          </label>
          <select
            value={customizations.fontFamily}
            onChange={e =>
              handleCustomizationChange('fontFamily', e.target.value)
            }
            className='w-full p-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          >
            <option value='Arial'>Arial</option>
            <option value='Times New Roman'>Times New Roman</option>
            <option value='Calibri'>Calibri</option>
            <option value='Helvetica'>Helvetica</option>
          </select>
        </Card>

        {/* Color Scheme */}
        <Card className='p-3 sm:p-4'>
          <label className='block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
            Color Scheme
          </label>
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
            {['blue', 'green', 'purple', 'red', 'gray', 'black'].map(color => (
              <button
                key={color}
                onClick={() => handleCustomizationChange('colorScheme', color)}
                className={`p-2 rounded-lg border-2 ${
                  customizations.colorScheme === color
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  className={`w-4 h-4 sm:w-6 sm:h-6 rounded mx-auto ${
                    color === 'blue'
                      ? 'bg-blue-500'
                      : color === 'green'
                        ? 'bg-green-500'
                        : color === 'purple'
                          ? 'bg-purple-500'
                          : color === 'red'
                            ? 'bg-red-500'
                            : color === 'gray'
                              ? 'bg-gray-500'
                              : 'bg-black'
                  }`}
                />
                <span className='text-xs mt-1 capitalize'>{color}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Spacing */}
        <Card className='p-3 sm:p-4'>
          <label className='block text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
            Spacing
          </label>
          <select
            value={customizations.spacing}
            onChange={e => handleCustomizationChange('spacing', e.target.value)}
            className='w-full p-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          >
            <option value='compact'>Compact</option>
            <option value='normal'>Normal</option>
            <option value='spacious'>Spacious</option>
          </select>
        </Card>
      </div>
    </div>
  );
};

export default TemplateCustomizerTab;
