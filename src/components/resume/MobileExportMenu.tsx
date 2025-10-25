'use client';

import { motion } from 'framer-motion';

import { Button } from '@/components/atoms/Button/Button';
import { Tooltip } from '@/components/ui/Tooltip/Tooltip';

interface MobileExportMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'docx' | 'txt') => void;
}

export const MobileExportMenu: React.FC<MobileExportMenuProps> = ({
  isOpen,
  onClose,
  onExport,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed bottom-32 right-4 z-40 sm:hidden'>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className='bg-white rounded-xl shadow-xl border border-slate-200 p-4 min-w-[200px]'
      >
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold text-slate-900 mb-3'>
            Export Resume
          </h3>
          <Tooltip
            content='Export your resume as a PDF document'
            position='top'
            delay={200}
          >
            <Button
              onClick={() => {
                onClose();
                onExport('pdf');
              }}
              className='w-full justify-start text-sm'
              variant='outline'
            >
              <svg
                className='w-4 h-4 mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z'
                />
              </svg>
              Export as PDF
            </Button>
          </Tooltip>
          <Tooltip
            content='Export your resume as a Word document'
            position='top'
            delay={200}
          >
            <Button
              onClick={() => {
                onClose();
                onExport('docx');
              }}
              className='w-full justify-start text-sm'
              variant='outline'
            >
              <svg
                className='w-4 h-4 mr-2'
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
              Export as DOCX
            </Button>
          </Tooltip>
          <Tooltip
            content='Export your resume as a text file'
            position='top'
            delay={200}
          >
            <Button
              onClick={() => {
                onClose();
                onExport('txt');
              }}
              className='w-full justify-start text-sm'
              variant='outline'
            >
              <svg
                className='w-4 h-4 mr-2'
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
              Export as TXT
            </Button>
          </Tooltip>
        </div>
      </motion.div>
    </div>
  );
};
