import { ResumeData, ResumeTemplate } from '@/types/resume';

import {
  exportToDOCXViaDownload,
  exportToPDFViaPrint,
} from './printExportUtils';
import { convertToUnifiedContent, renderToTXT } from './unifiedRenderer';

// Note: Classic PDF export removed - using browser print method for 100% consistency

// Export to DOCX using browser print method (100% consistent with preview)
export const exportToDOCX = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.docx'
) => {
  // Use print method for DOCX as well for 100% consistency with preview
  await exportToDOCXViaDownload({ template, data, filename });
};

// Export to TXT using unified rendering system
export const exportToTXT = (
  _template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.txt'
) => {
  try {
    // Use unified rendering system
    const content = convertToUnifiedContent(data);
    renderToTXT(content, filename);
  } catch {
    // // console.error('TXT export error:', error);
    throw new Error('Failed to generate TXT');
  }
};

// Export to PDF using browser print method (100% consistent with preview)
export const exportToPDFWithFallback = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.pdf'
) => {
  // Use print method directly for 100% consistency with preview
  await exportToPDFViaPrint({ template, data, filename });
};

// Main export function
export const exportResume = async (
  format: 'pdf' | 'docx' | 'txt',
  template: ResumeTemplate,
  data: ResumeData,
  filename?: string
) => {
  const defaultFilename = `resume_${template.name.toLowerCase().replace(/\s+/g, '_')}.${format}`;
  const finalFilename = filename || defaultFilename;

  switch (format) {
    case 'pdf':
      return await exportToPDFWithFallback(template, data, finalFilename);
    case 'docx':
      return await exportToDOCX(template, data, finalFilename);
    case 'txt':
      return exportToTXT(template, data, finalFilename);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};
