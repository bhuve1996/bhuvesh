'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResumeData } from '@/types/resume';
import React from 'react';

interface DataSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleData: () => void;
  onSelectParsedData: () => void;
  templateSampleData?: Partial<ResumeData>;
  parsedData?: Partial<ResumeData>;
  templateName: string;
}

export const DataSelectionModal: React.FC<DataSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectSampleData,
  onSelectParsedData,
  templateSampleData,
  parsedData,
  templateName,
}) => {
  if (!isOpen) return null;

  const renderDataPreview = (
    data: Partial<ResumeData>,
    title: string,
    description: string
  ) => (
    <Card className='p-6 h-full'>
      <div className='flex flex-col h-full'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>{title}</h3>
          <p className='text-sm text-gray-600'>{description}</p>
        </div>

        <div className='flex-1 space-y-3'>
          {/* Personal Info Preview */}
          {data.personal && (
            <div>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Personal Information
              </h4>
              <div className='text-sm text-gray-600 space-y-1'>
                {data.personal.fullName && (
                  <div>
                    <strong>Name:</strong> {data.personal.fullName}
                  </div>
                )}
                {data.personal.email && (
                  <div>
                    <strong>Email:</strong> {data.personal.email}
                  </div>
                )}
                {data.personal.phone && (
                  <div>
                    <strong>Phone:</strong> {data.personal.phone}
                  </div>
                )}
                {data.personal.location && (
                  <div>
                    <strong>Location:</strong> {data.personal.location}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary Preview */}
          {data.summary && (
            <div>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Summary
              </h4>
              <p className='text-sm text-gray-600 line-clamp-3'>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience Preview */}
          {data.experience && data.experience.length > 0 && (
            <div>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>
                Experience
              </h4>
              <div className='text-sm text-gray-600 space-y-1'>
                {data.experience.slice(0, 2).map((exp, index) => (
                  <div key={index}>
                    <div>
                      <strong>{exp.position}</strong> at {exp.company}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </div>
                  </div>
                ))}
                {data.experience.length > 2 && (
                  <div className='text-xs text-gray-500'>
                    +{data.experience.length - 2} more...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Skills Preview */}
          {data.skills && (
            <div>
              <h4 className='text-sm font-medium text-gray-700 mb-2'>Skills</h4>
              <div className='text-sm text-gray-600'>
                {data.skills.technical && data.skills.technical.length > 0 && (
                  <div>
                    <strong>Technical:</strong>{' '}
                    {data.skills.technical.slice(0, 3).join(', ')}
                  </div>
                )}
                {data.skills.business && data.skills.business.length > 0 && (
                  <div>
                    <strong>Business:</strong>{' '}
                    {data.skills.business.slice(0, 3).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900'>
                Choose Your Data Source
              </h2>
              <p className='text-sm text-gray-600 mt-1'>
                Select which data to use for your "{templateName}" resume
                template
              </p>
            </div>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 transition-colors'
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
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
            {/* Template Sample Data */}
            <div>
              {renderDataPreview(
                templateSampleData || {},
                'Template Sample Data',
                "Use the template's example content to get started quickly. You can edit this content later."
              )}
            </div>

            {/* Parsed ATS Data */}
            <div>
              {renderDataPreview(
                parsedData || {},
                'Your Parsed Resume Data',
                'Use the data extracted from your uploaded resume. This contains your actual information.'
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button
              onClick={onSelectSampleData}
              variant='outline'
              className='flex-1 sm:flex-none sm:px-8'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
              Use Template Sample Data
            </Button>

            <Button
              onClick={onSelectParsedData}
              className='flex-1 sm:flex-none sm:px-8'
            >
              <svg
                className='w-5 h-5 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              Use My Parsed Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
