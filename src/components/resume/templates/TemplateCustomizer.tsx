'use client';

import React, { useState } from 'react';

import { ColorScheme, FontConfig, ResumeTemplate } from '@/types/resume';

interface TemplateCustomizerProps {
  template: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
  className?: string;
}

export const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  onTemplateChange,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'fonts' | 'colors' | 'sections' | 'layout' | 'background'
  >('fonts');

  // Font options
  const fontOptions = [
    { name: 'Inter', category: 'Sans-serif', value: 'Inter' },
    { name: 'Poppins', category: 'Sans-serif', value: 'Poppins' },
    { name: 'Roboto', category: 'Sans-serif', value: 'Roboto' },
    { name: 'Open Sans', category: 'Sans-serif', value: 'Open Sans' },
    { name: 'Lato', category: 'Sans-serif', value: 'Lato' },
    { name: 'Montserrat', category: 'Sans-serif', value: 'Montserrat' },
    { name: 'Playfair Display', category: 'Serif', value: 'Playfair Display' },
    { name: 'Merriweather', category: 'Serif', value: 'Merriweather' },
    { name: 'Lora', category: 'Serif', value: 'Lora' },
    { name: 'Georgia', category: 'Serif', value: 'Georgia' },
    { name: 'Times New Roman', category: 'Serif', value: 'Times New Roman' },
  ];

  // Color schemes
  const colorSchemes = [
    {
      name: 'Professional Blue',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#3b82f6',
        text: '#1e293b',
        background: '#ffffff',
      },
    },
    {
      name: 'Modern Green',
      colors: {
        primary: '#059669',
        secondary: '#6b7280',
        accent: '#10b981',
        text: '#111827',
        background: '#ffffff',
      },
    },
    {
      name: 'Elegant Purple',
      colors: {
        primary: '#7c3aed',
        secondary: '#8b5cf6',
        accent: '#a855f7',
        text: '#1f2937',
        background: '#ffffff',
      },
    },
    {
      name: 'Bold Red',
      colors: {
        primary: '#dc2626',
        secondary: '#f59e0b',
        accent: '#ef4444',
        text: '#1f2937',
        background: '#ffffff',
      },
    },
    {
      name: 'Classic Black',
      colors: {
        primary: '#000000',
        secondary: '#6b7280',
        accent: '#374151',
        text: '#111827',
        background: '#ffffff',
      },
    },
  ];

  // Font size options
  const fontSizeOptions = [
    {
      name: 'Small',
      heading: 'text-2xl',
      subheading: 'text-lg',
      body: 'text-sm',
      small: 'text-xs',
    },
    {
      name: 'Medium',
      heading: 'text-3xl',
      subheading: 'text-xl',
      body: 'text-base',
      small: 'text-sm',
    },
    {
      name: 'Large',
      heading: 'text-4xl',
      subheading: 'text-2xl',
      body: 'text-lg',
      small: 'text-base',
    },
  ];

  const handleFontChange = (
    fontType: 'heading' | 'body',
    fontFamily: string
  ) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        fonts: {
          ...template.layout.fonts,
          [fontType]: fontFamily,
        },
      },
    };
    onTemplateChange(updatedTemplate);
  };

  const handleColorChange = (colorScheme: ColorScheme) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        colors: colorScheme,
      },
    };
    onTemplateChange(updatedTemplate);
  };

  const handleFontSizeChange = (sizeConfig: FontConfig['size']) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        fonts: {
          ...template.layout.fonts,
          size: sizeConfig,
        },
      },
    };
    onTemplateChange(updatedTemplate);
  };

  const handleSectionToggle = (section: string, enabled: boolean) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        sections: {
          ...template.layout.sections,
          [section]: enabled,
        },
      },
    };
    onTemplateChange(updatedTemplate);
  };

  const handleSpacingChange = (
    spacingType: keyof typeof template.layout.spacing,
    value: string | number
  ) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        spacing: {
          ...template.layout.spacing,
          [spacingType]: value,
        },
      },
    };
    onTemplateChange(updatedTemplate);
  };

  const handleBackgroundColorChange = (
    colorType: keyof typeof template.layout.colors,
    value: string
  ) => {
    const updatedTemplate = {
      ...template,
      layout: {
        ...template.layout,
        colors: {
          ...template.layout.colors,
          [colorType]: value,
        },
      },
    };
    onTemplateChange(updatedTemplate);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-slate-200 p-3 sm:p-4 lg:p-6 ${className}`}
    >
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-lg font-semibold text-slate-900 mb-2'>
              Customize Template
            </h3>
            <p className='text-sm text-slate-600'>
              Personalize your resume template
            </p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors'
          >
            <span>{isCollapsed ? 'Expand' : 'Collapse'}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed ? 'rotate-0' : 'rotate-180'
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation - Only show when expanded */}
      {!isCollapsed && (
        <>
          <div className='flex flex-wrap gap-1 mb-4 sm:mb-6 bg-slate-100 rounded-lg p-1'>
            {[
              { id: 'fonts', label: 'Fonts', icon: '🔤' },
              { id: 'colors', label: 'Colors', icon: '🎨' },
              { id: 'sections', label: 'Sections', icon: '📋' },
              { id: 'layout', label: 'Layout', icon: '📐' },
              { id: 'background', label: 'Background', icon: '🎭' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | 'colors'
                      | 'fonts'
                      | 'sections'
                      | 'layout'
                      | 'background'
                  )
                }
                className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Font Customization */}
          {activeTab === 'fonts' && (
            <div className='space-y-6'>
              {/* Font Family Selection */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Font Family
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs text-slate-500 mb-2'>
                      Heading Font
                    </label>
                    <select
                      value={template.layout.fonts.heading}
                      onChange={e =>
                        handleFontChange('heading', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      {fontOptions.map(font => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs text-slate-500 mb-2'>
                      Body Font
                    </label>
                    <select
                      value={template.layout.fonts.body}
                      onChange={e => handleFontChange('body', e.target.value)}
                      className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      {fontOptions.map(font => (
                        <option key={font.value} value={font.value}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Font Size Selection */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Font Size
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {fontSizeOptions.map(size => (
                    <button
                      key={size.name}
                      onClick={() => handleFontSizeChange(size)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        JSON.stringify(template.layout.fonts.size) ===
                        JSON.stringify(size)
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Color Customization */}
          {activeTab === 'colors' && (
            <div className='space-y-6'>
              {/* Color Scheme Selection */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Color Scheme
                </label>
                <div className='grid grid-cols-1 gap-3'>
                  {colorSchemes.map(scheme => (
                    <button
                      key={scheme.name}
                      onClick={() => handleColorChange(scheme.colors)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        JSON.stringify(template.layout.colors) ===
                        JSON.stringify(scheme.colors)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex gap-1'>
                          <div
                            className='w-4 h-4 rounded-full border border-slate-300'
                            style={{ backgroundColor: scheme.colors.primary }}
                          />
                          <div
                            className='w-4 h-4 rounded-full border border-slate-300'
                            style={{ backgroundColor: scheme.colors.accent }}
                          />
                          <div
                            className='w-4 h-4 rounded-full border border-slate-300'
                            style={{ backgroundColor: scheme.colors.secondary }}
                          />
                        </div>
                        <span className='text-sm font-medium text-slate-900'>
                          {scheme.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Preview */}
              <div className='p-4 bg-slate-50 rounded-lg'>
                <div className='text-xs text-slate-500 mb-2'>Preview</div>
                <div className='space-y-2'>
                  <div
                    style={{
                      color: template.layout.colors.primary,
                      fontWeight: 'bold',
                    }}
                  >
                    Professional Experience
                  </div>
                  <div
                    style={{
                      color: template.layout.colors.text,
                    }}
                  >
                    Senior Software Engineer at Tech Company
                  </div>
                  <div
                    style={{
                      color: template.layout.colors.secondary,
                    }}
                  >
                    2022 - Present
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section Management */}
          {activeTab === 'sections' && (
            <div className='space-y-4'>
              <div className='text-sm font-medium text-slate-700 mb-3'>
                Resume Sections
              </div>
              {[
                { id: 'summary', label: 'Professional Summary', enabled: true },
                {
                  id: 'experience',
                  label: 'Professional Experience',
                  enabled: true,
                },
                { id: 'education', label: 'Education', enabled: true },
                { id: 'skills', label: 'Skills', enabled: true },
                { id: 'projects', label: 'Projects', enabled: false },
                { id: 'achievements', label: 'Achievements', enabled: false },
              ].map(section => (
                <div
                  key={section.id}
                  className='flex items-center justify-between p-3 bg-slate-50 rounded-lg'
                >
                  <span className='text-sm font-medium text-slate-900'>
                    {section.label}
                  </span>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={section.enabled}
                      onChange={e =>
                        handleSectionToggle(section.id, e.target.checked)
                      }
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Layout Customization */}
          {activeTab === 'layout' && (
            <div className='space-y-6'>
              {/* Margin Settings */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Page Margins
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <label className='block text-xs text-slate-500 mb-2'>
                      Margin Size
                    </label>
                    <select
                      value={template.layout.spacing.margins}
                      onChange={e =>
                        handleSpacingChange('margins', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value='0.1in'>Minimal (0.1&ldquo;)</option>
                      <option value='0.2in'>Small (0.2&ldquo;)</option>
                      <option value='0.3in'>Medium (0.3&ldquo;)</option>
                      <option value='0.5in'>Large (0.5&ldquo;)</option>
                      <option value='0.75in'>Extra Large (0.75&ldquo;)</option>
                      <option value='1in'>Maximum (1&ldquo;)</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-xs text-slate-500 mb-2'>
                      Section Spacing
                    </label>
                    <select
                      value={template.layout.spacing.sectionGap}
                      onChange={e =>
                        handleSpacingChange('sectionGap', e.target.value)
                      }
                      className='w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    >
                      <option value='mb-2'>Tight (mb-2)</option>
                      <option value='mb-3'>Compact (mb-3)</option>
                      <option value='mb-4'>Normal (mb-4)</option>
                      <option value='mb-6'>Spacious (mb-6)</option>
                      <option value='mb-8'>Loose (mb-8)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Line Height
                </label>
                <div className='grid grid-cols-3 gap-2'>
                  {[
                    { name: 'Tight', value: 1.1 },
                    { name: 'Normal', value: 1.4 },
                    { name: 'Loose', value: 1.6 },
                  ].map(option => (
                    <button
                      key={option.name}
                      onClick={() =>
                        handleSpacingChange('lineHeight', option.value)
                      }
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        template.layout.spacing.lineHeight === option.value
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Preview */}
              <div className='p-4 bg-slate-50 rounded-lg'>
                <div className='text-xs text-slate-500 mb-2'>
                  Layout Preview
                </div>
                <div className='space-y-2 text-xs'>
                  <div className='font-semibold text-slate-900'>
                    Current Settings:
                  </div>
                  <div className='text-slate-600'>
                    Margins: {template.layout.spacing.margins}
                  </div>
                  <div className='text-slate-600'>
                    Section Gap: {template.layout.spacing.sectionGap}
                  </div>
                  <div className='text-slate-600'>
                    Line Height: {template.layout.spacing.lineHeight}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Background Customization */}
          {activeTab === 'background' && (
            <div className='space-y-6'>
              {/* Background Colors */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Background Colors
                </label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs text-slate-500 mb-2'>
                      Main Background
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='color'
                        value={template.layout.colors.background || '#ffffff'}
                        onChange={e =>
                          handleBackgroundColorChange(
                            'background',
                            e.target.value
                          )
                        }
                        className='w-8 h-8 rounded border border-slate-300 cursor-pointer'
                        title='Main background color'
                      />
                      <input
                        type='text'
                        value={template.layout.colors.background || '#ffffff'}
                        onChange={e =>
                          handleBackgroundColorChange(
                            'background',
                            e.target.value
                          )
                        }
                        className='flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500'
                        placeholder='#ffffff'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-xs text-slate-500 mb-2'>
                      Card Background
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='color'
                        value={template.layout.colors.card || '#ffffff'}
                        onChange={e =>
                          handleBackgroundColorChange('card', e.target.value)
                        }
                        className='w-8 h-8 rounded border border-slate-300 cursor-pointer'
                        title='Card background color'
                      />
                      <input
                        type='text'
                        value={template.layout.colors.card || '#ffffff'}
                        onChange={e =>
                          handleBackgroundColorChange('card', e.target.value)
                        }
                        className='flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500'
                        placeholder='#ffffff'
                      />
                    </div>
                  </div>
                  {template.layout.sidebar && (
                    <>
                      <div>
                        <label className='block text-xs text-slate-500 mb-2'>
                          Sidebar Background
                        </label>
                        <div className='flex gap-2'>
                          <input
                            type='color'
                            value={
                              template.layout.colors.sidebar ||
                              template.layout.colors.primary
                            }
                            onChange={e =>
                              handleBackgroundColorChange(
                                'sidebar',
                                e.target.value
                              )
                            }
                            className='w-8 h-8 rounded border border-slate-300 cursor-pointer'
                            title='Sidebar background color'
                          />
                          <input
                            type='text'
                            value={
                              template.layout.colors.sidebar ||
                              template.layout.colors.primary
                            }
                            onChange={e =>
                              handleBackgroundColorChange(
                                'sidebar',
                                e.target.value
                              )
                            }
                            className='flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500'
                            placeholder='#000000'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-xs text-slate-500 mb-2'>
                          Sidebar Text
                        </label>
                        <div className='flex gap-2'>
                          <input
                            type='color'
                            value={
                              template.layout.colors.sidebarText || '#ffffff'
                            }
                            onChange={e =>
                              handleBackgroundColorChange(
                                'sidebarText',
                                e.target.value
                              )
                            }
                            className='w-8 h-8 rounded border border-slate-300 cursor-pointer'
                            title='Sidebar text color'
                          />
                          <input
                            type='text'
                            value={
                              template.layout.colors.sidebarText || '#ffffff'
                            }
                            onChange={e =>
                              handleBackgroundColorChange(
                                'sidebarText',
                                e.target.value
                              )
                            }
                            className='flex-1 px-2 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500'
                            placeholder='#ffffff'
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Background Presets */}
              <div>
                <label className='block text-sm font-medium text-slate-700 mb-3'>
                  Background Presets
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  {[
                    {
                      name: 'Clean White',
                      background: '#ffffff',
                      card: '#ffffff',
                      sidebar: '#0f172a',
                      sidebarText: '#ffffff',
                    },
                    {
                      name: 'Light Gray',
                      background: '#f8fafc',
                      card: '#ffffff',
                      sidebar: '#1e40af',
                      sidebarText: '#ffffff',
                    },
                    {
                      name: 'Soft Blue',
                      background: '#f0f8ff',
                      card: '#ffffff',
                      sidebar: '#004e89',
                      sidebarText: '#ffffff',
                    },
                    {
                      name: 'Warm Cream',
                      background: '#fef7ed',
                      card: '#ffffff',
                      sidebar: '#dc2626',
                      sidebarText: '#ffffff',
                    },
                  ].map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        handleBackgroundColorChange(
                          'background',
                          preset.background
                        );
                        handleBackgroundColorChange('card', preset.card);
                        if (template.layout.sidebar) {
                          handleBackgroundColorChange(
                            'sidebar',
                            preset.sidebar
                          );
                          handleBackgroundColorChange(
                            'sidebarText',
                            preset.sidebarText
                          );
                        }
                      }}
                      className='p-3 rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-all text-left'
                    >
                      <div className='flex items-center gap-3'>
                        <div className='flex gap-1'>
                          <div
                            className='w-4 h-4 rounded-full border border-slate-300'
                            style={{ backgroundColor: preset.background }}
                          />
                          <div
                            className='w-4 h-4 rounded-full border border-slate-300'
                            style={{ backgroundColor: preset.card }}
                          />
                          {template.layout.sidebar && (
                            <div
                              className='w-4 h-4 rounded-full border border-slate-300'
                              style={{ backgroundColor: preset.sidebar }}
                            />
                          )}
                        </div>
                        <span className='text-sm font-medium text-slate-900'>
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Preview */}
              <div className='p-4 bg-slate-50 rounded-lg'>
                <div className='text-xs text-slate-500 mb-2'>
                  Background Preview
                </div>
                <div className='space-y-2 text-xs'>
                  <div className='font-semibold text-slate-900'>
                    Current Colors:
                  </div>
                  <div className='text-slate-600'>
                    Main: {template.layout.colors.background || '#ffffff'}
                  </div>
                  <div className='text-slate-600'>
                    Card: {template.layout.colors.card || '#ffffff'}
                  </div>
                  {template.layout.sidebar && (
                    <>
                      <div className='text-slate-600'>
                        Sidebar:{' '}
                        {template.layout.colors.sidebar ||
                          template.layout.colors.primary}
                      </div>
                      <div className='text-slate-600'>
                        Sidebar Text:{' '}
                        {template.layout.colors.sidebarText || '#ffffff'}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TemplateCustomizer;
