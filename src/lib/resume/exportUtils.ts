import { ResumeData, ResumeTemplate } from '@/types/resume';

// Export to PDF using jsPDF
export const exportToPDF = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.pdf'
) => {
  try {
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');

    const { colors } = template.layout;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (
      text: string,
      fontSize: number,
      isBold: boolean = false,
      color: string = colors.text
    ) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color);

      const lines = doc.splitTextToSize(text, contentWidth);
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * (fontSize * 0.4) + 2;
    };

    // Helper function to add section header
    const addSectionHeader = (title: string) => {
      yPosition += 5;
      addText(title, 14, true, colors.primary);

      // Add underline
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
      yPosition += 3;
    };

    // Header
    addText(data.personal.fullName, 18, true, colors.primary);
    addText(
      `${data.personal.email} • ${data.personal.phone} • ${data.personal.location}`,
      10,
      false,
      colors.secondary
    );
    if (data.personal.linkedin)
      addText(data.personal.linkedin, 10, false, colors.secondary);
    if (data.personal.github)
      addText(data.personal.github, 10, false, colors.secondary);

    yPosition += 5;

    // Summary
    if (data.summary) {
      addSectionHeader('Professional Summary');
      addText(data.summary, 11);
    }

    // Experience
    addSectionHeader('Professional Experience');
    data.experience.forEach(exp => {
      addText(`${exp.position} | ${exp.company}`, 12, true);
      addText(
        `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
        10,
        false,
        colors.secondary
      );
      addText(exp.description, 11);
      exp.achievements.forEach(achievement => {
        addText(`• ${achievement}`, 10);
      });
      yPosition += 3;
    });

    // Education
    addSectionHeader('Education');
    data.education.forEach(edu => {
      addText(`${edu.degree} in ${edu.field}`, 12, true);
      addText(`${edu.institution}`, 11);
      addText(
        `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
        10,
        false,
        colors.secondary
      );
      if (edu.gpa) addText(`GPA: ${edu.gpa}`, 10, false, colors.secondary);
      yPosition += 3;
    });

    // Skills
    addSectionHeader('Skills');
    if (data.skills.technical.length > 0) {
      addText(`Technical: ${data.skills.technical.join(', ')}`, 11);
    }
    if (data.skills.business.length > 0) {
      addText(`Business: ${data.skills.business.join(', ')}`, 11);
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      addSectionHeader('Projects');
      data.projects.forEach(project => {
        addText(`${project.name}`, 12, true);
        addText(project.description, 11);
        if (project.technologies.length > 0) {
          addText(
            `Technologies: ${project.technologies.join(', ')}`,
            10,
            false,
            colors.secondary
          );
        }
        yPosition += 3;
      });
    }

    // Achievements
    if (data.achievements && data.achievements.length > 0) {
      addSectionHeader('Achievements');
      data.achievements.forEach(achievement => {
        addText(`• ${achievement}`, 11);
      });
    }

    // Save the PDF
    doc.save(filename);
  } catch {
    // Error generating PDF
    throw new Error('Failed to generate PDF');
  }
};

