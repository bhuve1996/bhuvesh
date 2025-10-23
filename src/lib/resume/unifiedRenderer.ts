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
export const convertColor = (color: string): [number, number, number] => {
  // Convert hex colors to RGB array for jsPDF
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [r, g, b];
  }

  // Handle named colors
  const colorMap: { [key: string]: [number, number, number] } = {
    black: [0, 0, 0],
    white: [255, 255, 255],
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    gray: [128, 128, 128],
    grey: [128, 128, 128],
    darkgray: [64, 64, 64],
    darkgrey: [64, 64, 64],
    lightgray: [192, 192, 192],
    lightgrey: [192, 192, 192],
  };

  return colorMap[color.toLowerCase()] || [0, 0, 0]; // Default to black
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
      soft: string[];
      languages: string[];
      certifications: string[];
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
        soft: data.skills.soft,
        languages: data.skills.languages,
        certifications: data.skills.certifications,
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
  const margin = 20; // Fixed small margin in points (about 0.28 inches)
  const contentWidth = pageWidth - margin * 2;
  let yPosition = margin + 2; // Minimal top margin

  // Helper function to check if we need a new page
  const checkPageBreak = (requiredSpace: number = 10) => {
    if (yPosition + requiredSpace > pageHeight - margin - 5) {
      // Very aggressive page breaking
      jsDoc.addPage();
      yPosition = margin + 2;
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
    const [r, g, b] = convertColor(color);
    jsDoc.setTextColor(r, g, b);

    const lines = jsDoc.splitTextToSize(text, contentWidth);
    const lineHeight = fontSize * 1.2; // Better line height to match preview
    const requiredSpace = lines.length * lineHeight + 2; // Space between lines

    // Check if we need a new page
    checkPageBreak(requiredSpace);

    const xPosition = alignment === 'center' ? pageWidth / 2 : margin;
    jsDoc.text(lines, xPosition, yPosition, {
      align: alignment,
      maxWidth: contentWidth,
    });
    yPosition += requiredSpace;
  };

  // Helper function to add section header
  const addSectionHeader = (title: string) => {
    yPosition += 12; // Reduced spacing between sections
    checkPageBreak(15);

    addText(
      title,
      convertFontSize(config.fonts.size.subheading),
      true,
      config.colors.primary,
      'left',
      config.fonts.heading
    );

    // Add underline with accent color (border-b-2 pb-1 equivalent)
    const [r, g, b] = convertColor(config.colors.accent);
    jsDoc.setDrawColor(r, g, b);
    jsDoc.setLineWidth(2);
    jsDoc.line(margin, yPosition - 4, pageWidth - margin, yPosition - 4);
    yPosition += 8; // Reduced spacing after headers
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
  yPosition += 8; // mb-2 equivalent (8px) - matches preview

  addText(
    content.header.contact.join(' • '),
    convertFontSize(config.fonts.size.small),
    false,
    config.colors.secondary,
    'center',
    config.fonts.body
  );
  yPosition += 16; // Reduced spacing after header

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
    yPosition += 6; // Reduced spacing after summary
  }

  // Experience
  addSectionHeader('Professional Experience');
  content.sections.experience.forEach((exp, index) => {
    // Job title and company
    addText(
      `${exp.position} | ${exp.company}`,
      convertFontSize(config.fonts.size.body) + 1,
      true,
      config.colors.text,
      'left',
      config.fonts.heading
    );

    // Duration
    addText(
      exp.duration,
      convertFontSize(config.fonts.size.small),
      false,
      config.colors.secondary,
      'left',
      config.fonts.body
    );

    // Description
    if (exp.description) {
      addText(
        exp.description,
        convertFontSize(config.fonts.size.body),
        false,
        config.colors.text,
        'left',
        config.fonts.body
      );
    }

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
      yPosition += 8; // Reduced spacing between experience entries
    } else {
      yPosition += 12; // Reduced spacing after experience section
    }
  });

  // Education
  addSectionHeader('Education');
  content.sections.education.forEach((edu, index) => {
    // Degree
    addText(
      edu.degree,
      convertFontSize(config.fonts.size.body) + 1,
      true,
      config.colors.text,
      'left',
      config.fonts.heading
    );

    // Institution
    addText(
      edu.institution,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );

    // Duration and GPA on same line if GPA exists
    const durationText = edu.gpa
      ? `${edu.duration} | GPA: ${edu.gpa}`
      : edu.duration;
    addText(
      durationText,
      convertFontSize(config.fonts.size.small),
      false,
      config.colors.secondary,
      'left',
      config.fonts.body
    );

    // Add separator between education entries (except for the last one)
    if (index < content.sections.education.length - 1) {
      yPosition += 6; // Reduced spacing between education entries
    } else {
      yPosition += 12; // Reduced spacing after education section
    }
  });

  // Skills
  addSectionHeader('Skills');

  // Technical Skills
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

  // Business Skills
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

  // Soft Skills
  if (content.sections.skills.soft.length > 0) {
    addText(
      `Soft Skills: ${content.sections.skills.soft.join(', ')}`,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
  }

  // Languages
  if (content.sections.skills.languages.length > 0) {
    addText(
      `Languages: ${content.sections.skills.languages.join(', ')}`,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
  }

  // Certifications
  if (content.sections.skills.certifications.length > 0) {
    addText(
      `Certifications: ${content.sections.skills.certifications.join(', ')}`,
      convertFontSize(config.fonts.size.body),
      false,
      config.colors.text,
      'left',
      config.fonts.body
    );
  }

  yPosition += 12; // Reduced spacing after skills section

  // Projects
  if (content.sections.projects && content.sections.projects.length > 0) {
    addSectionHeader('Projects');
    content.sections.projects.forEach((project, index) => {
      // Project name
      addText(
        project.name,
        convertFontSize(config.fonts.size.body) + 1,
        true,
        config.colors.text,
        'left',
        config.fonts.heading
      );

      // Project description
      if (project.description) {
        addText(
          project.description,
          convertFontSize(config.fonts.size.body),
          false,
          config.colors.text,
          'left',
          config.fonts.body
        );
      }

      // Technologies and URL on same line if both exist
      const techAndUrl = [];
      if (project.technologies && project.technologies.length > 0) {
        techAndUrl.push(`Technologies: ${project.technologies.join(', ')}`);
      }
      if (project.url) {
        techAndUrl.push(`URL: ${project.url}`);
      }

      if (techAndUrl.length > 0) {
        addText(
          techAndUrl.join(' | '),
          convertFontSize(config.fonts.size.small),
          false,
          config.colors.secondary,
          'left',
          config.fonts.body
        );
      }

      // Add separator between project entries (except for the last one)
      if (
        content.sections.projects &&
        index < content.sections.projects.length - 1
      ) {
        yPosition += 8; // Reduced spacing between project entries
      } else {
        yPosition += 12; // Reduced spacing after projects section
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
    yPosition += 12; // Reduced spacing after achievements section
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
    // Handle named colors
    const colorMap: { [key: string]: string } = {
      black: '000000',
      white: 'FFFFFF',
      red: 'FF0000',
      green: '008000',
      blue: '0000FF',
      gray: '808080',
      grey: '808080',
      darkgray: '404040',
      darkgrey: '404040',
      lightgray: 'C0C0C0',
      lightgrey: 'C0C0C0',
    };
    return colorMap[color.toLowerCase()] || '000000';
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
                color: convertColorForDOCX(config.colors.primary),
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
                  color: convertColorForDOCX(config.colors.secondary),
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
                color: convertColorForDOCX(config.colors.primary),
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
                  color: convertColorForDOCX(config.colors.secondary),
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
                        color: convertColorForDOCX(config.colors.secondary),
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
                color: convertColorForDOCX(config.colors.primary),
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
                      color: convertColorForDOCX(config.colors.primary),
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
                              color: convertColorForDOCX(
                                config.colors.secondary
                              ),
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
                      color: convertColorForDOCX(config.colors.primary),
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
