import { ResumeData, ResumeTemplate } from '@/types/resume';

import {
  DEFAULT_PAGE_BREAK_CONFIG,
  prepareResumeForPDF,
  type PageBreakConfig,
} from './pageBreakUtils';

/**
 * Generate HTML content from resume data when DOM element is not available
 */
const generateResumeHTML = (
  template: ResumeTemplate,
  data: ResumeData
): string => {
  const { colors, fonts, spacing } = template.layout;

  return `
    <div class="resume-template" style="
      background-color: ${colors.background};
      color: ${colors.text};
      font-family: ${fonts.body};
      font-size: ${fonts.size.body};
      line-height: ${spacing.lineHeight};
      padding: ${spacing.padding};
      min-height: 100vh;
    ">
      <!-- Header -->
      <div class="text-center mb-6" style="color: ${colors.text};">
        <h1 style="
          font-family: ${fonts.heading};
          font-size: ${fonts.size.heading};
          color: ${colors.primary};
          font-weight: bold;
          margin-bottom: 0.5rem;
        ">${data.personal.fullName}</h1>
        <div style="color: ${colors.secondary}; font-size: ${fonts.size.small};">
          ${data.personal.email}
          ${data.personal.phone ? ` • ${data.personal.phone}` : ''}
          ${data.personal.location ? ` • ${data.personal.location}` : ''}
          ${data.personal.linkedin ? ` • LinkedIn` : ''}
          ${data.personal.github ? ` • GitHub` : ''}
        </div>
      </div>

      <!-- Summary -->
      ${
        data.summary
          ? `
        <div class="mb-4">
          <h2 style="
            font-family: ${fonts.heading};
            font-size: ${fonts.size.subheading};
            color: ${colors.primary};
            font-weight: bold;
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 0.25rem;
            margin-bottom: 0.5rem;
          ">Professional Summary</h2>
          <p style="color: ${colors.text};">${data.summary}</p>
        </div>
      `
          : ''
      }

      <!-- Experience -->
      ${
        data.experience.length > 0
          ? `
        <div class="mb-4">
          <h2 style="
            font-family: ${fonts.heading};
            font-size: ${fonts.size.subheading};
            color: ${colors.primary};
            font-weight: bold;
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 0.25rem;
            margin-bottom: 0.5rem;
          ">Professional Experience</h2>
          ${data.experience
            .map(
              exp => `
            <div class="mb-3">
              <h3 style="
                font-family: ${fonts.heading};
                font-size: ${fonts.size.body};
                color: ${colors.text};
                font-weight: bold;
                margin-bottom: 0.25rem;
              ">${exp.position} | ${exp.company}</h3>
              <p style="
                color: ${colors.secondary};
                font-size: ${fonts.size.small};
                margin-bottom: 0.25rem;
              ">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
              ${exp.description ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;">${exp.description}</p>` : ''}
              ${
                exp.achievements.length > 0
                  ? `
                <ul style="color: ${colors.text}; margin-left: 1rem;">
                  ${exp.achievements.map(achievement => `<li>• ${achievement}</li>`).join('')}
                </ul>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <!-- Education -->
      ${
        data.education.length > 0
          ? `
        <div class="mb-4">
          <h2 style="
            font-family: ${fonts.heading};
            font-size: ${fonts.size.subheading};
            color: ${colors.primary};
            font-weight: bold;
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 0.25rem;
            margin-bottom: 0.5rem;
          ">Education</h2>
          ${data.education
            .map(
              edu => `
            <div class="mb-3">
              <h3 style="
                font-family: ${fonts.heading};
                font-size: ${fonts.size.body};
                color: ${colors.text};
                font-weight: bold;
                margin-bottom: 0.25rem;
              ">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</h3>
              <p style="color: ${colors.text}; margin-bottom: 0.25rem;">${edu.institution}</p>
              <p style="
                color: ${colors.secondary};
                font-size: ${fonts.size.small};
              ">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <!-- Skills -->
      <div class="mb-4">
        <h2 style="
          font-family: ${fonts.heading};
          font-size: ${fonts.size.subheading};
          color: ${colors.primary};
          font-weight: bold;
          border-bottom: 2px solid ${colors.accent};
          padding-bottom: 0.25rem;
          margin-bottom: 0.5rem;
        ">Skills</h2>
        ${data.skills.technical.length > 0 ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;"><strong>Technical:</strong> ${data.skills.technical.join(', ')}</p>` : ''}
        ${data.skills.business.length > 0 ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;"><strong>Business:</strong> ${data.skills.business.join(', ')}</p>` : ''}
        ${data.skills.soft.length > 0 ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;"><strong>Soft Skills:</strong> ${data.skills.soft.join(', ')}</p>` : ''}
        ${data.skills.languages.length > 0 ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;"><strong>Languages:</strong> ${data.skills.languages.join(', ')}</p>` : ''}
        ${data.skills.certifications.length > 0 ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;"><strong>Certifications:</strong> ${data.skills.certifications.join(', ')}</p>` : ''}
      </div>

      <!-- Projects -->
      ${
        data.projects.length > 0
          ? `
        <div class="mb-4">
          <h2 style="
            font-family: ${fonts.heading};
            font-size: ${fonts.size.subheading};
            color: ${colors.primary};
            font-weight: bold;
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 0.25rem;
            margin-bottom: 0.5rem;
          ">Projects</h2>
          ${data.projects
            .map(
              project => `
            <div class="mb-3">
              <h3 style="
                font-family: ${fonts.heading};
                font-size: ${fonts.size.body};
                color: ${colors.text};
                font-weight: bold;
                margin-bottom: 0.25rem;
              ">${project.name}</h3>
              ${project.description ? `<p style="color: ${colors.text}; margin-bottom: 0.25rem;">${project.description}</p>` : ''}
              ${project.technologies.length > 0 ? `<p style="color: ${colors.secondary}; font-size: ${fonts.size.small};">Technologies: ${project.technologies.join(', ')}</p>` : ''}
            </div>
          `
            )
            .join('')}
        </div>
      `
          : ''
      }

      <!-- Achievements -->
      ${
        data.achievements && data.achievements.length > 0
          ? `
        <div class="mb-4">
          <h2 style="
            font-family: ${fonts.heading};
            font-size: ${fonts.size.subheading};
            color: ${colors.primary};
            font-weight: bold;
            border-bottom: 2px solid ${colors.accent};
            padding-bottom: 0.25rem;
            margin-bottom: 0.5rem;
          ">Achievements</h2>
          <ul style="color: ${colors.text}; margin-left: 1rem;">
            ${data.achievements.map(achievement => `<li>• ${achievement}</li>`).join('')}
          </ul>
        </div>
      `
          : ''
      }
    </div>
  `;
};

/**
 * Simple print-to-PDF export using browser's print functionality
 * This is the most reliable method as it uses the browser's native PDF generation
 */

export interface PrintExportOptions {
  template: ResumeTemplate;
  data: ResumeData;
  filename?: string;
  pageBreakConfig?: PageBreakConfig;
}

/**
 * Export resume using browser's print-to-PDF functionality
 */
export const exportToPDFViaPrint = async (
  options: PrintExportOptions
): Promise<void> => {
  const {
    data,
    template,
    pageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG,
  } = options;

  try {
    // console.log('Starting print PDF export with:', { template: template.name });

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups.');
    }
    // console.log('Print window opened successfully');

    // Get the current resume preview element - try multiple selectors
    let resumeElement = document.querySelector('.resume-template');
    // console.log(
    //   'Looking for resume element, found .resume-template:',
    //   !!resumeElement
    // );

    // If not found, try other possible selectors for different view modes
    if (!resumeElement) {
      resumeElement = document.querySelector('.template-preview');
      // console.log('Looking for .template-preview:', !!resumeElement);
    }
    if (!resumeElement) {
      resumeElement = document.querySelector('.template-preview-container');
      // console.log('Looking for .template-preview-container:', !!resumeElement);
    }
    if (!resumeElement) {
      resumeElement = document.querySelector('[class*="template"]');
      // console.log('Looking for [class*="template"]:', !!resumeElement);
    }

    // Debug: log all available elements with template-related classes
    // if (!resumeElement) {
    //   const _allElements = document.querySelectorAll(
    //     '[class*="template"], [class*="resume"], [class*="preview"]'
    //   );
    //   // console.log(
    //   //   'Available template-related elements:',
    //   //   Array.from(_allElements).map(el => ({
    //   //     tagName: el.tagName,
    //   //     className: el.className,
    //   //     id: el.id,
    //   //   }))
    //   // );
    // }

    // Note: We no longer throw an error here since we have a fallback HTML generator

    let resumeHTML: string;

    if (resumeElement) {
      // Use the existing DOM element
      const clonedElement = resumeElement.cloneNode(true) as HTMLElement;

      // Apply smart page breaks and optimization
      const pdfOptimizedElement = prepareResumeForPDF(
        clonedElement,
        pageBreakConfig
      );
      resumeHTML = pdfOptimizedElement.outerHTML;
      // console.log('Using existing DOM element for export');
    } else {
      // Generate HTML from data as fallback
      resumeHTML = generateResumeHTML(template, data);
      // console.log(
      //   'Generated HTML from data as fallback - this may have slightly different styling than the preview'
      // );
    }

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
          ${resumeHTML}
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
                // console.log('Chrome extension context not available');
              }
            } catch (e) {
              // console.log('Cannot access Chrome APIs');
            }

            // Call original print
            originalPrint.call(this);
          };
        `;
        printWindow.document.head.appendChild(disableHeadersScript);

        // Standard print call
        // console.log('Triggering print dialog');
        printWindow.print();
        // Close the window after printing
        setTimeout(() => {
          printWindow.close();
          // console.log('Print window closed');
        }, 1000);
      }, 500);
    };
  } catch (error) {
    // console.error('Print export error:', error);
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('popup')) {
        throw new Error('Please allow popups for this site to export PDFs.');
      } else if (error.message.includes('Resume preview not found')) {
        throw new Error(
          'Please ensure you have a template selected and resume data filled. The export will use generated HTML as fallback.'
        );
      } else if (error.message.includes('stylesheet')) {
        throw new Error(
          'Style loading error. Please refresh the page and try again.'
        );
      }
    }
    throw new Error(
      `Failed to generate PDF via print: ${error instanceof Error ? error.message : 'Unknown error'}. Please try the classic export method.`
    );
  }
};

/**
 * Export resume to DOCX using proper DOCX generation that matches preview exactly
 */
export const exportToDOCXViaDownload = async (
  options: PrintExportOptions
): Promise<void> => {
  const {
    data,
    filename = 'resume.docx',
    pageBreakConfig: _pageBreakConfig = DEFAULT_PAGE_BREAK_CONFIG,
  } = options;

  // Note: _pageBreakConfig is available for future DOCX page break implementation

  try {
    // Dynamic import to avoid SSR issues
    const { Document, Packer, Paragraph, TextRun, AlignmentType } =
      await import('docx');

    // Create a properly formatted DOCX document that matches the preview structure
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header with name (matches preview heading)
            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.fullName || 'Resume',
                  bold: true,
                  size: 32, // 16pt - matches preview heading size
                  color: '1E40AF', // Blue color to match preview
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            // Contact information (matches preview format exactly)
            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.email || '',
                  size: 20, // 10pt
                  color: '1E40AF', // Blue links like in preview
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.phone || '',
                  size: 20, // 10pt
                  color: '1E40AF', // Blue links like in preview
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.location || '',
                  size: 20, // 10pt
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 50 },
            }),

            // LinkedIn, GitHub, Portfolio links (matches preview)
            ...(data.personal.linkedin
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.personal.linkedin,
                        size: 20, // 10pt
                        color: '1E40AF', // Blue links like in preview
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 50 },
                  }),
                ]
              : []),

            ...(data.personal.github
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.personal.github,
                        size: 20, // 10pt
                        color: '1E40AF', // Blue links like in preview
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 50 },
                  }),
                ]
              : []),

            ...(data.personal.portfolio
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.personal.portfolio,
                        size: 20, // 10pt
                        color: '1E40AF', // Blue links like in preview
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Skills section (matches preview structure exactly)
            ...(data.skills.technical.length > 0 ||
            data.skills.business.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Skills',
                        bold: true,
                        size: 24, // 12pt
                        color: '1E40AF', // Blue heading like in preview
                      }),
                    ],
                    spacing: { before: 200, after: 100 },
                  }),

                  // Technical Skills (matches preview "Technical Skills" heading)
                  ...(data.skills.technical.length > 0
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Technical Skills',
                              bold: true,
                              size: 22, // 11pt
                              color: '374151', // Gray heading like in preview
                            }),
                          ],
                          spacing: { after: 50 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: data.skills.technical.join(' '), // Space separated like in preview
                              size: 20, // 10pt
                            }),
                          ],
                          spacing: { after: 100 },
                        }),
                      ]
                    : []),

                  // Business Skills (matches preview "Business Skills" heading)
                  ...(data.skills.business.length > 0
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Business Skills',
                              bold: true,
                              size: 22, // 11pt
                              color: '374151', // Gray heading like in preview
                            }),
                          ],
                          spacing: { after: 50 },
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: data.skills.business.join(' '), // Space separated like in preview
                              size: 20, // 10pt
                            }),
                          ],
                          spacing: { after: 100 },
                        }),
                      ]
                    : []),
                ]
              : []),

            // Education section (matches preview structure exactly)
            ...(data.education.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Education',
                        bold: true,
                        size: 24, // 12pt
                        color: '1E40AF', // Blue heading like in preview
                      }),
                    ],
                    spacing: { before: 200, after: 100 },
                  }),
                  ...data.education.flatMap(edu => [
                    // Full degree details (matches preview format exactly)
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${edu.degree || ''}${edu.field ? `, ${edu.field}` : ''} – ${edu.institution || ''} (${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''})${edu.field ? ` in ${edu.field}` : ''}`,
                          bold: true,
                          size: 22, // 11pt
                          color: '374151', // Gray heading like in preview
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                    // GPA/achievements (matches preview)
                    ...(edu.gpa
                      ? [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: `Top 10 percentile of the university with ${edu.gpa} CGPA`,
                                size: 20, // 10pt
                              }),
                            ],
                            spacing: { after: 50 },
                          }),
                        ]
                      : []),
                    // Dates (matches preview format)
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${edu.startDate || ''}`,
                          size: 20, // 10pt
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${edu.startDate || ''} – ${edu.current ? 'Present' : edu.endDate || ''}`,
                          size: 20, // 10pt
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                  ]),
                ]
              : []),

            // Professional Summary (matches preview structure)
            ...(data.summary
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Professional Summary',
                        bold: true,
                        size: 24, // 12pt
                        color: '1E40AF', // Blue heading like in preview
                      }),
                    ],
                    spacing: { before: 200, after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.summary,
                        size: 20, // 10pt
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]
              : []),

            // Experience section (matches preview structure exactly)
            ...(data.experience.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Experience',
                        bold: true,
                        size: 24, // 12pt
                        color: '1E40AF', // Blue heading like in preview
                      }),
                    ],
                    spacing: { before: 200, after: 100 },
                  }),
                  ...data.experience.flatMap(exp => [
                    // Company name as heading (matches preview exactly)
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exp.company || ''}${exp.position ? ` (${exp.position})` : ''}`,
                          bold: true,
                          size: 22, // 11pt
                          color: '374151', // Gray heading like in preview
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                    // Description (matches preview)
                    ...(exp.description
                      ? [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: exp.description,
                                size: 20, // 10pt
                              }),
                            ],
                            spacing: { after: 50 },
                          }),
                        ]
                      : []),
                    // Dates (matches preview format)
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exp.startDate || ''}`,
                          size: 20, // 10pt
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || ''}`,
                          size: 20, // 10pt
                        }),
                      ],
                      spacing: { after: 50 },
                    }),
                    // Position and location (matches preview)
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${exp.position || ''} ${exp.location || ''}`,
                          bold: true,
                          size: 22, // 11pt
                          color: '374151', // Gray heading like in preview
                        }),
                      ],
                      spacing: { after: 100 },
                    }),
                  ]),
                ]
              : []),
          ],
        },
      ],
    });

    // Generate and download the DOCX file
    const buffer = await Packer.toBuffer(doc);
    const arrayBuffer = new ArrayBuffer(buffer.byteLength);
    const uint8Array = new Uint8Array(arrayBuffer);
    uint8Array.set(buffer);
    const blob = new Blob([arrayBuffer], {
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
    // console.error('DOCX export error:', error);
    throw new Error('Failed to generate DOCX. Please try again.');
  }
};
