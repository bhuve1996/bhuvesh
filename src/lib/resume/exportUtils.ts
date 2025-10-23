import { ResumeData, ResumeTemplate } from '@/types/resume';

import { exportToPDFViaPrint } from './printExportUtils';
import {
  convertToUnifiedContent,
  getRenderConfig,
  renderToDOCX,
  renderToPDF,
  renderToTXT,
} from './unifiedRenderer';

// Export to PDF using unified rendering system
export const exportToPDF = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.pdf'
) => {
  try {
    console.log('Starting PDF export with:', {
      template: template.name,
      filename,
    });

    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    console.log('jsPDF loaded successfully');

    const doc = new jsPDF('p', 'mm', 'a4');
    console.log('jsPDF document created');

    // Use unified rendering system
    const config = getRenderConfig(template);
    console.log('Render config created:', config);

    const content = convertToUnifiedContent(data);
    console.log('Content converted:', content);

    await renderToPDF(
      config,
      content,
      doc as unknown as Record<string, unknown>,
      filename
    );

    console.log('PDF export completed successfully');
  } catch (error) {
    console.error('PDF export error:', error);
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('jsPDF')) {
        throw new Error(
          'PDF library failed to load. Please refresh the page and try again.'
        );
      } else if (error.message.includes('template')) {
        throw new Error(
          'Template configuration error. Please select a different template.'
        );
      } else if (error.message.includes('data')) {
        throw new Error(
          'Resume data error. Please check your resume information.'
        );
      }
    }
    throw new Error(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Export to DOCX using unified rendering system
export const exportToDOCX = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.docx'
) => {
  try {
    // Use unified rendering system
    const config = getRenderConfig(template);
    const content = convertToUnifiedContent(data);

    await renderToDOCX(config, content, filename);
  } catch {
    // console.error('DOCX export error:', error);
    throw new Error('Failed to generate DOCX');
  }
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
    // console.error('TXT export error:', error);
    throw new Error('Failed to generate TXT');
  }
};

// Export to PDF with fallback methods
export const exportToPDFWithFallback = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.pdf'
) => {
  try {
    // Try classic PDF export first
    await exportToPDF(template, data, filename);
  } catch (classicError) {
    console.warn(
      'Classic PDF export failed, trying print method:',
      classicError
    );
    try {
      // Fallback to print method
      await exportToPDFViaPrint({ template, data, filename });
    } catch (printError) {
      console.error('Print PDF export also failed:', printError);
      throw new Error(
        `Both PDF export methods failed. Classic: ${classicError instanceof Error ? classicError.message : 'Unknown error'}. Print: ${printError instanceof Error ? printError.message : 'Unknown error'}`
      );
    }
  }
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
