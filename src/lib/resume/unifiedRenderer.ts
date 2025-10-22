import { ResumeData, ResumeTemplate } from '@/types/resume';

// Unified rendering configuration that matches the template system
export interface RenderConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: {
      heading: string;
      subheading: string;
      body: string;
      small: string;
    };
  };
  spacing: {
    padding: string;
    margins: string;
    lineHeight: string;
  };
}

// Convert template layout to render config
export const getRenderConfig = (template: ResumeTemplate): RenderConfig => {
  const { layout } = template;
  return {
    colors: layout.colors,
    fonts: layout.fonts,
    spacing: {
      ...layout.spacing,
      lineHeight: layout.spacing.lineHeight.toString(),
    },
  };
};

// Font mapping for export formats (web fonts to system fonts)
export const mapFontForExport = (webFont: string): string => {
  const fontMap: { [key: string]: string } = {
    Inter: 'helvetica',
    Poppins: 'helvetica',
    Roboto: 'helvetica',
    'Open Sans': 'helvetica',
    Lato: 'helvetica',
    Montserrat: 'helvetica',
    'Source Sans Pro': 'helvetica',
    Nunito: 'helvetica',
    'Playfair Display': 'times',
    Merriweather: 'times',
    Lora: 'times',
    'Crimson Text': 'times',
    'PT Serif': 'times',
    Georgia: 'times',
    'Times New Roman': 'times',
    'Courier New': 'courier',
    Monaco: 'courier',
    Consolas: 'courier',
    'Fira Code': 'courier',
  };

  // Extract font family name (remove quotes, weights, etc.)
  const cleanFont =
    webFont?.replace(/['"]/g, '').split(',')[0]?.trim() || 'helvetica';
  return fontMap[cleanFont] || 'helvetica';
};

// Font size conversion utilities
export const convertFontSize = (cssSize: string): number => {
  // Convert CSS font sizes to points for PDF/DOCX
  const sizeMap: { [key: string]: number } = {
    'text-xs': 8,
    'text-sm': 10,
    'text-base': 12,
    'text-lg': 14,
    'text-xl': 16,
    'text-2xl': 18,
    'text-3xl': 20,
    'text-4xl': 24,
  };

  // Extract size from CSS class or use default
  const match = cssSize.match(/text-(\w+)/);
  return match ? sizeMap[match[1] as keyof typeof sizeMap] || 12 : 12;
};

// Color conversion utilities
export const convertColor = (color: string): string => {
  // Convert hex colors to RGB for jsPDF
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
  return color;
};

// Spacing conversion utilities
export const convertSpacing = (spacing: string): number => {
  // Convert CSS spacing to points
  const spacingMap: { [key: string]: number } = {
    'p-1': 4,
    'p-2': 8,
    'p-3': 12,
    'p-4': 16,
    'p-5': 20,
    'p-6': 24,
    'p-8': 32,
    'mb-2': 8,
    'mb-3': 12,
    'mb-4': 16,
    'mb-6': 24,
    'mb-8': 32,
  };

  // Handle margin values like "1in", "0.75in", etc.
  if (spacing.includes('in')) {
    const inches = parseFloat(spacing.replace('in', ''));
    return inches * 72; // Convert inches to points
  }

  // Handle pixel values
  if (spacing.includes('px')) {
    const pixels = parseFloat(spacing.replace('px', ''));
    return pixels * 0.75; // Convert pixels to points (approximate)
  }

  const match = spacing.match(/(p|mb|mt|ml|mr)-(\d+)/);
  return match ? spacingMap[match[0]] || 12 : 12;
};

// Unified content structure for consistent rendering
export interface UnifiedContent {
  header: {
    name: string;
    contact: string[];
  };
  sections: {
    summary?: string;
    experience: Array<{
      position: string;
      company: string;
      duration: string;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      duration: string;
      gpa?: string;
    }>;
    skills: {
      technical: string[];
      business: string[];
    };
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
      duration: string;
    }>;
    achievements?: string[];
  };
}

// Convert ResumeData to UnifiedContent
export const convertToUnifiedContent = (data: ResumeData): UnifiedContent => {
  const contact = [
    data.personal.email,
    data.personal.phone,
    data.personal.location,
  ];

  if (data.personal.linkedin) contact.push(data.personal.linkedin);
  if (data.personal.github) contact.push(data.personal.github);

  return {
    header: {
      name: data.personal.fullName,
      contact,
    },
    sections: {
      ...(data.summary && { summary: data.summary }),
      experience: data.experience.map(exp => ({
        position: exp.position,
        company: exp.company,
        duration: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
        description: exp.description,
        achievements: exp.achievements,
      })),
      education: data.education.map(edu => ({
        degree: `${edu.degree} in ${edu.field}`,
        institution: edu.institution,
        duration: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
        ...(edu.gpa && { gpa: edu.gpa }),
      })),
      skills: {
        technical: data.skills.technical,
        business: data.skills.business,
      },
      projects: data.projects?.map(project => ({
        name: project.name,
        description: project.description,
        technologies: project.technologies,
        ...(project.url && { url: project.url }),
        duration: `${project.startDate} - ${project.endDate || 'Present'}`,
      })),
      ...(data.achievements && { achievements: data.achievements }),
    },
  };
};

// PDF rendering with unified styling
export const renderToPDF = async (
  config: RenderConfig,
  content: UnifiedContent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any, // jsPDF document
  filename: string = 'resume.pdf'
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsDoc = doc as any; // Cast for jsPDF operations
  const pageWidth = jsDoc.internal.pageSize.getWidth();
  const pageHeight = jsDoc.internal.pageSize.getHeight();
  const margin = convertSpacing(config.spacing.margins || '0.75in');
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      jsDoc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Helper function to add text with proper styling
  const addText = (
    text: string,
    fontSize: number,
    isBold: boolean = false,
    color: string = config.colors.text,
    alignment: 'left' | 'center' | 'right' = 'left',
    fontFamily: string = 'helvetica'
  ) => {
    jsDoc.setFontSize(fontSize);
    jsDoc.setFont(mapFontForExport(fontFamily), isBold ? 'bold' : 'normal');

    // Set text color properly for jsPDF
    const colorArray = convertColor(color);
    if (Array.isArray(colorArray)) {
      jsDoc.setTextColor(colorArray[0], colorArray[1], colorArray[2]);
    } else {
      jsDoc.setTextColor(colorArray);
    }

    const lines = jsDoc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 1.2; // Better line height
    const requiredSpace = lines.length * lineHeight + 4;

    // Check if we need a new page
    checkPageBreak(requiredSpace);

    const xPosition = alignment === 'center' ? pageWidth / 2 : margin;
    jsDoc.text(lines, xPosition, yPosition, { align: alignment });
    yPosition += requiredSpace;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    yPosition += 12; // More space before section headers
    checkPageBreak(20);

    addText(
      title,
      convertFontSize(config.fonts.size.subheading),
      true,
      config.colors.primary,
      'left',
      config.fonts.heading
    );

    // Add underline with accent color
    const accentColor = convertColor(config.colors.accent);
    if (Array.isArray(accentColor)) {
      jsDoc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    } else {
      jsDoc.setDrawColor(accentColor);
    }
    jsDoc.setLineWidth(1.5);
    jsDoc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
    yPosition += 8; // More space after section headers
  };

  // Helper function to add a subtle separator line
  const addSeparator = () => {
    yPosition += 6; // More space before separators
    const secondaryColor = convertColor(config.colors.secondary);
    if (Array.isArray(secondaryColor)) {
      jsDoc.setDrawColor(
        secondaryColor[0],
        secondaryColor[1],
        secondaryColor[2]
      );
    } else {
      jsDoc.setDrawColor(secondaryColor);
    }
    jsDoc.setLineWidth(0.5);
    jsDoc.line(margin + 20, yPosition, pageWidth - margin - 20, yPosition);
    yPosition += 6; // More space after separators
  };

  // Header
  addText(
    content.header.name,
    convertFontSize(config.fonts.size.heading),
    true,
    config.colors.primary,
    'center',
    config.fonts.heading
  );
  addText(
    content.header.contact.join(' • '),
    convertFontSize(config.fonts.size.small),
    false,
    config.colors.secondary,
    'center',
    config.fonts.body
  );
  yPosition += 15; // More space after header

  // Summary
  if (content.sections.summary) {
    addSectionHeader('Professional Summary');
    addText(
      content.sections.summary,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
    yPosition += 5;
  }

  // Experience
  addSectionHeader('Professional Experience');
  content.sections.experience.forEach((exp, index) => {
    addText(
      `${exp.position} | ${exp.company}`,
      convertFontSize(config.fonts.size.body),
      true,
      config.colors.text,
      'left',
      config.fonts.heading
    );
    addText(
      exp.duration,
      convertFontSize(config.fonts.size.small),
      false,
      config.colors.secondary,
      'left',
      config.fonts.body
    );
    addText(
      exp.description,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );

    // Add achievements with proper indentation
    if (exp.achievements && exp.achievements.length > 0) {
      exp.achievements.forEach(achievement => {
        addText(
          `• ${achievement}`,
          convertFontSize(config.fonts.size.body),
          false,
          config.colors.text,
          'left',
          config.fonts.body
        );
      });
    }

    // Add separator between experience entries (except for the last one)
    if (index < content.sections.experience.length - 1) {
      addSeparator();
    } else {
      yPosition += 8; // More space after last experience
    }
  });

  // Education
  addSectionHeader('Education');
  content.sections.education.forEach((edu, index) => {
    addText(
      edu.degree,
      convertFontSize(config.fonts.size.body),
      true,
      config.colors.text,
      'left',
      config.fonts.heading
    );
    addText(
      edu.institution,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
    addText(
      edu.duration,
      convertFontSize(config.fonts.size.small),
      false,
      config.colors.secondary,
      'left',
      config.fonts.body
    );
    if (edu.gpa) {
      addText(
        `GPA: ${edu.gpa}`,
        convertFontSize(config.fonts.size.small),
        false,
        config.colors.secondary,
        'left',
        config.fonts.body
      );
    }

    // Add separator between education entries (except for the last one)
    if (index < content.sections.education.length - 1) {
      addSeparator();
    } else {
      yPosition += 8; // More space after last education
    }
  });

  // Skills
  addSectionHeader('Skills');
  if (content.sections.skills.technical.length > 0) {
    addText(
      `Technical: ${content.sections.skills.technical.join(', ')}`,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
  }
  if (content.sections.skills.business.length > 0) {
    addText(
      `Business: ${content.sections.skills.business.join(', ')}`,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
  }
  yPosition += 8; // Space after skills

  // Projects
  if (content.sections.projects && content.sections.projects.length > 0) {
    addSectionHeader('Projects');
    content.sections.projects.forEach((project, index) => {
      addText(
        project.name,
        convertFontSize(config.fonts.size.body),
        true,
        config.colors.text,
        'left',
        config.fonts.heading
      );
      addText(
        project.description,
        convertFontSize(config.fonts.size.body),
        false,
        config.colors.text,
        'left',
        config.fonts.body
      );
      if (project.technologies && project.technologies.length > 0) {
        addText(
          `Technologies: ${project.technologies.join(', ')}`,
          convertFontSize(config.fonts.size.small),
          false,
          config.colors.secondary,
          'left',
          config.fonts.body
        );
      }
      if (project.url) {
        addText(
          `URL: ${project.url}`,
          convertFontSize(config.fonts.size.small),
          false,
          config.colors.accent,
          'left',
          config.fonts.body
        );
      }

      // Add separator between project entries (except for the last one)
      if (
        content.sections.projects &&
        index < content.sections.projects.length - 1
      ) {
        addSeparator();
      } else {
        yPosition += 8; // More space after last project
      }
    });
  }

  // Achievements
  if (
    content.sections.achievements &&
    content.sections.achievements.length > 0
  ) {
    addSectionHeader('Achievements');
    content.sections.achievements.forEach(achievement => {
      addText(
        `• ${achievement}`,
        convertFontSize(config.fonts.size.body),
        false,
        config.colors.text,
        'left',
        config.fonts.body
      );
    });
    yPosition += 8; // Space after achievements
  }

  // Save the PDF
  jsDoc.save(filename);
};

// DOCX rendering with unified styling
export const renderToDOCX = async (
  config: RenderConfig,
  content: UnifiedContent,
  filename: string = 'resume.docx'
) => {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    BorderStyle,
  } = await import('docx');

  // Helper function to convert colors for DOCX
  const convertColorForDOCX = (color: string): string => {
    if (color.startsWith('#')) {
      return color.replace('#', '');
    }
    return color;
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            children: [
              new TextRun({
                text: content.header.name,
                bold: true,
                size: convertFontSize(config.fonts.size.heading) * 2, // DOCX uses half-points
                color: convertColorForDOCX(config.colors.primary),
                font: mapFontForExport(config.fonts.heading),
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: content.header.contact.join(' • '),
                size: convertFontSize(config.fonts.size.small) * 2,
                color: convertColorForDOCX(config.colors.secondary),
                font: mapFontForExport(config.fonts.body),
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),

          // Summary
          ...(content.sections.summary
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Professional Summary',
                      bold: true,
                      size: convertFontSize(config.fonts.size.subheading) * 2,
                      color: convertColorForDOCX(config.colors.primary),
                      font: mapFontForExport(config.fonts.heading),
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 },
                  border: {
                    bottom: {
                      color: convertColorForDOCX(config.colors.accent),
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 6,
                    },
                  },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: content.sections.summary,
                      size: convertFontSize(config.fonts.size.body) * 2,
                      font: mapFontForExport(config.fonts.body),
                    }),
                  ],
                  spacing: { after: 400 },
                }),
              ]
            : []),

          // Experience
          new Paragraph({
            children: [
              new TextRun({
                text: 'Professional Experience',
                bold: true,
                size: convertFontSize(config.fonts.size.subheading) * 2,
                color: convertColor(config.colors.primary),
                font: mapFontForExport(config.fonts.heading),
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          ...content.sections.experience.flatMap(exp => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.position} | ${exp.company}`,
                  bold: true,
                  size: convertFontSize(config.fonts.size.body) * 2,
                  font: mapFontForExport(config.fonts.heading),
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.duration,
                  size: convertFontSize(config.fonts.size.small) * 2,
                  color: convertColor(config.colors.secondary),
                  font: mapFontForExport(config.fonts.body),
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.description,
                  size: convertFontSize(config.fonts.size.body) * 2,
                  font: mapFontForExport(config.fonts.body),
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
                      size: convertFontSize(config.fonts.size.body) * 2,
                      font: mapFontForExport(config.fonts.body),
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
                size: convertFontSize(config.fonts.size.subheading) * 2,
                color: convertColor(config.colors.primary),
                font: mapFontForExport(config.fonts.heading),
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          ...content.sections.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: convertFontSize(config.fonts.size.body) * 2,
                  font: mapFontForExport(config.fonts.heading),
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.institution,
                  size: convertFontSize(config.fonts.size.body) * 2,
                  font: mapFontForExport(config.fonts.body),
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.duration,
                  size: convertFontSize(config.fonts.size.small) * 2,
                  color: convertColor(config.colors.secondary),
                  font: mapFontForExport(config.fonts.body),
                }),
              ],
              spacing: { after: 100 },
            }),
            ...(edu.gpa
              ? [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `GPA: ${edu.gpa}`,
                        size: convertFontSize(config.fonts.size.small) * 2,
                        color: convertColor(config.colors.secondary),
                        font: mapFontForExport(config.fonts.body),
                      }),
                    ],
                    spacing: { after: 200 },
                  }),
                ]
              : []),
          ]),

          // Skills
          new Paragraph({
            children: [
              new TextRun({
                text: 'Skills',
                bold: true,
                size: convertFontSize(config.fonts.size.subheading) * 2,
                color: convertColor(config.colors.primary),
                font: mapFontForExport(config.fonts.heading),
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),

          ...(content.sections.skills.technical.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Technical: ${content.sections.skills.technical.join(', ')}`,
                      size: convertFontSize(config.fonts.size.body) * 2,
                      font: mapFontForExport(config.fonts.body),
                    }),
                  ],
                  spacing: { after: 100 },
                }),
              ]
            : []),

          ...(content.sections.skills.business.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `Business: ${content.sections.skills.business.join(', ')}`,
                      size: convertFontSize(config.fonts.size.body) * 2,
                      font: mapFontForExport(config.fonts.body),
                    }),
                  ],
                  spacing: { after: 100 },
                }),
              ]
            : []),

          // Projects
          ...(content.sections.projects && content.sections.projects.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Projects',
                      bold: true,
                      size: convertFontSize(config.fonts.size.subheading) * 2,
                      color: convertColor(config.colors.primary),
                      font: mapFontForExport(config.fonts.heading),
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 },
                }),
                ...content.sections.projects.flatMap(project => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: project.name,
                        bold: true,
                        size: convertFontSize(config.fonts.size.body) * 2,
                        font: mapFontForExport(config.fonts.heading),
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: project.description,
                        size: convertFontSize(config.fonts.size.body) * 2,
                        font: mapFontForExport(config.fonts.body),
                      }),
                    ],
                    spacing: { after: 100 },
                  }),
                  ...(project.technologies.length > 0
                    ? [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `Technologies: ${project.technologies.join(', ')}`,
                              size:
                                convertFontSize(config.fonts.size.small) * 2,
                              color: convertColor(config.colors.secondary),
                              font: mapFontForExport(config.fonts.body),
                            }),
                          ],
                          spacing: { after: 200 },
                        }),
                      ]
                    : []),
                ]),
              ]
            : []),

          // Achievements
          ...(content.sections.achievements &&
          content.sections.achievements.length > 0
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Achievements',
                      bold: true,
                      size: convertFontSize(config.fonts.size.subheading) * 2,
                      color: convertColor(config.colors.primary),
                      font: mapFontForExport(config.fonts.heading),
                    }),
                  ],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { after: 200 },
                }),
                ...content.sections.achievements.map(
                  achievement =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `• ${achievement}`,
                          size: convertFontSize(config.fonts.size.body) * 2,
                          font: mapFontForExport(config.fonts.body),
                        }),
                      ],
                      spacing: { after: 100 },
                    })
                ),
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
};

