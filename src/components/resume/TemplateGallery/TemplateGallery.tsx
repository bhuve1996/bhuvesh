'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  getExperienceLevels,
  getTemplateCategories,
  getTemplateStyles,
  loadAllTemplates,
} from '@/lib/resume/templateLoader';
import { ResumeTemplate, TemplateFilter } from '@/types/resume';
import React, { useEffect, useState } from 'react';

interface TemplateGalleryProps {
  onTemplateSelect: (template: ResumeTemplate) => void;
  selectedTemplateId?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onTemplateSelect,
  selectedTemplateId,
}) => {
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ResumeTemplate[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TemplateFilter>({
    category: [],
    experienceLevel: [],
    style: [],
    atsScore: { min: 0, max: 100 },
  });

  // Load templates on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const loadedTemplates = await loadAllTemplates();
        setTemplates(loadedTemplates);
        setFilteredTemplates(loadedTemplates);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Filter templates based on search and filters
  useEffect(() => {
    let filtered = templates;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        template =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(template =>
        filters.category.includes(template.category)
      );
    }

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      filtered = filtered.filter(template =>
        filters.experienceLevel.includes(template.experienceLevel)
      );
    }

    // Style filter
    if (filters.style.length > 0) {
      filtered = filtered.filter(template =>
        filters.style.includes(template.style)
      );
    }

    // ATS score filter
    filtered = filtered.filter(
      template =>
        template.atsScore >= filters.atsScore.min &&
        template.atsScore <= filters.atsScore.max
    );

    setFilteredTemplates(filtered);
  }, [templates, searchQuery, filters]);

  const handleFilterChange = (filterType: keyof TemplateFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      category: [],
      experienceLevel: [],
      style: [],
      atsScore: { min: 0, max: 100 },
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      tech: 'Technology',
      business: 'Business',
      creative: 'Creative',
      healthcare: 'Healthcare',
      education: 'Education',
      general: 'General',
    };
    return labels[category] || category;
  };

  const getExperienceLabel = (level: string) => {
    const labels: Record<string, string> = {
      entry: 'Entry Level',
      mid: 'Mid Level',
      senior: 'Senior Level',
      executive: 'Executive',
    };
    return labels[level] || level;
  };

  const getStyleLabel = (style: string) => {
    const labels: Record<string, string> = {
      modern: 'Modern',
      classic: 'Classic',
      creative: 'Creative',
      'ats-optimized': 'ATS Optimized',
    };
    return labels[style] || style;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400'></div>
        <span className='ml-2 text-gray-600'>Loading templates...</span>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>
          Choose a Template
        </h2>
        <p className='text-gray-600'>
          Select a professional template that matches your industry and
          experience level.
        </p>
      </div>

      {/* Search and Filters */}
      <div className='mb-8 space-y-4'>
        {/* Search */}
        <div className='relative'>
          <input
            type='text'
            placeholder='Search templates...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
          />
          <svg
            className='absolute left-3 top-2.5 h-5 w-5 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>

        {/* Filters */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* Category Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Category
            </label>
            <select
              multiple
              value={filters.category}
              onChange={e => {
                const values = Array.from(
                  e.target.selectedOptions,
                  option => option.value
                );
                handleFilterChange('category', values);
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
            >
              {getTemplateCategories().map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Experience
            </label>
            <select
              multiple
              value={filters.experienceLevel}
              onChange={e => {
                const values = Array.from(
                  e.target.selectedOptions,
                  option => option.value
                );
                handleFilterChange('experienceLevel', values);
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
            >
              {getExperienceLevels().map(level => (
                <option key={level} value={level}>
                  {getExperienceLabel(level)}
                </option>
              ))}
            </select>
          </div>

          {/* Style Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Style
            </label>
            <select
              multiple
              value={filters.style}
              onChange={e => {
                const values = Array.from(
                  e.target.selectedOptions,
                  option => option.value
                );
                handleFilterChange('style', values);
              }}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
            >
              {getTemplateStyles().map(style => (
                <option key={style} value={style}>
                  {getStyleLabel(style)}
                </option>
              ))}
            </select>
          </div>

          {/* ATS Score Filter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              ATS Score
            </label>
            <div className='flex items-center space-x-2'>
              <input
                type='range'
                min='0'
                max='100'
                value={filters.atsScore.min}
                onChange={e =>
                  handleFilterChange('atsScore', {
                    ...filters.atsScore,
                    min: parseInt(e.target.value),
                  })
                }
                className='flex-1'
              />
              <span className='text-sm text-gray-600'>
                {filters.atsScore.min}+
              </span>
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <div className='flex justify-end'>
          <Button
            variant='outline'
            size='sm'
            onClick={clearFilters}
            className='text-gray-600 hover:text-gray-800'
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className='mb-6'>
        <p className='text-gray-600'>
          Showing {filteredTemplates.length} of {templates.length} templates
        </p>
      </div>

      {/* Template Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredTemplates.map(template => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplateId === template.id
                ? 'ring-2 ring-cyan-400 shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <div className='p-6'>
              {/* Template Preview */}
              <div className='aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center'>
                    <span className='text-white font-bold text-lg'>
                      {template.name.charAt(0)}
                    </span>
                  </div>
                  <p className='text-sm text-gray-500'>Preview</p>
                </div>
              </div>

              {/* Template Info */}
              <div className='space-y-2'>
                <h3 className='font-semibold text-lg text-gray-900'>
                  {template.name}
                </h3>
                <p className='text-sm text-gray-600 line-clamp-2'>
                  {template.description}
                </p>

                {/* Tags */}
                <div className='flex flex-wrap gap-1 mt-3'>
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
                    {getCategoryLabel(template.category)}
                  </span>
                  <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>
                    {getExperienceLabel(template.experienceLevel)}
                  </span>
                  <span className='px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full'>
                    {getStyleLabel(template.style)}
                  </span>
                </div>

                {/* ATS Score */}
                <div className='flex items-center justify-between mt-3'>
                  <span className='text-sm text-gray-600'>ATS Score</span>
                  <div className='flex items-center space-x-2'>
                    <div className='w-16 h-2 bg-gray-200 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-gradient-to-r from-red-400 to-green-400'
                        style={{ width: `${template.atsScore}%` }}
                      />
                    </div>
                    <span className='text-sm font-medium text-gray-900'>
                      {template.atsScore}
                    </span>
                  </div>
                </div>

                {/* Select Button */}
                <Button
                  className='w-full mt-4'
                  variant={
                    selectedTemplateId === template.id ? 'default' : 'outline'
                  }
                >
                  {selectedTemplateId === template.id
                    ? 'Selected'
                    : 'Select Template'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className='text-center py-12'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No templates found
          </h3>
          <p className='text-gray-600 mb-4'>
            Try adjusting your search or filters to find more templates.
          </p>
          <Button onClick={clearFilters} variant='outline'>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default TemplateGallery;
