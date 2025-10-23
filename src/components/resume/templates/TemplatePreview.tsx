'use client';

import React from 'react';

import { ResumeTemplate } from '@/types/resume';

interface TemplatePreviewProps {
  template: ResumeTemplate;
  className?: string;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  className = '',
}) => {
  const { layout, sampleData } = template;
  const { colors, fonts } = layout;

  return (
    <div
      className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body,
        fontSize: '10px',
        lineHeight: 1.4,
        transform: 'scale(0.8)',
        transformOrigin: 'top left',
        width: '125%',
        height: '156%',
        minHeight: '200px',
      }}
    >
      {/* Header */}
      <div
        className='text-center p-3 border-b'
        style={{ borderColor: `${colors.accent}30` }}
      >
        <h1
          className='font-bold mb-1'
          style={{
            fontFamily: fonts.heading,
            fontSize: '14px',
            color: colors.primary,
          }}
        >
          {sampleData.personal.fullName}
        </h1>
        <div
          className='flex flex-wrap justify-center gap-2 text-xs'
          style={{ color: colors.secondary }}
        >
          <span>{sampleData.personal.email}</span>
          {sampleData.personal.phone && (
            <>
              <span>•</span>
              <span>{sampleData.personal.phone}</span>
            </>
          )}
          {sampleData.personal.location && (
            <>
              <span>•</span>
              <span>{sampleData.personal.location}</span>
            </>
          )}
          {sampleData.personal.linkedin && (
            <>
              <span>•</span>
              <span>LinkedIn</span>
            </>
          )}
          {sampleData.personal.github && (
            <>
              <span>•</span>
              <span>GitHub</span>
            </>
          )}
          {sampleData.personal.portfolio && (
            <>
              <span>•</span>
              <span>Portfolio</span>
            </>
          )}
        </div>
      </div>

      <div className='p-3 space-y-3'>
        {/* Summary */}
        {sampleData.summary && (
          <div>
            <h2
              className='font-semibold mb-1 border-b pb-1'
              style={{
                fontFamily: fonts.heading,
                fontSize: '12px',
                color: colors.primary,
                borderColor: colors.accent,
              }}
            >
              {layout.sections.find(s => s.type === 'summary')?.title ||
                'Professional Summary'}
            </h2>
            <p
              className='text-xs leading-relaxed'
              style={{ color: colors.text }}
            >
              {sampleData.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {sampleData.experience && sampleData.experience.length > 0 && (
          <div>
            <h2
              className='font-semibold mb-2 border-b pb-1'
              style={{
                fontFamily: fonts.heading,
                fontSize: '12px',
                color: colors.primary,
                borderColor: colors.accent,
              }}
            >
              {layout.sections.find(s => s.type === 'experience')?.title ||
                'Experience'}
            </h2>
            <div className='space-y-2'>
              {sampleData.experience.slice(0, 2).map((exp, index) => (
                <div
                  key={exp.id || index}
                  className='border-l-2 pl-2'
                  style={{ borderColor: colors.accent }}
                >
                  <div className='flex justify-between items-start mb-1'>
                    <div>
                      <h3
                        className='font-semibold text-xs'
                        style={{ color: colors.text }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        className='font-medium text-xs'
                        style={{ color: colors.primary }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className='text-xs'
                      style={{ color: colors.secondary }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className='text-xs mb-1' style={{ color: colors.text }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className='text-xs space-y-0.5'>
                      {exp.achievements
                        .slice(0, 2)
                        .map((achievement, achIndex) => (
                          <li key={achIndex} style={{ color: colors.text }}>
                            • {achievement}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {sampleData.skills && (
          <div>
            <h2
              className='font-semibold mb-2 border-b pb-1'
              style={{
                fontFamily: fonts.heading,
                fontSize: '12px',
                color: colors.primary,
                borderColor: colors.accent,
              }}
            >
              {layout.sections.find(s => s.type === 'skills')?.title ||
                'Skills'}
            </h2>
            <div className='space-y-1'>
              {sampleData.skills.technical &&
                sampleData.skills.technical.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {sampleData.skills.technical
                      .slice(0, 6)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className='px-2 py-0.5 rounded text-xs'
                          style={{
                            backgroundColor: `${colors.accent}20`,
                            color: colors.accent,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
              {sampleData.skills.business &&
                sampleData.skills.business.length > 0 && (
                  <div className='flex flex-wrap gap-1'>
                    {sampleData.skills.business
                      .slice(0, 3)
                      .map((skill, index) => (
                        <span
                          key={index}
                          className='px-2 py-0.5 rounded text-xs'
                          style={{
                            backgroundColor: `${colors.primary}20`,
                            color: colors.primary,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Education */}
        {sampleData.education && sampleData.education.length > 0 && (
          <div>
            <h2
              className='font-semibold mb-2 border-b pb-1'
              style={{
                fontFamily: fonts.heading,
                fontSize: '12px',
                color: colors.primary,
                borderColor: colors.accent,
              }}
            >
              {layout.sections.find(s => s.type === 'education')?.title ||
                'Education'}
            </h2>
            <div className='space-y-2'>
              {sampleData.education.slice(0, 2).map((edu, index) => (
                <div
                  key={edu.id || index}
                  className='border-l-2 pl-2'
                  style={{ borderColor: colors.accent }}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3
                        className='font-semibold text-xs'
                        style={{ color: colors.text }}
                      >
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p
                        className='font-medium text-xs'
                        style={{ color: colors.primary }}
                      >
                        {edu.institution}
                      </p>
                    </div>
                    <span
                      className='text-xs'
                      style={{ color: colors.secondary }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {sampleData.projects && sampleData.projects.length > 0 && (
          <div>
            <h2
              className='font-semibold mb-2 border-b pb-1'
              style={{
                fontFamily: fonts.heading,
                fontSize: '12px',
                color: colors.primary,
                borderColor: colors.accent,
              }}
            >
              {layout.sections.find(s => s.type === 'projects')?.title ||
                'Projects'}
            </h2>
            <div className='space-y-2'>
              {sampleData.projects.slice(0, 2).map((project, index) => (
                <div
                  key={project.id || index}
                  className='border-l-2 pl-2'
                  style={{ borderColor: colors.accent }}
                >
                  <div className='flex justify-between items-start mb-1'>
                    <div>
                      <h3
                        className='font-semibold text-xs'
                        style={{ color: colors.text }}
                      >
                        {project.name}
                      </h3>
                    </div>
                    <span
                      className='text-xs'
                      style={{ color: colors.secondary }}
                    >
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  {project.description && (
                    <p className='text-xs mb-1' style={{ color: colors.text }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {project.technologies
                        .slice(0, 3)
                        .map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className='px-1.5 py-0.5 rounded text-xs'
                            style={{
                              backgroundColor: `${colors.secondary}20`,
                              color: colors.secondary,
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {sampleData.achievements && sampleData.achievements.length > 0 && (
          <div>
            <h2
              className='font-semibold mb-2 border-b pb-1'
              style={{
                fontFamily: fonts.heading,
                fontSize: '12px',
                color: colors.primary,
                borderColor: colors.accent,
              }}
            >
              {layout.sections.find(s => s.type === 'achievements')?.title ||
                'Achievements'}
            </h2>
            <ul className='text-xs space-y-0.5'>
              {sampleData.achievements.slice(0, 3).map((achievement, index) => (
                <li key={index} style={{ color: colors.text }}>
                  • {achievement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePreview;