// TXT rendering with unified structure
export const renderToTXT = (
  content: UnifiedContent,
  filename: string = 'resume.txt'
) => {
  let text = '';

  // Header
  text += `${content.header.name}\n`;
  text += `${content.header.contact.join(' • ')}\n\n`;

  // Summary
  if (content.sections.summary) {
    text += 'PROFESSIONAL SUMMARY\n';
    text += '==================\n';
    text += `${content.sections.summary}\n\n`;
  }

  // Experience
  text += 'PROFESSIONAL EXPERIENCE\n';
  text += '=======================\n';
  content.sections.experience.forEach(exp => {
    text += `${exp.position} | ${exp.company}\n`;
    text += `${exp.duration}\n`;
    text += `${exp.description}\n`;
    exp.achievements.forEach(achievement => {
      text += `• ${achievement}\n`;
    });
    text += '\n';
  });

  // Education
  text += 'EDUCATION\n';
  text += '=========\n';
  content.sections.education.forEach(edu => {
    text += `${edu.degree}\n`;
    text += `${edu.institution}\n`;
    text += `${edu.duration}\n`;
    if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
    text += '\n';
  });

  // Skills
  text += 'SKILLS\n';
  text += '======\n';
  if (content.sections.skills.technical.length > 0) {
    text += `Technical: ${content.sections.skills.technical.join(', ')}\n`;
  }
  if (content.sections.skills.business.length > 0) {
    text += `Business: ${content.sections.skills.business.join(', ')}\n`;
  }
  text += '\n';

  // Projects
  if (content.sections.projects && content.sections.projects.length > 0) {
    text += 'PROJECTS\n';
    text += '========\n';
    content.sections.projects.forEach(project => {
      text += `${project.name}\n`;
      text += `${project.description}\n`;
      if (project.technologies.length > 0) {
        text += `Technologies: ${project.technologies.join(', ')}\n`;
      }
      text += '\n';
    });
  }

  // Achievements
  if (
    content.sections.achievements &&
    content.sections.achievements.length > 0
  ) {
    text += 'ACHIEVEMENTS\n';
    text += '============\n';
    content.sections.achievements.forEach(achievement => {
      text += `• ${achievement}\n`;
    });
  }

  // Create and download file
  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

  URL.revokeObjectURL(link.href);
};
