import { useResumeStore } from '@/store/resumeStore';
import type { ResumeStylingState } from '@/store/resumeStylingStore';
import { useResumeStylingStore } from '@/store/resumeStylingStore';
import { ResumeData, ResumeTemplate } from '@/types/resume';

import { applyStylingToElement, generateCompleteCSS } from './stylingUtils';

/**
 * Unified export system that ensures preview and export match exactly
 * Uses browser's print-to-PDF functionality for consistent rendering
 */

export interface UnifiedExportOptions {
  template: ResumeTemplate;
  data: ResumeData;
  filename?: string;
  format: 'pdf' | 'docx' | 'txt';
}

/**
 * Get the current resume preview element with consistent styling
 * This ensures the export matches exactly what the user sees in preview
 */
const getResumePreviewElement = (): HTMLElement | null => {
  // Try multiple selectors to find the resume preview
  const selectors = [
    '.resume-template',
    '.template-preview',
    '.template-preview-container',
    '[class*="template"]',
    '[class*="resume"]',
    '[class*="preview"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element && element.offsetHeight > 0) {
      return element;
    }
  }

  return null;
};

/**
 * Apply comprehensive styling to resume element for export
 * Uses the centralized styling system for perfect consistency
 */
const applyConsistentStyling = (
  element: HTMLElement,
  templateId: string
): void => {
  const stylingState = useResumeStylingStore.getState();
  const effectiveStyling = stylingState.getEffectiveStyling(templateId);

  // Apply comprehensive styling to the main element
  element.style.setProperty('color-adjust', 'exact');
  element.style.setProperty('-webkit-print-color-adjust', 'exact');
  element.style.setProperty('print-color-adjust', 'exact');

  // Check if we have a full styling state or just a section
  if ('sections' in effectiveStyling) {
    // Apply styling to each section
    Object.entries(effectiveStyling.sections).forEach(
      ([sectionId, sectionStyling]) => {
        const sectionElement =
          element.querySelector(`[data-section-id="${sectionId}"]`) ||
          element.querySelector(`.${sectionId}`) ||
          element.querySelector(`[class*="${sectionId}"]`);

        if (sectionElement) {
          applyStylingToElement(
            sectionElement as HTMLElement,
            sectionId,
            sectionStyling
          );
        }
      }
    );

    // Apply global page styling
    element.style.setProperty('width', effectiveStyling.global.page.width);
    element.style.setProperty('height', effectiveStyling.global.page.height);
    element.style.setProperty('margin', effectiveStyling.global.page.margin);
    element.style.setProperty('padding', effectiveStyling.global.page.padding);
    element.style.setProperty(
      'background-color',
      effectiveStyling.global.page.background.color
    );
  }
};

/**
 * Export to PDF using browser's print functionality
 * This ensures 100% consistency with the preview
 */
export const exportToPDFUnified = async (
  options: UnifiedExportOptions
): Promise<void> => {
  const { data } = options;

  try {
    // Get the current resume preview element
    const resumeElement = getResumePreviewElement();

    if (!resumeElement) {
      throw new Error(
        'Resume preview not found. Please ensure the resume is visible on screen.'
      );
    }

    // Clone the element to avoid modifying the original
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

    // Apply comprehensive styling
    applyConsistentStyling(clonedElement, options.template.id);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups.');
    }

    // Generate comprehensive CSS from centralized styling system
    const stylingState = useResumeStylingStore.getState();
    const effectiveStyling = stylingState.getEffectiveStyling(
      options.template.id
    );
    const allStyles = generateCompleteCSS(
      effectiveStyling as ResumeStylingState
    );

    // Create a complete HTML document with all styling preserved
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${data.personal.fullName || 'Resume'} - PDF Export</title>
          <style>
            ${allStyles}
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
      </html>
    `;

    // Write the HTML to the print window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for the content to load
    await new Promise(resolve => {
      printWindow.onload = resolve;
    });

    // Trigger print dialog
    printWindow.print();

    // Close the window after a delay
    setTimeout(() => {
      printWindow.close();
    }, 1000);
  } catch (error) {
    throw new Error(
      `PDF export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Export to DOCX using HTML-to-DOCX conversion
 * Maintains consistency with preview styling
 */
export const exportToDOCXUnified = async (
  options: UnifiedExportOptions
): Promise<void> => {
  const { data, filename = 'resume.docx' } = options;

  try {
    // Get the current resume preview element
    const resumeElement = getResumePreviewElement();

    if (!resumeElement) {
      throw new Error(
        'Resume preview not found. Please ensure the resume is visible on screen.'
      );
    }

    // Clone the element
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

    // Apply comprehensive styling
    applyConsistentStyling(clonedElement, options.template.id);

    // Dynamic import for html-docx-js
    const { default: htmlDocx } = await import('html-docx-js/dist/html-docx');

    // Generate comprehensive CSS from centralized styling system
    const stylingState = useResumeStylingStore.getState();
    const effectiveStyling = stylingState.getEffectiveStyling(
      options.template.id
    );
    const allStyles = generateCompleteCSS(
      effectiveStyling as ResumeStylingState
    );

    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${data.personal.fullName || 'Resume'}</title>
          <style>
            ${allStyles}
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              color: black;
              background: white;
              margin: 0;
              padding: 0.5in;
            }
            
            .resume-template,
            .template-preview,
            .template-preview-container {
              width: 100%;
              max-width: none;
              margin: 0;
              padding: 0;
              background: white;
              color: black;
            }
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
      </html>
    `;

    // Convert to DOCX
    const docxBlob = (htmlDocx as any).asBlob(htmlContent);

    // Download the file
    const url = URL.createObjectURL(docxBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      `DOCX export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Export to TXT with clean formatting
 */
export const exportToTXTUnified = async (
  options: UnifiedExportOptions
): Promise<void> => {
  try {
    // Get the current resume preview element
    const resumeElement = getResumePreviewElement();

    if (!resumeElement) {
      throw new Error(
        'Resume preview not found. Please ensure the resume is visible on screen.'
      );
    }

    // Extract text content
    const textContent =
      resumeElement.innerText || resumeElement.textContent || '';

    // Clean up the text
    const cleanText = textContent
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
      .trim();

    // Create and download the file
    const blob = new Blob([cleanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = options.filename || 'resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(
      `TXT export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Main unified export function
 * Automatically chooses the best export method based on format
 */
export const exportResumeUnified = async (
  options: UnifiedExportOptions
): Promise<void> => {
  const { format } = options;

  switch (format) {
    case 'pdf':
      await exportToPDFUnified(options);
      break;
    case 'docx':
      await exportToDOCXUnified(options);
      break;
    case 'txt':
      await exportToTXTUnified(options);
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Set section colors in global state for consistent preview/export
 */
export const setSectionColorsForExport = (
  sectionId: string,
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  }
): void => {
  const { setSectionColors } = useResumeStore.getState();
  setSectionColors(sectionId, colors);
};

/**
 * Get section colors from global state
 */
export const getSectionColorsForExport = (sectionId: string) => {
  const { getSectionColors } = useResumeStore.getState();
  return getSectionColors(sectionId);
};
