'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import {
  exportToDOCX,
  exportToPDFWithFallback,
  exportToTXT,
} from '@/lib/resume/exportUtils';
import { exportResumeFromHTML } from '@/lib/resume/htmlExportUtils';
import {
  exportToDOCXViaDownload,
  exportToPDFViaPrint,
} from '@/lib/resume/printExportUtils';
import { ResumeData, ResumeTemplate } from '@/types/resume';

interface ModernExportButtonsProps {
  template: ResumeTemplate;
  data: ResumeData;
  className?: string;
}

export const ModernExportButtons: React.FC<ModernExportButtonsProps> = ({
  template,
  data,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  // const [exportMethod, setExportMethod] = useState<'classic' | 'modern'>('classic');

  const handleExport = async (
    format: 'pdf' | 'docx' | 'txt',
    method: 'classic' | 'modern' | 'print' = 'classic'
  ) => {
    setIsExporting(true);

    try {
      const filename = `${data.personal.fullName || 'resume'}_${format}`;

      if (method === 'print') {
        // Use print-based export
        if (format === 'pdf') {
          await exportToPDFViaPrint({
            template,
            data,
            filename: `${filename}.pdf`,
          });
        } else if (format === 'docx') {
          await exportToDOCXViaDownload({
            template,
            data,
            filename: `${filename}.docx`,
          });
        }
      } else if (method === 'modern') {
        // Use HTML-based export
        await exportResumeFromHTML({
          template,
          data,
          format: format as 'pdf' | 'docx',
          filename: `${filename}.${format}`,
        });
      } else {
        // Use classic export with fallback
        if (format === 'pdf') {
          await exportToPDFWithFallback(template, data, `${filename}.pdf`);
        } else if (format === 'docx') {
          await exportToDOCX(template, data, `${filename}.docx`);
        } else if (format === 'txt') {
          await exportToTXT(template, data, `${filename}.txt`);
        }
      }

      // Show success message
      toast.success(`${format.toUpperCase()} exported successfully!`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
        },
      });
    } catch (error) {
      console.error(`Export error (${method}):`, error);
      // Show more specific error message using toast
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to export ${format.toUpperCase()}. Please try again.`;

      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          fontSize: '14px',
          maxWidth: '400px',
        },
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'pdf-classic',
      label: 'PDF (Classic)',
      format: 'pdf' as const,
      method: 'classic' as const,
      icon: (
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
            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      description: 'Traditional PDF export',
    },
    {
      id: 'pdf-print',
      label: 'PDF (Print)',
      format: 'pdf' as const,
      method: 'print' as const,
      icon: (
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
            d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
          />
        </svg>
      ),
      description:
        'Browser print-to-PDF (disable headers/footers in print dialog)',
    },
    {
      id: 'pdf-modern',
      label: 'PDF (Modern)',
      format: 'pdf' as const,
      method: 'modern' as const,
      icon: (
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
            d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      description: 'HTML-based PDF (matches preview)',
    },
    {
      id: 'docx-classic',
      label: 'DOCX (Classic)',
      format: 'docx' as const,
      method: 'classic' as const,
      icon: (
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
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      description: 'Traditional DOCX export',
    },
    {
      id: 'docx-print',
      label: 'DOCX (Print)',
      format: 'docx' as const,
      method: 'print' as const,
      icon: (
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
            d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
          />
        </svg>
      ),
      description: 'HTML file (open in Word)',
    },
    {
      id: 'docx-modern',
      label: 'DOCX (Modern)',
      format: 'docx' as const,
      method: 'modern' as const,
      icon: (
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
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      description: 'HTML-based DOCX (matches preview)',
    },
    {
      id: 'txt',
      label: 'TXT',
      format: 'txt' as const,
      method: 'classic' as const,
      icon: (
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
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
      ),
      description: 'Plain text export',
    },
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Main floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center'
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        {isExporting ? (
          <motion.div
            className='w-6 h-6 border-2 border-white border-t-transparent rounded-full'
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
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
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            />
          </svg>
        )}
      </motion.button>

      {/* Export options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className='absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-[280px]'
          >
            <div className='text-xs text-gray-500 dark:text-gray-400 mb-2 px-2'>
              Export Options
            </div>
            {exportOptions.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => handleExport(option.format, option.method)}
                disabled={isExporting}
                className='w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                <div className='text-blue-600 dark:text-blue-400'>
                  {option.icon}
                </div>
                <div className='flex-1'>
                  <div className='font-medium text-sm text-gray-900 dark:text-gray-100'>
                    {option.label}
                  </div>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {option.description}
                  </div>
                </div>
                {(option.method === 'modern' || option.method === 'print') && (
                  <div className='px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full'>
                    {option.method === 'print' ? 'Simple' : 'New'}
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernExportButtons;
