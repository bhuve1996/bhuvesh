'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResumeTemplate } from '@/types/resume';

interface FloatingTemplateCustomizerProps {
  template: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
  className?: string;
}

interface StyleSection {
  key: string;
  label: string;
  icon: string;
  properties: {
    fontSize?: boolean;
    fontFamily?: boolean;
    color?: boolean;
    backgroundColor?: boolean;
    spacing?: boolean;
  };
}

export const FloatingTemplateCustomizer: React.FC<
  FloatingTemplateCustomizerProps
> = ({ template, onTemplateChange, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(true);

  // Show the floating button after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000); // Show after other floating buttons
    return () => clearTimeout(timer);
  }, []);

  const styleSections: StyleSection[] = [
    {
      key: 'header',
      label: 'Header',
      icon: '📝',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'body',
      label: 'Body Text',
      icon: '📄',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'skills',
      label: 'Skills',
      icon: '🛠️',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'skillsTags',
      label: 'Skills Tags',
      icon: '🏷️',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'experience',
      label: 'Experience',
      icon: '💼',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'education',
      label: 'Education',
      icon: '🎓',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'headings',
      label: 'Headings',
      icon: '📋',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'buttons',
      label: 'Buttons',
      icon: '🔘',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'contact',
      label: 'Contact Info',
      icon: '📞',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: '🚀',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'achievements',
      label: 'Achievements',
      icon: '🏆',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
    {
      key: 'summary',
      label: 'Summary',
      icon: '📝',
      properties: {
        fontSize: true,
        fontFamily: true,
        color: true,
        backgroundColor: true,
        spacing: true,
      },
    },
  ];

  const fontFamilies = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans Pro',
    'Nunito',
    'Raleway',
    'Ubuntu',
  ];

  const colorPresets = [
    '#1f2937', // Gray-800
    '#374151', // Gray-700
    '#4b5563', // Gray-600
    '#6b7280', // Gray-500
    '#1e40af', // Blue-800
    '#1d4ed8', // Blue-700
    '#2563eb', // Blue-600
    '#dc2626', // Red-600
    '#059669', // Emerald-600
    '#7c3aed', // Violet-600
    '#ea580c', // Orange-600
    '#0891b2', // Cyan-600
  ];

  const backgroundPresets = [
    '#ffffff', // White
    '#f9fafb', // Gray-50
    '#f3f4f6', // Gray-100
    '#e5e7eb', // Gray-200
    '#d1d5db', // Gray-300
    '#fef3c7', // Yellow-100
    '#dbeafe', // Blue-100
    '#dcfce7', // Green-100
    '#fce7f3', // Pink-100
    '#e0e7ff', // Indigo-100
    '#f0f9ff', // Sky-50
    '#fef2f2', // Red-50
    '#f0fdf4', // Green-50
    '#fefce8', // Yellow-50
    '#faf5ff', // Purple-50
    '#ecfdf5', // Emerald-50
    '#fef7ff', // Fuchsia-50
    '#f0fdfa', // Teal-50
    '#1e40af', // Blue-800 (solid)
    '#059669', // Emerald-600 (solid)
    '#dc2626', // Red-600 (solid)
    '#7c3aed', // Violet-600 (solid)
    '#ea580c', // Orange-600 (solid)
    '#0891b2', // Cyan-600 (solid)
  ];

  const updateTemplateStyle = (
    section: string,
    property: string,
    value: string | number
  ) => {
    const updatedTemplate = { ...template } as ResumeTemplate & { customStyles?: Record<string, Record<string, string>> };

    if (!updatedTemplate.layout) {
      updatedTemplate.layout = {
        sections: [],
        columns: 1,
        colors: {
          primary: '#1e40af',
          secondary: '#6b7280',
          accent: '#3b82f6',
          background: '#ffffff',
          text: '#1f2937',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
          size: {
            heading: '1.5rem',
            subheading: '1.25rem',
            body: '1rem',
            small: '0.875rem',
          },
        },
        spacing: { padding: '1rem', margins: '0.5rem', lineHeight: 1.5, sectionGap: '1rem' },
      };
    }

    // Update section-specific styles in customStyles property
    if (!updatedTemplate.customStyles) {
      updatedTemplate.customStyles = {};
    }

    if (!updatedTemplate.customStyles[section]) {
      updatedTemplate.customStyles[section] = {};
    }

    updatedTemplate.customStyles[section][property] = String(value);

    // Debug: Log the changes
    // console.log('🎨 Template Customizer - Updating:', {
    //   section,
    //   property,
    //   value,
    //   updatedTemplate: updatedTemplate.customStyles[section],
    // });

    onTemplateChange(updatedTemplate);
  };

  const getCurrentValue = (section: string, property: string): string => {
    return (
      (template as ResumeTemplate & { customStyles?: Record<string, Record<string, string>> }).customStyles?.[section]?.[property] ||
      getDefaultValue(section, property)
    );
  };

  const getDefaultValue = (section: string, property: string): string => {
    const defaults: Record<string, Record<string, string>> = {
      header: {
        fontSize: '1.5rem',
        fontFamily: 'Inter',
        color: '#1e40af',
        backgroundColor: '#ffffff',
        spacing: '1rem',
      },
      body: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.5rem',
      },
      skills: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#374151',
        backgroundColor: '#f9fafb',
        spacing: '0.25rem',
      },
      skillsTags: {
        fontSize: '0.75rem',
        fontFamily: 'Inter',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        spacing: '0.125rem',
      },
      experience: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.75rem',
      },
      education: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.75rem',
      },
      headings: {
        fontSize: '1.25rem',
        fontFamily: 'Inter',
        color: '#1e40af',
        backgroundColor: '#f3f4f6',
        spacing: '0.5rem',
      },
      buttons: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#ffffff',
        backgroundColor: '#3b82f6',
        spacing: '0.5rem',
      },
      contact: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#6b7280',
        backgroundColor: '#f9fafb',
        spacing: '0.25rem',
      },
      projects: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#ffffff',
        spacing: '0.75rem',
      },
      achievements: {
        fontSize: '0.875rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#fef3c7',
        spacing: '0.5rem',
      },
      summary: {
        fontSize: '1rem',
        fontFamily: 'Inter',
        color: '#1f2937',
        backgroundColor: '#f0f9ff',
        spacing: '0.75rem',
      },
    };

    return defaults[section]?.[property] || '';
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 ${className}`}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className='relative group'>
              <Button
                onClick={() => setIsExpanded(true)}
                className='w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
                aria-label='Template Customizer'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                  />
                </svg>
              </Button>

              {/* Tooltip */}
              {showTooltip && (
                <div className='absolute left-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                  <div className='bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowTooltip(false);
                      }}
                      className='absolute -top-1 -right-1 w-4 h-4 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xs text-white transition-colors pointer-events-auto'
                      title='Close tooltip'
                    >
                      ×
                    </button>
                    <div className='font-medium'>🎨 Template Customizer</div>
                    <div className='text-xs text-gray-300 mt-1'>
                      Customize fonts, colors & spacing
                    </div>
                    <div className='absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45'></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className='w-96 max-h-[80vh] overflow-y-auto'
          >
            <Card className='p-4 bg-white shadow-xl border border-gray-200'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                    />
                  </svg>
                  Template Customizer
                </h3>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant='outline'
                  size='sm'
                  className='w-8 h-8 p-0'
                >
                  ×
                </Button>
              </div>

              <div className='space-y-4'>
                {styleSections.map(section => (
                  <div
                    key={section.key}
                    className='border border-gray-200 rounded-lg p-3'
                  >
                    <div className='flex items-center justify-between mb-3'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-lg'>{section.icon}</span>
                        <h4 className='font-medium text-gray-900'>
                          {section.label}
                        </h4>
                      </div>
                      <Button
                        onClick={() =>
                          setActiveSection(
                            activeSection === section.key ? null : section.key
                          )
                        }
                        variant='outline'
                        size='sm'
                        className='text-xs'
                      >
                        {activeSection === section.key ? 'Hide' : 'Customize'}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {activeSection === section.key && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className='space-y-3'
                        >
                          {/* Font Family */}
                          {section.properties.fontFamily && (
                            <div>
                              <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                Font Family
                              </label>
                              <select
                                value={getCurrentValue(
                                  section.key,
                                  'fontFamily'
                                )}
                                onChange={e =>
                                  updateTemplateStyle(
                                    section.key,
                                    'fontFamily',
                                    e.target.value
                                  )
                                }
                                className='w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500'
                              >
                                {fontFamilies.map(font => (
                                  <option
                                    key={font}
                                    value={font}
                                    style={{ fontFamily: font }}
                                  >
                                    {font}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Font Size */}
                          {section.properties.fontSize && (
                            <div>
                              <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                Font Size:{' '}
                                {getCurrentValue(section.key, 'fontSize')}
                              </label>
                              <input
                                type='range'
                                min='0.75'
                                max='2'
                                step='0.125'
                                value={parseFloat(
                                  getCurrentValue(
                                    section.key,
                                    'fontSize'
                                  ).replace('rem', '')
                                )}
                                onChange={e =>
                                  updateTemplateStyle(
                                    section.key,
                                    'fontSize',
                                    `${e.target.value}rem`
                                  )
                                }
                                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                              />
                            </div>
                          )}

                          {/* Text Color */}
                          {section.properties.color && (
                            <div>
                              <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                Text Color
                              </label>
                              <div className='grid grid-cols-6 gap-1'>
                                {colorPresets.map(color => (
                                  <button
                                    key={color}
                                    onClick={() =>
                                      updateTemplateStyle(
                                        section.key,
                                        'color',
                                        color
                                      )
                                    }
                                    className={`w-5 h-5 rounded border-2 ${
                                      getCurrentValue(section.key, 'color') ===
                                      color
                                        ? 'border-gray-400 ring-2 ring-gray-300'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                              <div className='mt-2'>
                                <input
                                  type='color'
                                  value={getCurrentValue(section.key, 'color')}
                                  onChange={e =>
                                    updateTemplateStyle(
                                      section.key,
                                      'color',
                                      e.target.value
                                    )
                                  }
                                  className='w-full h-8 rounded border border-gray-300 cursor-pointer'
                                  title='Custom text color picker'
                                />
                              </div>
                            </div>
                          )}

                          {/* Background Color */}
                          {section.properties.backgroundColor && (
                            <div>
                              <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                Background Color / Fill
                              </label>
                              <div className='grid grid-cols-6 gap-1'>
                                {backgroundPresets.map(color => (
                                  <button
                                    key={color}
                                    onClick={() =>
                                      updateTemplateStyle(
                                        section.key,
                                        'backgroundColor',
                                        color
                                      )
                                    }
                                    className={`w-5 h-5 rounded border-2 ${
                                      getCurrentValue(
                                        section.key,
                                        'backgroundColor'
                                      ) === color
                                        ? 'border-gray-400 ring-2 ring-gray-300'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                              <div className='mt-2'>
                                <input
                                  type='color'
                                  value={getCurrentValue(
                                    section.key,
                                    'backgroundColor'
                                  )}
                                  onChange={e =>
                                    updateTemplateStyle(
                                      section.key,
                                      'backgroundColor',
                                      e.target.value
                                    )
                                  }
                                  className='w-full h-8 rounded border border-gray-300 cursor-pointer'
                                  title='Custom color picker'
                                />
                              </div>
                            </div>
                          )}

                          {/* Spacing */}
                          {section.properties.spacing && (
                            <div>
                              <label className='text-xs font-medium text-gray-700 mb-1 block'>
                                Spacing:{' '}
                                {getCurrentValue(section.key, 'spacing')}
                              </label>
                              <input
                                type='range'
                                min='0'
                                max='2'
                                step='0.125'
                                value={parseFloat(
                                  getCurrentValue(
                                    section.key,
                                    'spacing'
                                  ).replace('rem', '')
                                )}
                                onChange={e =>
                                  updateTemplateStyle(
                                    section.key,
                                    'spacing',
                                    `${e.target.value}rem`
                                  )
                                }
                                className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Reset Button */}
              <div className='mt-4 pt-4 border-t border-gray-200'>
                <Button
                  onClick={() => {
                    // Reset to default template
                    const defaultTemplate = { ...template } as ResumeTemplate & { customStyles?: Record<string, Record<string, string>> };
                    if (defaultTemplate.customStyles) {
                      delete defaultTemplate.customStyles;
                    }
                    onTemplateChange(defaultTemplate);
                  }}
                  variant='outline'
                  size='sm'
                  className='w-full'
                >
                  Reset to Default
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingTemplateCustomizer;
