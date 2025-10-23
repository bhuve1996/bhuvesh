import { ResumeData, ResumeTemplate } from '@/types/resume';

/**
 * Simple print-to-PDF export using browser's print functionality
 * This is the most reliable method as it uses the browser's native PDF generation
 */

export interface PrintExportOptions {
  template: ResumeTemplate;
  data: ResumeData;
  filename?: string;
}

/**
 * Export resume using browser's print-to-PDF functionality
 */
export const exportToPDFViaPrint = async (
  options: PrintExportOptions
): Promise<void> => {
  const { data, template } = options;

  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups.');
    }

    // Get the current resume preview element
    const resumeElement = document.querySelector('.resume-template');
    if (!resumeElement) {
      throw new Error(
        'Resume preview not found. Please ensure you have a template selected.'
      );
    }

    // Clone the resume element
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets);
    let allStyles = '';

    // Extract all CSS rules
    stylesheets.forEach(stylesheet => {
      try {
        if (stylesheet.href) {
          // External stylesheet
          allStyles += `@import url("${stylesheet.href}");\n`;
        } else if (stylesheet.ownerNode && stylesheet.ownerNode.textContent) {
          // Inline stylesheet
          allStyles += `${stylesheet.ownerNode.textContent}\n`;
        }
      } catch {
        // Skip stylesheets that can't be accessed (CORS issues)
      }
    });

    // Create the print document
    const printDocument = printWindow.document;
    printDocument.open();
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personal.fullName || 'Resume'} - Print</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!-- Include Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4;
              margin: ${template.layout.spacing.margins || '0.1in'};
              @top-left { content: none; }
              @top-center { content: none; }
              @top-right { content: none; }
              @bottom-left { content: none; }
              @bottom-center { content: none; }
              @bottom-right { content: none; }
            }
            
            /* Hide browser print headers and footers */
            @media print {
              @page {
                margin: ${template.layout.spacing.margins || '0.1in'} !important;
                @top-left { content: none !important; }
                @top-center { content: none !important; }
                @top-right { content: none !important; }
                @bottom-left { content: none !important; }
                @bottom-center { content: none !important; }
                @bottom-right { content: none !important; }
              }
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
              /* Hide any potential browser-generated content */
              .print-header, .print-footer, 
              [class*="header"], [class*="footer"],
              [id*="header"], [id*="footer"] {
                display: none !important;
              }
            }
            
            /* Preserve ALL original styles */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Hide interactive elements only */
            button, .hover\\:scale-105, .hover\\:shadow-xl, .hover\\:bg-gray-50 {
              display: none !important;
            }
            
            /* Ensure proper spacing for print */
            .mb-8 { margin-bottom: 2rem !important; }
            .mb-6 { margin-bottom: 1.5rem !important; }
            .mb-4 { margin-bottom: 1rem !important; }
            .mb-3 { margin-bottom: 0.75rem !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .space-y-4 > * + * { margin-top: 1rem !important; }
            .space-y-3 > * + * { margin-top: 0.75rem !important; }
            .space-y-1 > * + * { margin-top: 0.25rem !important; }
            
            /* Preserve all colors and fonts */
            body {
              font-family: inherit !important;
              margin: 0;
              padding: 0;
            }
            
            .resume-template {
              max-width: 100%;
              margin: 0;
              padding: 0;
            }
            
            /* Additional extracted styles */
            ${allStyles}
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
      </html>
    `);
    printDocument.close();

    // Wait for the document to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        // Try to disable headers and footers if possible
        try {
          if (printWindow.matchMedia) {
            printWindow.matchMedia('print').addListener(mql => {
              if (mql.matches) {
                // Print media is active
                printWindow.document.body.style.margin = '0';
                printWindow.document.body.style.padding = '0';
              }
            });
          }
        } catch {
          // Ignore errors if browser doesn't support this
        }

        // Add a script to disable headers and footers before printing
        const disableHeadersScript =
          printWindow.document.createElement('script');
        disableHeadersScript.textContent = `
          // Override print function to disable headers and footers
          const originalPrint = window.print;
          window.print = function() {
            // Try to set print preferences
            try {
              if (window.chrome && window.chrome.runtime) {
                // This won't work in regular web pages, but worth trying
                console.log('Chrome extension context not available');
              }
            } catch (e) {
              console.log('Cannot access Chrome APIs');
            }
            
            // Call original print
            originalPrint.call(this);
          };
        `;
        printWindow.document.head.appendChild(disableHeadersScript);

        // Standard print call
        printWindow.print();
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
        }, 1000);
      }, 500);
    };
  } catch {
    // console.error('Print export error:', error);
    throw new Error(
      'Failed to generate PDF via print. Please try the classic export method.'
    );
  }
};

/**
 * Export resume to DOCX using a simple HTML-to-DOCX conversion
 */
export const exportToDOCXViaDownload = async (
  options: PrintExportOptions
): Promise<void> => {
  const { data, template, filename = 'resume.docx' } = options;

  try {
    // Get the current resume preview element
    const resumeElement = document.querySelector('.resume-template');
    if (!resumeElement) {
      throw new Error(
        'Resume preview not found. Please ensure you have a template selected.'
      );
    }

    // Clone the resume element
    const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets);
    let allStyles = '';

    // Extract all CSS rules
    stylesheets.forEach(stylesheet => {
      try {
        if (stylesheet.href) {
          // External stylesheet
          allStyles += `@import url("${stylesheet.href}");\n`;
        } else if (stylesheet.ownerNode && stylesheet.ownerNode.textContent) {
          // Inline stylesheet
          allStyles += `${stylesheet.ownerNode.textContent}\n`;
        }
      } catch {
        // Skip stylesheets that can't be accessed (CORS issues)
      }
    });

    // Create a complete HTML document with all styling preserved
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${data.personal.fullName || 'Resume'}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <!-- Include Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              font-family: inherit !important;
              margin: 0;
              padding: ${template.layout.spacing.margins || '0.1in'};
              background: white;
            }
            .resume-template {
              max-width: 100%;
              margin: 0;
              padding: 0;
            }
            /* Ensure proper spacing */
            .mb-8 { margin-bottom: 2rem !important; }
            .mb-6 { margin-bottom: 1.5rem !important; }
            .mb-4 { margin-bottom: 1rem !important; }
            .mb-3 { margin-bottom: 0.75rem !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .space-y-4 > * + * { margin-top: 1rem !important; }
            .space-y-3 > * + * { margin-top: 0.75rem !important; }
            .space-y-1 > * + * { margin-top: 0.25rem !important; }
            /* Hide interactive elements */
            button, .hover\\:scale-105, .hover\\:shadow-xl, .hover\\:bg-gray-50 {
              display: none !important;
            }
            /* Preserve ALL original colors and fonts */
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Additional extracted styles */
            ${allStyles}
          </style>
        </head>
        <body>
          ${clonedElement.outerHTML}
        </body>
      </html>
    `;

    // Create and download the HTML file (can be opened in Word)
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.docx', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show instruction to user
    alert(
      'HTML file downloaded! You can open it in Microsoft Word and save as DOCX for better formatting.'
    );
  } catch {
    // console.error('DOCX export error:', error);
    throw new Error(
      'Failed to generate DOCX. Please try the classic export method.'
    );
  }
};
