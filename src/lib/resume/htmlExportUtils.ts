import htmlDocx from 'html-docx-js/dist/html-docx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { ResumeTemplateRenderer } from '@/components/resume/templates/ResumeTemplateRenderer';
import { ResumeData, ResumeTemplate } from '@/types/resume';

/**
 * HTML-based export utilities using html2canvas + jsPDF for PDF and html-docx-js for DOCX
 * This ensures the exported files match the preview exactly
 */

export interface HtmlExportOptions {
  filename?: string;
  format: 'pdf' | 'docx';
  template: ResumeTemplate;
  data: ResumeData;
}

/**
 * Generate HTML string from the resume template
 */
const generateHtmlString = (
  template: ResumeTemplate,
  data: ResumeData
): string => {
  const htmlContent = ReactDOMServer.renderToString(
    React.createElement(ResumeTemplateRenderer, { template, data })
  );

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume - ${data.personal.fullName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @page {
          size: A4;
          margin: 0.5in;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.4;
        }
        .resume-template {
          max-width: 100%;
          margin: 0 auto;
        }
        /* Ensure proper spacing for print */
        .mb-8 { margin-bottom: 2rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-3 { margin-bottom: 0.75rem; }
        .mb-2 { margin-bottom: 0.5rem; }
        .space-y-4 > * + * { margin-top: 1rem; }
        .space-y-3 > * + * { margin-top: 0.75rem; }
        .space-y-1 > * + * { margin-top: 0.25rem; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;
};

/**
 * Export resume to PDF using html2canvas + jsPDF
 */
export const exportToPDFFromHTML = async (
  options: HtmlExportOptions
): Promise<void> => {
  const { template, data, filename = 'resume.pdf' } = options;

  try {
    // Create a temporary container for the resume
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20mm';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '12px';
    tempContainer.style.lineHeight = '1.4';
    tempContainer.style.color = '#000';

    // Render the resume component
    const resumeElement = ReactDOMServer.renderToString(
      React.createElement(ResumeTemplateRenderer, { template, data })
    );
    tempContainer.innerHTML = resumeElement;

    // Add to DOM temporarily
    document.body.appendChild(tempContainer);

    // Capture the element as canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight,
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Download the PDF
    pdf.save(filename);
  } catch {
    // // console.error('PDF export error:', error);
    throw new Error('Failed to generate PDF from HTML');
  }
};

/**
 * Export resume to DOCX using html-docx-js
 */
export const exportToDOCXFromHTML = async (
  options: HtmlExportOptions
): Promise<void> => {
  const { template, data, filename = 'resume.docx' } = options;

  try {
    const htmlString = generateHtmlString(template, data);

    // Convert HTML to DOCX
    const docxBuffer = await (
      htmlDocx as unknown as {
        asBlob: (
          html: string,
          options: Record<string, unknown>
        ) => Promise<Blob>;
      }
    ).asBlob(htmlString, {
      orientation: 'portrait',
      margins: {
        top: 720, // 0.5 inch in twips
        right: 720,
        bottom: 720,
        left: 720,
      },
    });

    // Download the DOCX
    const blob = new Blob([docxBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // // console.error('DOCX export error:', error);
    throw new Error('Failed to generate DOCX from HTML');
  }
};

/**
 * Main export function that handles both PDF and DOCX
 */
export const exportResumeFromHTML = async (
  options: HtmlExportOptions
): Promise<void> => {
  if (options.format === 'pdf') {
    await exportToPDFFromHTML(options);
  } else if (options.format === 'docx') {
    await exportToDOCXFromHTML(options);
  } else {
    throw new Error(`Unsupported format: ${options.format}`);
  }
};