// Export to DOCX using docx library
export const exportToDOCX = async (
  template: ResumeTemplate,
  data: ResumeData,
  filename: string = 'resume.docx'
) => {
  try {
    // Dynamic import to avoid SSR issues
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      HeadingLevel,
      AlignmentType,
    } = await import('docx');

    const { colors } = template.layout;

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header
            new Paragraph({
              children: [
                new TextRun({
                  text: data.personal.fullName,
                  bold: true,
                  size: 32,
                  color: colors.primary.replace('#', ''),
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${data.personal.email} • ${data.personal.phone} • ${data.personal.location}`,
                  size: 20,
                  color: colors.secondary.replace('#', ''),
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            // Summary
            ...(data.summary
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'Professional Summary',
                        bold: true,
                        size: 24,
                        color: colors.primary.replace('#', ''),
                      }),
                    ],
                    heading: HeadingLevel.HEADING_2,
                    spacing: { after: 200 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: data.summary,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 300 },
                  }),
                ]
              : []),

            // Experience
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Professional Experience',
                  bold: true,
                  size: 24,
                  color: colors.primary.replace('#', ''),
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            ...data.experience.flatMap(exp => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.position} | ${exp.company}`,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                    size: 20,
                    color: colors.secondary.replace('#', ''),
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.description,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              }),
              ...exp.achievements.map(
                achievement =>
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `• ${achievement}`,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 100 },
                  })
              ),
            ]),

            // Education
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Education',
                  bold: true,
                  size: 24,
                  color: colors.primary.replace('#', ''),
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            ...data.education.flatMap(edu => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree} in ${edu.field}`,
                    bold: true,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.institution,
                    size: 22,
                  }),
                ],
                spacing: { after: 100 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
                    size: 20,
                    color: colors.secondary.replace('#', ''),
                  }),
                ],
                spacing: { after: 200 },
              }),
            ]),

            // Skills
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Skills',
                  bold: true,
                  size: 24,
                  color: colors.primary.replace('#', ''),
                }),
              ],
              heading: HeadingLevel.HEADING_2,
              spacing: { after: 200 },
            }),

            ...(data.skills.technical.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Technical: ${data.skills.technical.join(', ')}`,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                ]
              : []),

            ...(data.skills.business.length > 0
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `Business: ${data.skills.business.join(', ')}`,
                        size: 22,
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                ]
              : []),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([new Uint8Array(buffer)], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch {
    // Error generating DOCX
    throw new Error('Failed to generate DOCX');
  }
};

// Export to TXT
export const exportToTXT = (
  data: ResumeData,
  filename: string = 'resume.txt'
) => {
  try {
    let content = '';

    // Header
    content += `${data.personal.fullName}\n`;
    content += `${data.personal.email} • ${data.personal.phone} • ${data.personal.location}\n`;
    if (data.personal.linkedin) content += `${data.personal.linkedin}\n`;
    if (data.personal.github) content += `${data.personal.github}\n`;
    content += '\n';

    // Summary
    if (data.summary) {
      content += 'PROFESSIONAL SUMMARY\n';
      content += '==================\n';
      content += `${data.summary}\n\n`;
    }

    // Experience
    content += 'PROFESSIONAL EXPERIENCE\n';
    content += '=======================\n';
    data.experience.forEach(exp => {
      content += `${exp.position} | ${exp.company}\n`;
      content += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      content += `${exp.description}\n`;
      exp.achievements.forEach(achievement => {
        content += `• ${achievement}\n`;
      });
      content += '\n';
    });

    // Education
    content += 'EDUCATION\n';
    content += '=========\n';
    data.education.forEach(edu => {
      content += `${edu.degree} in ${edu.field}\n`;
      content += `${edu.institution}\n`;
      content += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n`;
      if (edu.gpa) content += `GPA: ${edu.gpa}\n`;
      content += '\n';
    });

    // Skills
    content += 'SKILLS\n';
    content += '======\n';
    if (data.skills.technical.length > 0) {
      content += `Technical: ${data.skills.technical.join(', ')}\n`;
    }
    if (data.skills.business.length > 0) {
      content += `Business: ${data.skills.business.join(', ')}\n`;
    }
    content += '\n';

    // Projects
    if (data.projects && data.projects.length > 0) {
      content += 'PROJECTS\n';
      content += '========\n';
      data.projects.forEach(project => {
        content += `${project.name}\n`;
        content += `${project.description}\n`;
        if (project.technologies.length > 0) {
          content += `Technologies: ${project.technologies.join(', ')}\n`;
        }
        content += '\n';
      });
    }

    // Achievements
    if (data.achievements && data.achievements.length > 0) {
      content += 'ACHIEVEMENTS\n';
      content += '============\n';
      data.achievements.forEach(achievement => {
        content += `• ${achievement}\n`;
      });
    }

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
  } catch {
    // Error generating TXT
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
      return exportToTXT(data, finalFilename);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};
