'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { exportToDOCX, exportToPDF } from '@/lib/resume/exportUtils';
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

  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExporting(true);

    try {
      const filename = `${data.personal.fullName || 'resume'}_${format}`;

      if (format === 'pdf') {
        await exportToPDF(template, data, `${filename}.pdf`);
      } else if (format === 'docx') {
        await exportToDOCX(template, data, `${filename}.docx`);
      }

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
        },
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isExporting ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            Exporting...
          </>
        ) : (
          <>
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
            Export Resume
          </>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-50'
          >
            <div className='px-3 py-2 text-sm text-gray-500 border-b border-gray-100'>
              Choose format:
            </div>

            <button
              onClick={() => {
                handleExport('pdf');
                setIsOpen(false);
              }}
              disabled={isExporting}
              className='w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 disabled:opacity-50'
            >
              <div className='w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-red-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <div className='font-medium text-gray-900'>PDF</div>
                <div className='text-xs text-gray-500'>Print-ready format</div>
              </div>
            </button>

            <button
              onClick={() => {
                handleExport('docx');
                setIsOpen(false);
              }}
              disabled={isExporting}
              className='w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 disabled:opacity-50'
            >
              <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
                <svg
                  className='w-4 h-4 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <div className='font-medium text-gray-900'>DOCX</div>
                <div className='text-xs text-gray-500'>
                  Microsoft Word format
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernExportButtons;
