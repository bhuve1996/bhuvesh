'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import {
  exportToDOCX,
  exportToPDFWithFallback,
  exportToTXT,
} from '@/lib/resume/exportUtils';
import type { ExportTabProps } from '@/types';

export const ExportTab: React.FC<ExportTabProps> = ({
  resumeData,
  template,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>(
    'pdf'
  );

  const handleExport = async (format: 'pdf' | 'docx' | 'txt') => {
    setIsExporting(true);
    setExportFormat(format);

    try {
      switch (format) {
        case 'pdf':
          await exportToPDFWithFallback(template, resumeData);
          toast.success('Resume exported as PDF!');
          break;
        case 'docx':
          await exportToDOCX(template, resumeData);
          toast.success('Resume exported as DOCX!');
          break;
        case 'txt':
          await exportToTXT(template, resumeData);
          toast.success('Resume exported as TXT!');
          break;
      }
    } catch {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
      // Export Error: error
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      format: 'pdf' as const,
      label: 'PDF',
      description: 'Best for online applications',
      icon: '📄',
    },
    {
      format: 'docx' as const,
      label: 'DOCX',
      description: 'Editable Word document',
      icon: '📝',
    },
    {
      format: 'txt' as const,
      label: 'TXT',
      description: 'Plain text format',
      icon: '📃',
    },
  ];

  return (
    <div className='h-full overflow-y-auto'>
      <div className='text-center'>
        <h4 className='text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
          Export Resume
        </h4>
        <p className='text-xs sm:text-sm text-neutral-600 dark:text-neutral-400'>
          Download your resume in different formats
        </p>
      </div>

      <div className='space-y-2 sm:space-y-3'>
        {exportOptions.map(option => (
          <Card
            key={option.format}
            className='p-3 sm:p-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm'
          >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <span className='text-xl sm:text-2xl'>{option.icon}</span>
                <div>
                  <h5 className='font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100'>
                    {option.label}
                  </h5>
                  <p className='text-xs sm:text-sm text-neutral-600 dark:text-neutral-400'>
                    {option.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleExport(option.format)}
                loading={isExporting && exportFormat === option.format}
                variant='outline'
                size='sm'
                className='w-full sm:w-auto'
              >
                Export
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExportTab;
