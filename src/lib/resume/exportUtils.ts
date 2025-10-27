import { ResumeData, ResumeTemplate } from '@/types/resume';

import type { PageBreakConfig } from './pageBreakUtils';
import { DEFAULT_PAGE_BREAK_CONFIG } from './pageBreakUtils';
import {
  exportToDOCXViaDownload,
  exportToPDFViaPrint,
} from './printExportUtils';

// Simple export functions using only browser print methods
export const exportToPDF = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.pdf',
  pageBreakConfig: PageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG
) => {
  await exportToPDFViaPrint({ template, data, filename, pageBreakConfig });
};

export const exportToDOCX = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.docx',
  pageBreakConfig: PageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG
) => {
  await exportToDOCXViaDownload({ template, data, filename, pageBreakConfig });
};

// Main export function
export const exportResume = async (
  format: 'pdf' | 'docx',
  template: ResumeTemplate,
  data: ResumeData,
  filename?: string,
  pageBreakConfig: PageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG
) => {
  const defaultFilename = `resume_${template.name.toLowerCase().replace(/\s+/g, '_')}.${format}`;
  const finalFilename = filename || defaultFilename;

  switch (format) {
    case 'pdf':
      return await exportToPDF(template, data, finalFilename, pageBreakConfig);
    case 'docx':
      return await exportToDOCX(template, data, finalFilename, pageBreakConfig);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};
