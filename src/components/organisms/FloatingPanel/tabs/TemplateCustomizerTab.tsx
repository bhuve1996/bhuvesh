'use client';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import React, { useCallback, useEffect, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeTemplate } from '@/types/resume';

interface TemplateCustomizerTabProps {
  template: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

interface SectionCustomization {
  id: string;
  type: string;
  visible: boolean;
  order: number;
  title: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: number;
    letterSpacing: string;
  };
  spacing: {
    marginTop: string;
    marginBottom: string;
    padding: string;
  };
  formatting: {
    bulletStyle: string;
    dateFormat: string;
    showIcons: boolean;
  };
}

export const TemplateCustomizerTab: React.FC<TemplateCustomizerTabProps> = ({
  template,
  onTemplateChange,
}) => {
  const {
    setSectionColors,
    setTemplateCustomizations,
    templateCustomizations,
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<
    'layout' | 'sections' | 'typography' | 'colors' | 'spacing' | 'content'
  >('layout');

  // Initialize customizations from global state instead of template props
  const [customizations, setCustomizations] = useState({
    // Layout - use global state as source of truth
    columns: templateCustomizations.layout.columns,
    sidebar: templateCustomizations.layout.sidebar,
    margins: templateCustomizations.layout.margins,

    // Global Typography - use global state as source of truth
    fontFamily: templateCustomizations.typography.fontFamily,
    fontSize: templateCustomizations.typography.fontSize,
    lineHeight: templateCustomizations.typography.lineHeight,
    letterSpacing: templateCustomizations.typography.letterSpacing,

    // Global Colors - use global state as source of truth
    colorScheme: templateCustomizations.colors.colorScheme,
    primaryColor: templateCustomizations.colors.primaryColor,
    secondaryColor: templateCustomizations.colors.secondaryColor,
    accentColor: templateCustomizations.colors.accentColor,
    textColor: templateCustomizations.colors.textColor,
    backgroundColor: templateCustomizations.colors.backgroundColor,

    // Global Spacing - use global state as source of truth
    sectionGap: templateCustomizations.spacing.sectionGap,
    padding: templateCustomizations.spacing.padding,

    // Content Formatting - use global state as source of truth
    bulletStyle: templateCustomizations.content.bulletStyle,
    dateFormat: templateCustomizations.content.dateFormat,
    showIcons: templateCustomizations.content.showIcons,
  });

  // Sync local state with global state changes
  useEffect(() => {
    setCustomizations({
      columns: templateCustomizations.layout.columns,
      sidebar: templateCustomizations.layout.sidebar,
      margins: templateCustomizations.layout.margins,
      fontFamily: templateCustomizations.typography.fontFamily,
      fontSize: templateCustomizations.typography.fontSize,
      lineHeight: templateCustomizations.typography.lineHeight,
      letterSpacing: templateCustomizations.typography.letterSpacing,
      colorScheme: templateCustomizations.colors.colorScheme,
      primaryColor: templateCustomizations.colors.primaryColor,
      secondaryColor: templateCustomizations.colors.secondaryColor,
      accentColor: templateCustomizations.colors.accentColor,
      textColor: templateCustomizations.colors.textColor,
      backgroundColor: templateCustomizations.colors.backgroundColor,
      sectionGap: templateCustomizations.spacing.sectionGap,
      padding: templateCustomizations.spacing.padding,
      bulletStyle: templateCustomizations.content.bulletStyle,
      dateFormat: templateCustomizations.content.dateFormat,
      showIcons: templateCustomizations.content.showIcons,
    });
  }, [templateCustomizations]);

  const [sectionCustomizations, setSectionCustomizations] = useState<
    SectionCustomization[]
  >([
    {
      id: 'header',
      type: 'header',
      visible: true,
      order: 0,
      title: 'Header',
      colors: {
        primary: customizations.primaryColor,
        secondary: customizations.secondaryColor,
        accent: customizations.accentColor,
        text: customizations.textColor,
        background: customizations.backgroundColor,
      },
      typography: {
        fontFamily: customizations.fontFamily,
        fontSize: '18',
        fontWeight: 'bold',
        lineHeight: 1.2,
        letterSpacing: '0',
      },
      spacing: {
        marginTop: '0',
        marginBottom: '1rem',
        padding: '0.5rem',
      },
      formatting: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
    },
    {
      id: 'summary',
      type: 'summary',
      visible: true,
      order: 1,
      title: 'Summary',
      colors: {
        primary: customizations.primaryColor,
        secondary: customizations.secondaryColor,
        accent: customizations.accentColor,
        text: customizations.textColor,
        background: customizations.backgroundColor,
      },
      typography: {
        fontFamily: customizations.fontFamily,
        fontSize: customizations.fontSize,
        fontWeight: 'normal',
        lineHeight: customizations.lineHeight,
        letterSpacing: customizations.letterSpacing,
      },
      spacing: {
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '0.5rem',
      },
      formatting: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
    },
    {
      id: 'experience',
      type: 'experience',
      visible: true,
      order: 2,
      title: 'Experience',
      colors: {
        primary: customizations.primaryColor,
        secondary: customizations.secondaryColor,
        accent: customizations.accentColor,
        text: customizations.textColor,
        background: customizations.backgroundColor,
      },
      typography: {
        fontFamily: customizations.fontFamily,
        fontSize: customizations.fontSize,
        fontWeight: 'normal',
        lineHeight: customizations.lineHeight,
        letterSpacing: customizations.letterSpacing,
      },
      spacing: {
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '0.5rem',
      },
      formatting: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
    },
    {
      id: 'education',
      type: 'education',
      visible: true,
      order: 3,
      title: 'Education',
      colors: {
        primary: customizations.primaryColor,
        secondary: customizations.secondaryColor,
        accent: customizations.accentColor,
        text: customizations.textColor,
        background: customizations.backgroundColor,
      },
      typography: {
        fontFamily: customizations.fontFamily,
        fontSize: customizations.fontSize,
        fontWeight: 'normal',
        lineHeight: customizations.lineHeight,
        letterSpacing: customizations.letterSpacing,
      },
      spacing: {
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '0.5rem',
      },
      formatting: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
    },
    {
      id: 'skills',
      type: 'skills',
      visible: true,
      order: 4,
      title: 'Skills',
      colors: {
        primary: customizations.primaryColor,
        secondary: customizations.secondaryColor,
        accent: customizations.accentColor,
        text: customizations.textColor,
        background: customizations.backgroundColor,
      },
      typography: {
        fontFamily: customizations.fontFamily,
        fontSize: customizations.fontSize,
        fontWeight: 'normal',
        lineHeight: customizations.lineHeight,
        letterSpacing: customizations.letterSpacing,
      },
      spacing: {
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '0.5rem',
      },
      formatting: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
    },
    {
      id: 'projects',
      type: 'projects',
      visible: true,
      order: 5,
      title: 'Projects',
      colors: {
        primary: customizations.primaryColor,
        secondary: customizations.secondaryColor,
        accent: customizations.accentColor,
        text: customizations.textColor,
        background: customizations.backgroundColor,
      },
      typography: {
        fontFamily: customizations.fontFamily,
        fontSize: customizations.fontSize,
        fontWeight: 'normal',
        lineHeight: customizations.lineHeight,
        letterSpacing: customizations.letterSpacing,
      },
      spacing: {
        marginTop: '0.5rem',
        marginBottom: '1rem',
        padding: '0.5rem',
      },
      formatting: {
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        showIcons: true,
      },
    },
  ]);

  const handleCustomizationChange = useCallback(
    (key: string, value: string | number | boolean) => {
      const newCustomizations = { ...customizations, [key]: value };
      setCustomizations(newCustomizations);

      // Update global state with new customizations
      setTemplateCustomizations({
        layout: {
          columns: newCustomizations.columns as 1 | 2,
          sidebar: newCustomizations.sidebar,
          margins: newCustomizations.margins,
        },
        typography: {
          fontFamily: newCustomizations.fontFamily,
          fontSize: newCustomizations.fontSize,
          lineHeight: newCustomizations.lineHeight,
          letterSpacing: newCustomizations.letterSpacing,
        },
        colors: {
          colorScheme: newCustomizations.colorScheme,
          primaryColor: newCustomizations.primaryColor,
          secondaryColor: newCustomizations.secondaryColor,
          accentColor: newCustomizations.accentColor,
          textColor: newCustomizations.textColor,
          backgroundColor: newCustomizations.backgroundColor,
        },
        spacing: {
          sectionGap: newCustomizations.sectionGap,
          padding: newCustomizations.padding,
        },
        content: {
          bulletStyle: newCustomizations.bulletStyle,
          dateFormat: newCustomizations.dateFormat,
          showIcons: newCustomizations.showIcons,
        },
        sectionCustomizations: {},
      });

      // Update template with new customizations
      const updatedTemplate: ResumeTemplate = {
        ...template,
        fontSize: newCustomizations.fontSize,
        fontFamily: newCustomizations.fontFamily,
        colorScheme: newCustomizations.colorScheme,
        layout: {
          ...template.layout,
          columns: newCustomizations.columns as 1 | 2,
          sidebar: newCustomizations.sidebar,
          colors: {
            primary: newCustomizations.primaryColor,
            secondary: newCustomizations.secondaryColor,
            accent: newCustomizations.accentColor,
            text: newCustomizations.textColor,
            background: newCustomizations.backgroundColor,
          },
          spacing: {
            lineHeight: newCustomizations.lineHeight,
            sectionGap: newCustomizations.sectionGap,
            margins: newCustomizations.margins,
            padding: newCustomizations.padding,
          },
        },
      };

      onTemplateChange(updatedTemplate);
    },
    [customizations, template, onTemplateChange, setTemplateCustomizations]
  );

  const handleSectionCustomizationChange = useCallback(
    (sectionId: string, key: string, value: string | number | boolean) => {
      const updatedSections = sectionCustomizations.map(section =>
        section.id === sectionId ? { ...section, [key]: value } : section
      );
      setSectionCustomizations(updatedSections);

      // Update section colors in store
      const section = sectionCustomizations.find(s => s.id === sectionId);
      if (section && key.startsWith('colors.')) {
        const colorKey = key.split('.')[1];
        const updatedColors = {
          ...section.colors,
          [colorKey as keyof typeof section.colors]: value,
        };
        setSectionColors(sectionId, updatedColors);
      }

      // Update template with section visibility changes
      if (key === 'visible') {
        // Initialize sections if they don't exist
        const defaultSections = [
          { id: 'header', visible: true, order: 0 },
          { id: 'summary', visible: true, order: 1 },
          { id: 'experience', visible: true, order: 2 },
          { id: 'education', visible: true, order: 3 },
          { id: 'skills', visible: true, order: 4 },
          { id: 'projects', visible: true, order: 5 },
          { id: 'achievements', visible: true, order: 6 },
        ];

        const existingSections = template.sections || defaultSections;
        const updatedSections = existingSections.map(section => {
          if (section.id === sectionId) {
            return { ...section, visible: value as boolean };
          }
          return section;
        });

        const updatedTemplate: ResumeTemplate = {
          ...template,
          sections: updatedSections,
        };
        onTemplateChange(updatedTemplate);
      }
    },
    [sectionCustomizations, setSectionColors, template, onTemplateChange]
  );

  const handleDragEnd = useCallback(
    (result: {
      destination: { index: number } | null;
      source: { index: number };
    }) => {
      if (!result.destination) return;

      const items = Array.from(sectionCustomizations);
      const [reorderedItem] = items.splice(result.source.index, 1);
      if (reorderedItem) {
        items.splice(result.destination.index, 0, reorderedItem);
      }

      // Update order numbers
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      setSectionCustomizations(updatedItems);
    },
    [sectionCustomizations]
  );

  const toggleSectionVisibility = useCallback(
    (sectionId: string) => {
      handleSectionCustomizationChange(
        sectionId,
        'visible',
        !sectionCustomizations.find(s => s.id === sectionId)?.visible
      );
    },
    [handleSectionCustomizationChange, sectionCustomizations]
  );

  const tabs = [
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'sections', label: 'Sections', icon: '📋' },
    { id: 'typography', label: 'Typography', icon: '🔤' },
    { id: 'colors', label: 'Colors', icon: '🎨' },
    { id: 'spacing', label: 'Spacing', icon: '📏' },
    { id: 'content', label: 'Content', icon: '📝' },
  ];

  const renderLayoutTab = () => (
    <div className='space-y-4'>
      {/* Columns */}
      <Card className='p-4'>
        <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
          Layout Columns
        </label>
        <div className='flex gap-2'>
          {[1, 2].map(columns => (
            <button
              key={columns}
              onClick={() => handleCustomizationChange('columns', columns)}
              className={`flex-1 p-3 rounded-lg border-2 ${
                customizations.columns === columns
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div className='text-sm font-medium'>
                {columns} Column{columns > 1 ? 's' : ''}
              </div>
              <div className='text-xs text-neutral-500 mt-1'>
                {columns === 1 ? 'Single column layout' : 'Two column layout'}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Sidebar */}
      <Card className='p-4'>
        <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
          Sidebar Layout
        </label>
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={customizations.sidebar}
            onChange={e =>
              handleCustomizationChange('sidebar', e.target.checked)
            }
            className='rounded border-neutral-300'
          />
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
            Enable sidebar layout
          </span>
        </div>
      </Card>

      {/* Margins */}
      <Card className='p-4'>
        <label className='block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2'>
          Page Margins
        </label>
        <select
          value={customizations.margins}
          onChange={e => handleCustomizationChange('margins', e.target.value)}
          className='w-full p-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
        >
          <option value='0.5in'>Narrow (0.5&ldquo;)</option>
          <option value='0.75in'>Medium (0.75&ldquo;)</option>
          <option value='1in'>Wide (1&ldquo;)</option>
          <option value='1.25in'>Extra Wide (1.25&ldquo;)</option>
        </select>
      </Card>
    </div>
  );

  const renderSectionsTab = () => (
    <div className='space-y-4'>
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Section Order & Visibility
        </h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId='sections'>
            {provided => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className='space-y-2'
              >
                {sectionCustomizations
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <Draggable
                      key={section.id}
                      draggableId={section.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-3 rounded-lg border-2 ${
                            snapshot.isDragging
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-neutral-200 bg-white'
                          }`}
                        >
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <div
                                {...provided.dragHandleProps}
                                className='cursor-grab'
                              >
                                ⋮⋮
                              </div>
                              <span className='text-sm font-medium'>
                                {section.title}
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <input
                                type='checkbox'
                                checked={section.visible}
                                onChange={() =>
                                  toggleSectionVisibility(section.id)
                                }
                                className='rounded border-neutral-300'
                              />
                              <span className='text-xs text-neutral-500'>
                                {section.visible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>
    </div>
  );

  const renderTypographyTab = () => (
    <div className='space-y-4'>
      {/* Global Typography */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Global Typography
        </h3>

        {/* Font Family */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
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
            <option value='Georgia'>Georgia</option>
            <option value='Verdana'>Verdana</option>
            <option value='Roboto'>Roboto</option>
            <option value='Open Sans'>Open Sans</option>
          </select>
        </div>

        {/* Font Size */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Base Font Size: {customizations.fontSize}px
          </label>
          <input
            type='range'
            min='10'
            max='18'
            value={customizations.fontSize}
            onChange={e =>
              handleCustomizationChange('fontSize', e.target.value)
            }
            className='w-full'
          />
        </div>

        {/* Line Height */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Line Height: {customizations.lineHeight}
          </label>
          <input
            type='range'
            min='1'
            max='2'
            step='0.1'
            value={customizations.lineHeight}
            onChange={e =>
              handleCustomizationChange(
                'lineHeight',
                parseFloat(e.target.value)
              )
            }
            className='w-full'
          />
        </div>

        {/* Letter Spacing */}
        <div>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Letter Spacing: {customizations.letterSpacing}px
          </label>
          <input
            type='range'
            min='-1'
            max='2'
            step='0.1'
            value={customizations.letterSpacing}
            onChange={e =>
              handleCustomizationChange('letterSpacing', e.target.value)
            }
            className='w-full'
          />
        </div>
      </Card>

      {/* Section-specific Typography */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Section Typography
        </h3>
        {sectionCustomizations.map(section => (
          <div
            key={section.id}
            className='mb-4 p-3 border border-neutral-200 rounded-lg'
          >
            <h4 className='text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              {section.title}
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Font Size
                </label>
                <input
                  type='range'
                  min='10'
                  max='20'
                  value={section.typography.fontSize}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'typography.fontSize',
                      e.target.value
                    )
                  }
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Font Weight
                </label>
                <select
                  value={section.typography.fontWeight}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'typography.fontWeight',
                      e.target.value
                    )
                  }
                  className='w-full p-1 text-xs border border-neutral-300 rounded'
                >
                  <option value='normal'>Normal</option>
                  <option value='medium'>Medium</option>
                  <option value='semibold'>Semi Bold</option>
                  <option value='bold'>Bold</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  const renderColorsTab = () => (
    <div className='space-y-4'>
      {/* Global Colors */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Global Color Scheme
        </h3>

        {/* Preset Color Schemes */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Preset Schemes
          </label>
          <div className='grid grid-cols-3 gap-2'>
            {[
              { name: 'blue', primary: '#3b82f6', secondary: '#64748b' },
              { name: 'green', primary: '#10b981', secondary: '#6b7280' },
              { name: 'purple', primary: '#8b5cf6', secondary: '#6b7280' },
              { name: 'red', primary: '#ef4444', secondary: '#6b7280' },
              { name: 'gray', primary: '#6b7280', secondary: '#9ca3af' },
              { name: 'black', primary: '#1f2937', secondary: '#4b5563' },
            ].map(scheme => (
              <button
                key={scheme.name}
                onClick={() => {
                  const newCustomizations = {
                    ...customizations,
                    colorScheme: scheme.name,
                    primaryColor: scheme.primary,
                    secondaryColor: scheme.secondary,
                  };
                  setCustomizations(newCustomizations);

                  // Update global state
                  setTemplateCustomizations({
                    layout: {
                      columns: newCustomizations.columns as 1 | 2,
                      sidebar: newCustomizations.sidebar,
                      margins: newCustomizations.margins,
                    },
                    typography: {
                      fontFamily: newCustomizations.fontFamily,
                      fontSize: newCustomizations.fontSize,
                      lineHeight: newCustomizations.lineHeight,
                      letterSpacing: newCustomizations.letterSpacing,
                    },
                    colors: {
                      colorScheme: newCustomizations.colorScheme,
                      primaryColor: newCustomizations.primaryColor,
                      secondaryColor: newCustomizations.secondaryColor,
                      accentColor: newCustomizations.accentColor,
                      textColor: newCustomizations.textColor,
                      backgroundColor: newCustomizations.backgroundColor,
                    },
                    spacing: {
                      sectionGap: newCustomizations.sectionGap,
                      padding: newCustomizations.padding,
                    },
                    content: {
                      bulletStyle: newCustomizations.bulletStyle,
                      dateFormat: newCustomizations.dateFormat,
                      showIcons: newCustomizations.showIcons,
                    },
                    sectionCustomizations: {},
                  });

                  // Update template
                  const updatedTemplate: ResumeTemplate = {
                    ...template,
                    fontSize: newCustomizations.fontSize,
                    fontFamily: newCustomizations.fontFamily,
                    colorScheme: newCustomizations.colorScheme,
                    layout: {
                      ...template.layout,
                      columns: newCustomizations.columns as 1 | 2,
                      sidebar: newCustomizations.sidebar,
                      colors: {
                        primary: newCustomizations.primaryColor,
                        secondary: newCustomizations.secondaryColor,
                        accent: newCustomizations.accentColor,
                        text: newCustomizations.textColor,
                        background: newCustomizations.backgroundColor,
                      },
                      spacing: {
                        lineHeight: newCustomizations.lineHeight,
                        sectionGap: newCustomizations.sectionGap,
                        margins: newCustomizations.margins,
                        padding: newCustomizations.padding,
                      },
                    },
                  };
                  onTemplateChange(updatedTemplate);
                }}
                className={`p-2 rounded-lg border-2 ${
                  customizations.colorScheme === scheme.name
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div
                  className='w-6 h-6 rounded mx-auto mb-1'
                  style={{ backgroundColor: scheme.primary }}
                />
                <span className='text-xs capitalize'>{scheme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              Primary Color
            </label>
            <input
              type='color'
              value={customizations.primaryColor}
              onChange={e =>
                handleCustomizationChange('primaryColor', e.target.value)
              }
              className='w-full h-10 rounded border border-neutral-300'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              Secondary Color
            </label>
            <input
              type='color'
              value={customizations.secondaryColor}
              onChange={e =>
                handleCustomizationChange('secondaryColor', e.target.value)
              }
              className='w-full h-10 rounded border border-neutral-300'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              Accent Color
            </label>
            <input
              type='color'
              value={customizations.accentColor}
              onChange={e =>
                handleCustomizationChange('accentColor', e.target.value)
              }
              className='w-full h-10 rounded border border-neutral-300'
            />
          </div>
          <div>
            <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              Text Color
            </label>
            <input
              type='color'
              value={customizations.textColor}
              onChange={e =>
                handleCustomizationChange('textColor', e.target.value)
              }
              className='w-full h-10 rounded border border-neutral-300'
            />
          </div>
        </div>
      </Card>

      {/* Section-specific Colors */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Section Colors
        </h3>
        {sectionCustomizations.map(section => (
          <div
            key={section.id}
            className='mb-4 p-3 border border-neutral-200 rounded-lg'
          >
            <h4 className='text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              {section.title}
            </h4>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Primary
                </label>
                <input
                  type='color'
                  value={section.colors.primary}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'colors.primary',
                      e.target.value
                    )
                  }
                  className='w-full h-8 rounded border border-neutral-300'
                />
              </div>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Text
                </label>
                <input
                  type='color'
                  value={section.colors.text}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'colors.text',
                      e.target.value
                    )
                  }
                  className='w-full h-8 rounded border border-neutral-300'
                />
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  const renderSpacingTab = () => (
    <div className='space-y-4'>
      {/* Global Spacing */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Global Spacing
        </h3>

        {/* Section Gap */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Section Gap: {customizations.sectionGap}
          </label>
          <input
            type='range'
            min='0.5'
            max='3'
            step='0.25'
            value={parseFloat(customizations.sectionGap)}
            onChange={e =>
              handleCustomizationChange('sectionGap', `${e.target.value}rem`)
            }
            className='w-full'
          />
        </div>

        {/* Padding */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Content Padding: {customizations.padding}
          </label>
          <input
            type='range'
            min='0.5'
            max='2'
            step='0.25'
            value={parseFloat(customizations.padding)}
            onChange={e =>
              handleCustomizationChange('padding', `${e.target.value}rem`)
            }
            className='w-full'
          />
        </div>
      </Card>

      {/* Section-specific Spacing */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Section Spacing
        </h3>
        {sectionCustomizations.map(section => (
          <div
            key={section.id}
            className='mb-4 p-3 border border-neutral-200 rounded-lg'
          >
            <h4 className='text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
              {section.title}
            </h4>
            <div className='grid grid-cols-3 gap-2'>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Top Margin
                </label>
                <select
                  value={section.spacing.marginTop}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'spacing.marginTop',
                      e.target.value
                    )
                  }
                  className='w-full p-1 text-xs border border-neutral-300 rounded'
                >
                  <option value='0'>None</option>
                  <option value='0.25rem'>Small</option>
                  <option value='0.5rem'>Medium</option>
                  <option value='1rem'>Large</option>
                  <option value='1.5rem'>Extra Large</option>
                </select>
              </div>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Bottom Margin
                </label>
                <select
                  value={section.spacing.marginBottom}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'spacing.marginBottom',
                      e.target.value
                    )
                  }
                  className='w-full p-1 text-xs border border-neutral-300 rounded'
                >
                  <option value='0'>None</option>
                  <option value='0.25rem'>Small</option>
                  <option value='0.5rem'>Medium</option>
                  <option value='1rem'>Large</option>
                  <option value='1.5rem'>Extra Large</option>
                </select>
              </div>
              <div>
                <label className='block text-xs text-neutral-500 mb-1'>
                  Padding
                </label>
                <select
                  value={section.spacing.padding}
                  onChange={e =>
                    handleSectionCustomizationChange(
                      section.id,
                      'spacing.padding',
                      e.target.value
                    )
                  }
                  className='w-full p-1 text-xs border border-neutral-300 rounded'
                >
                  <option value='0'>None</option>
                  <option value='0.25rem'>Small</option>
                  <option value='0.5rem'>Medium</option>
                  <option value='1rem'>Large</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );

  const renderContentTab = () => (
    <div className='space-y-4'>
      {/* Content Formatting */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Content Formatting
        </h3>

        {/* Bullet Style */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Bullet Style
          </label>
          <div className='grid grid-cols-2 gap-2'>
            {[
              { value: 'disc', label: '• Disc' },
              { value: 'circle', label: '○ Circle' },
              { value: 'square', label: '■ Square' },
              { value: 'dash', label: '— Dash' },
              { value: 'arrow', label: '→ Arrow' },
              { value: 'none', label: 'None' },
            ].map(style => (
              <button
                key={style.value}
                onClick={() =>
                  handleCustomizationChange('bulletStyle', style.value)
                }
                className={`p-2 rounded-lg border-2 text-xs ${
                  customizations.bulletStyle === style.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Format */}
        <div className='mb-4'>
          <label className='block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2'>
            Date Format
          </label>
          <select
            value={customizations.dateFormat}
            onChange={e =>
              handleCustomizationChange('dateFormat', e.target.value)
            }
            className='w-full p-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500'
          >
            <option value='MMM YYYY'>Jan 2023</option>
            <option value='MM/YYYY'>01/2023</option>
            <option value='MMM DD, YYYY'>Jan 15, 2023</option>
            <option value='YYYY'>2023</option>
            <option value='MMM YYYY - MMM YYYY'>Jan 2023 - Dec 2023</option>
          </select>
        </div>

        {/* Show Icons */}
        <div className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={customizations.showIcons}
            onChange={e =>
              handleCustomizationChange('showIcons', e.target.checked)
            }
            className='rounded border-neutral-300'
          />
          <span className='text-sm text-neutral-600 dark:text-neutral-400'>
            Show section icons
          </span>
        </div>
      </Card>

      {/* Presets */}
      <Card className='p-4'>
        <h3 className='text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3'>
          Quick Presets
        </h3>
        <div className='grid grid-cols-2 gap-2'>
          <button
            onClick={() => {
              handleCustomizationChange('fontSize', '12');
              handleCustomizationChange('lineHeight', 1.2);
              handleCustomizationChange('sectionGap', '0.5rem');
              handleCustomizationChange('padding', '0.5rem');
            }}
            className='p-2 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs'
          >
            Compact
          </button>
          <button
            onClick={() => {
              handleCustomizationChange('fontSize', '14');
              handleCustomizationChange('lineHeight', 1.5);
              handleCustomizationChange('sectionGap', '1rem');
              handleCustomizationChange('padding', '1rem');
            }}
            className='p-2 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs'
          >
            Standard
          </button>
          <button
            onClick={() => {
              handleCustomizationChange('fontSize', '16');
              handleCustomizationChange('lineHeight', 1.8);
              handleCustomizationChange('sectionGap', '1.5rem');
              handleCustomizationChange('padding', '1.5rem');
            }}
            className='p-2 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs'
          >
            Spacious
          </button>
          <button
            onClick={() => {
              handleCustomizationChange('fontSize', '14');
              handleCustomizationChange('lineHeight', 1.4);
              handleCustomizationChange('sectionGap', '0.75rem');
              handleCustomizationChange('padding', '0.75rem');
              handleCustomizationChange('columns', 2);
            }}
            className='p-2 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs'
          >
            Two Column
          </button>
        </div>
      </Card>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'layout':
        return renderLayoutTab();
      case 'sections':
        return renderSectionsTab();
      case 'typography':
        return renderTypographyTab();
      case 'colors':
        return renderColorsTab();
      case 'spacing':
        return renderSpacingTab();
      case 'content':
        return renderContentTab();
      default:
        return renderLayoutTab();
    }
  };

  return (
    <div
      className='h-full overflow-y-auto scrollbar-thin'
      data-tour='customize-tab'
    >
      <div className='text-center mb-4'>
        <h4 className='text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1'>
          Template Customization
        </h4>
        <p className='text-xs text-neutral-600 dark:text-neutral-400'>
          Customize every aspect of your resume template
        </p>
      </div>

      {/* Tab Navigation */}
      <div className='mb-3'>
        <div className='flex overflow-x-auto gap-0.5 scrollbar-slim'>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'layout'
                    | 'sections'
                    | 'typography'
                    | 'colors'
                    | 'spacing'
                    | 'content'
                )
              }
              className={`flex-shrink-0 px-1 py-0.5 text-xs font-medium rounded-md whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span className='mr-0.5'>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className='space-y-2 sm:space-y-3'>{renderActiveTab()}</div>
    </div>
  );
};

export default TemplateCustomizerTab;
