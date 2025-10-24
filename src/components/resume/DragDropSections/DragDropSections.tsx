'use client';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import { SectionConfig } from '@/types/resume';

interface DragDropSectionsProps {
  sections: SectionConfig[];
  onSectionsChange: (sections: SectionConfig[]) => void;
  onAddSection: () => void;
  onRemoveSection: (sectionId: string) => void;
}

interface SortableSectionProps {
  section: SectionConfig;
  onRemove: (sectionId: string) => void;
}

const SortableSection: React.FC<SortableSectionProps> = ({
  section,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.type });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSectionIcon = (type: string) => {
    const icons: Record<string, string> = {
      header: '👤',
      summary: '📝',
      experience: '💼',
      education: '🎓',
      skills: '🛠️',
      projects: '🚀',
      achievements: '🏆',
    };
    return icons[type] || '📄';
  };

  const getSectionTitle = (type: string) => {
    const titles: Record<string, string> = {
      header: 'Contact Information',
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      achievements: 'Achievements',
    };
    return titles[type] || type;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'z-50' : ''}`}
    >
      <Card className='p-4 mb-3 bg-white border border-gray-200 hover:border-cyan-400 transition-colors'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className='cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded'
              title='Drag to reorder'
            >
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 8h16M4 16h16'
                />
              </svg>
            </div>

            {/* Section Icon */}
            <span className='text-2xl'>{getSectionIcon(section.type)}</span>

            {/* Section Info */}
            <div>
              <h3 className='font-semibold text-gray-900'>
                {getSectionTitle(section.type)}
              </h3>
              <div className='flex items-center space-x-2 text-sm text-gray-500'>
                <span>Order: {section.order}</span>
                {section.optional && (
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                    Optional
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Remove Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={() => onRemove(section.type)}
            className='text-red-600 hover:text-red-700 hover:bg-red-50'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const DragDropSections: React.FC<DragDropSectionsProps> = ({
  sections,
  onSectionsChange,
  onAddSection: _onAddSection,
  onRemoveSection,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex(
        section => section.type === active.id
      );
      const newIndex = sections.findIndex(section => section.type === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);

      // Update order numbers
      const updatedSections = newSections.map((section, index) => ({
        ...section,
        order: index + 1,
      }));

      onSectionsChange(updatedSections);
    }
  };

  const availableSections: SectionConfig[] = [
    {
      type: 'summary',
      order: 0,
      optional: true,
      title: 'Professional Summary',
    },
    { type: 'experience', order: 0, optional: false, title: 'Work Experience' },
    { type: 'education', order: 0, optional: false, title: 'Education' },
    { type: 'skills', order: 0, optional: false, title: 'Skills' },
    { type: 'projects', order: 0, optional: true, title: 'Projects' },
    { type: 'achievements', order: 0, optional: true, title: 'Achievements' },
  ];

  const usedSectionTypes = sections.map(s => s.type);
  const unusedSections = availableSections.filter(
    s => !usedSectionTypes.includes(s.type)
  );

  return (
    <div className='space-y-6'>
      {/* Current Sections */}
      <div>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>
          Resume Sections
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          Drag and drop to reorder sections. The header section is always first
          and cannot be removed.
        </p>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map(s => s.type)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map(section => (
              <SortableSection
                key={section.type}
                section={section}
                onRemove={
                  section.type === 'header' ? () => {} : onRemoveSection
                }
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Add New Sections */}
      {unusedSections.length > 0 && (
        <div>
          <h4 className='text-md font-semibold text-gray-900 mb-3'>
            Add Sections
          </h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {unusedSections.map(section => (
              <Card
                key={section.type}
                className='p-3 cursor-pointer hover:border-cyan-400 transition-colors'
                onClick={() => {
                  const newSection: SectionConfig = {
                    ...section,
                    order: sections.length + 1,
                  };
                  onSectionsChange([...sections, newSection]);
                }}
              >
                <div className='flex items-center space-x-3'>
                  <span className='text-xl'>
                    {section.type === 'summary' && '📝'}
                    {section.type === 'experience' && '💼'}
                    {section.type === 'education' && '🎓'}
                    {section.type === 'skills' && '🛠️'}
                    {section.type === 'projects' && '🚀'}
                    {section.type === 'achievements' && '🏆'}
                  </span>
                  <div>
                    <h5 className='font-medium text-gray-900'>
                      {section.title}
                    </h5>
                    {section.optional && (
                      <span className='text-xs text-blue-600'>Optional</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
        <h4 className='font-semibold text-blue-900 mb-2'>💡 Tips</h4>
        <ul className='text-sm text-blue-800 space-y-1'>
          <li>• Drag the handle (≡) to reorder sections</li>
          <li>
            • Required sections (Contact, Experience, Education, Skills) cannot
            be removed
          </li>
          <li>• Optional sections can be added or removed as needed</li>
          <li>• The order affects how your resume appears to employers</li>
        </ul>
      </div>
    </div>
  );
};

export default DragDropSections;
