'use client';

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { ResumeData, ResumeTemplate } from '@/types/resume';

interface DOCXExporterProps {
  resumeData: ResumeData;
  template: ResumeTemplate | null;
  onExport?: () => void;
}

export const DOCXExporter: React.FC<DOCXExporterProps> = ({
  resumeData,
  template: _template,
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const createDocument = (): Document => {
    const children: Paragraph[] = [];

    // Header
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.personal.fullName || 'Your Name',
            bold: true,
            size: 32,
            color: '1f2937',
          }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    // Contact Information
    const contactInfo = [
      resumeData.personal.email || 'your.email@example.com',
      resumeData.personal.phone || '(555) 123-4567',
      resumeData.personal.location || 'Your Location',
      resumeData.personal.linkedin &&
        `LinkedIn: ${resumeData.personal.linkedin}`,
      resumeData.personal.github && `GitHub: ${resumeData.personal.github}`,
    ].filter(Boolean);

    children.push(
      new Paragraph({
        children: contactInfo.map(
          info =>
            new TextRun({
              text: `${info} | `,
              size: 20,
              color: '6b7280',
            })
        ),
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );

    // Professional Summary
    if (resumeData.summary) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Professional Summary',
              bold: true,
              size: 24,
              color: '1f2937',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        })
      );

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.summary,
              size: 22,
              color: '374151',
            }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // Experience
    if (resumeData.experience && resumeData.experience.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Professional Experience',
              bold: true,
              size: 24,
              color: '1f2937',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        })
      );

      resumeData.experience.forEach(job => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: job.position,
                bold: true,
                size: 22,
                color: '1f2937',
              }),
            ],
            spacing: { after: 100 },
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: job.company,
                bold: true,
                size: 20,
                color: '2563eb',
              }),
            ],
            spacing: { after: 50 },
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${job.location} • ${job.startDate} - ${job.endDate || 'Present'}`,
                size: 18,
                color: '6b7280',
              }),
            ],
            spacing: { after: 100 },
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: job.description,
                size: 20,
                color: '374151',
              }),
            ],
            spacing: { after: 100 },
          })
        );

        if (job.achievements && job.achievements.length > 0) {
          job.achievements.forEach(achievement => {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 20,
                    color: '374151',
                  }),
                ],
                spacing: { after: 50 },
              })
            );
          });
        }

        children.push(
          new Paragraph({
            children: [new TextRun({ text: '', break: 1 })],
            spacing: { after: 200 },
          })
        );
      });
    }

    // Skills
    if (
      resumeData.skills.technical.length > 0 ||
      resumeData.skills.soft.length > 0
    ) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Skills',
              bold: true,
              size: 24,
              color: '1f2937',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        })
      );

      const allSkills = [
        ...resumeData.skills.technical,
        ...resumeData.skills.soft,
      ];
      const skillsText = allSkills.join(' • ');

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: skillsText,
              size: 20,
              color: '374151',
            }),
          ],
          spacing: { after: 300 },
        })
      );
    }

    // Education
    if (resumeData.education && resumeData.education.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Education',
              bold: true,
              size: 24,
              color: '1f2937',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        })
      );

      resumeData.education.forEach(edu => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.degree,
                bold: true,
                size: 22,
                color: '1f2937',
              }),
            ],
            spacing: { after: 50 },
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: edu.institution,
                bold: true,
                size: 20,
                color: '2563eb',
              }),
            ],
            spacing: { after: 50 },
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.location} • ${edu.startDate} - ${edu.endDate || 'Present'}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`,
                size: 18,
                color: '6b7280',
              }),
            ],
            spacing: { after: 200 },
          })
        );
      });
    }

    // Projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Projects',
              bold: true,
              size: 24,
              color: '1f2937',
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 200 },
        })
      );

      resumeData.projects.forEach(project => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.name,
                bold: true,
                size: 22,
                color: '1f2937',
              }),
            ],
            spacing: { after: 100 },
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: project.description,
                size: 20,
                color: '374151',
              }),
            ],
            spacing: { after: 100 },
          })
        );

        if (project.technologies && project.technologies.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technologies: ${project.technologies.join(', ')}`,
                  size: 18,
                  color: '6b7280',
                }),
              ],
              spacing: { after: 200 },
            })
          );
        }
      });
    }

    return new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const doc = createDocument();
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([new Uint8Array(buffer)], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      const fileName = `${resumeData.personal.fullName || 'resume'}-resume.docx`;
      saveAs(blob, fileName);

      if (onExport) {
        onExport();
      }
    } catch {
      // Error generating DOCX
      alert('Error generating DOCX. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant='outline'
      size='sm'
      className='flex items-center gap-2'
    >
      {isExporting ? (
        <>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600'></div>
          Generating...
        </>
      ) : (
        <>
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709'
            />
          </svg>
          DOCX
        </>
      )}
    </Button>
  );
};

export default DOCXExporter;
