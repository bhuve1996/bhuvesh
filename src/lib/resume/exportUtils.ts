import { ResumeData, ResumeTemplate } from '@/types/resume';
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
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');

    // Use unified rendering system
    const config = getRenderConfig(template);
    const content = convertToUnifiedContent(data);

    await renderToPDF(config, content, doc, filename);
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to generate PDF');
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
  } catch (error) {
    console.error('DOCX export error:', error);
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
  } catch (error) {
    console.error('TXT export error:', error);
    throw new Error('Failed to generate TXT');
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
      return await exportToPDF(template, data, finalFilename);
    case 'docx':
      return await exportToDOCX(template, data, finalFilename);
    case 'txt':
      return exportToTXT(template, data, finalFilename);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};
