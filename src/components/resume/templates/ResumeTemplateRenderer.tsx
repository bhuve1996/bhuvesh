'use client';

import React from 'react';

import { ResumeData, ResumeTemplate } from '@/types/resume';

interface ResumeTemplateRendererProps {
  template: ResumeTemplate;
  data: ResumeData;
  className?: string;
}

export const ResumeTemplateRenderer: React.FC<ResumeTemplateRendererProps> = ({
  template,
  data,
  className = '',
}) => {
  const { layout } = template;
  const { colors, fonts, spacing } = layout;

  const renderHeader = () => (
    <div className='text-center mb-8' style={{ color: colors.text }}>
      <h1
        className='font-bold mb-2'
        style={{
          fontFamily: fonts.heading,
          fontSize: fonts.size.heading,
          color: colors.primary,
        }}
      >
        {data.personal.fullName}
      </h1>
      <div
        className='flex flex-wrap justify-center gap-4 text-sm'
        style={{ color: colors.secondary }}
      >
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        <span>•</span>
        <span>{data.personal.location}</span>
        {data.personal.linkedin && (
          <>
            <span>•</span>
            <span>{data.personal.linkedin}</span>
          </>
        )}
        {data.personal.github && (
          <>
            <span>•</span>
            <span>{data.personal.github}</span>
          </>
        )}
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!data.summary) return null;

    return (
      <div className='mb-6'>
        <h2
          className='font-semibold mb-3 border-b-2 pb-1'
          style={{
            fontFamily: fonts.heading,
            fontSize: fonts.size.subheading,
            color: colors.primary,
            borderColor: colors.accent,
          }}
        >
          Professional Summary
        </h2>
        <p
          className='leading-relaxed'
          style={{
            fontFamily: fonts.body,
            fontSize: fonts.size.body,
            color: colors.text,
            lineHeight: spacing.lineHeight,
          }}
        >
          {data.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => (
    <div className='mb-6'>
      <h2
        className='font-semibold mb-4 border-b-2 pb-1'
        style={{
          fontFamily: fonts.heading,
          fontSize: fonts.size.subheading,
          color: colors.primary,
          borderColor: colors.accent,
        }}
      >
        Professional Experience
      </h2>
      <div className='space-y-4'>
        {data.experience.map(exp => (
          <div
            key={exp.id}
            className='border-l-4 pl-4'
            style={{ borderColor: colors.accent }}
          >
            <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-2'>
              <div>
                <h3
                  className='font-semibold'
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: fonts.size.body,
                    color: colors.text,
                  }}
                >
                  {exp.position}
                </h3>
                <p
                  className='font-medium'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.body,
                    color: colors.primary,
                  }}
                >
                  {exp.company}
                </p>
              </div>
              <div
                className='text-sm mt-1 md:mt-0'
                style={{
                  fontFamily: fonts.body,
                  fontSize: fonts.size.small,
                  color: colors.secondary,
                }}
              >
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </div>
            </div>
            <p
              className='mb-2'
              style={{
                fontFamily: fonts.body,
                fontSize: fonts.size.body,
                color: colors.text,
              }}
            >
              {exp.description}
            </p>
            {exp.achievements.length > 0 && (
              <ul className='list-disc list-inside space-y-1'>
                {exp.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    style={{
                      fontFamily: fonts.body,
                      fontSize: fonts.size.body,
                      color: colors.text,
                    }}
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className='mb-6'>
      <h2
        className='font-semibold mb-4 border-b-2 pb-1'
        style={{
          fontFamily: fonts.heading,
          fontSize: fonts.size.subheading,
          color: colors.primary,
          borderColor: colors.accent,
        }}
      >
        Education
      </h2>
      <div className='space-y-3'>
        {data.education.map(edu => (
          <div
            key={edu.id}
            className='border-l-4 pl-4'
            style={{ borderColor: colors.accent }}
          >
            <div className='flex flex-col md:flex-row md:justify-between md:items-start'>
              <div>
                <h3
                  className='font-semibold'
                  style={{
                    fontFamily: fonts.heading,
                    fontSize: fonts.size.body,
                    color: colors.text,
                  }}
                >
                  {edu.degree} in {edu.field}
                </h3>
                <p
                  className='font-medium'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.body,
                    color: colors.primary,
                  }}
                >
                  {edu.institution}
                </p>
                {edu.gpa && (
                  <p
                    className='text-sm'
                    style={{
                      fontFamily: fonts.body,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
              <div
                className='text-sm mt-1 md:mt-0'
                style={{
                  fontFamily: fonts.body,
                  fontSize: fonts.size.small,
                  color: colors.secondary,
                }}
              >
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className='mb-6'>
      <h2
        className='font-semibold mb-4 border-b-2 pb-1'
        style={{
          fontFamily: fonts.heading,
          fontSize: fonts.size.subheading,
          color: colors.primary,
          borderColor: colors.accent,
        }}
      >
        Skills
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {data.skills.technical.length > 0 && (
          <div>
            <h3
              className='font-medium mb-2'
              style={{
                fontFamily: fonts.heading,
                fontSize: fonts.size.body,
                color: colors.text,
              }}
            >
              Technical Skills
            </h3>
            <div className='flex flex-wrap gap-2'>
              {data.skills.technical.map((skill, index) => (
                <span
                  key={index}
                  className='px-3 py-1 rounded-full text-sm'
                  style={{
                    backgroundColor: `${colors.accent}20`,
                    color: colors.accent,
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.skills.business.length > 0 && (
          <div>
            <h3
              className='font-medium mb-2'
              style={{
                fontFamily: fonts.heading,
                fontSize: fonts.size.body,
                color: colors.text,
              }}
            >
              Business Skills
            </h3>
            <div className='flex flex-wrap gap-2'>
              {data.skills.business.map((skill, index) => (
                <span
                  key={index}
                  className='px-3 py-1 rounded-full text-sm'
                  style={{
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;

    return (
      <div className='mb-6'>
        <h2
          className='font-semibold mb-4 border-b-2 pb-1'
          style={{
            fontFamily: fonts.heading,
            fontSize: fonts.size.subheading,
            color: colors.primary,
            borderColor: colors.accent,
          }}
        >
          Projects
        </h2>
        <div className='space-y-4'>
          {data.projects.map(project => (
            <div
              key={project.id}
              className='border-l-4 pl-4'
              style={{ borderColor: colors.accent }}
            >
              <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-2'>
                <div>
                  <h3
                    className='font-semibold'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.body,
                      color: colors.text,
                    }}
                  >
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className='text-sm underline'
                      style={{
                        fontFamily: fonts.body,
                        fontSize: fonts.size.small,
                        color: colors.accent,
                      }}
                    >
                      {project.url}
                    </a>
                  )}
                </div>
                <div
                  className='text-sm mt-1 md:mt-0'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                    color: colors.secondary,
                  }}
                >
                  {project.startDate} - {project.endDate || 'Present'}
                </div>
              </div>
              <p
                className='mb-2'
                style={{
                  fontFamily: fonts.body,
                  fontSize: fonts.size.body,
                  color: colors.text,
                }}
              >
                {project.description}
              </p>
              {project.technologies.length > 0 && (
                <div className='flex flex-wrap gap-1'>
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className='px-2 py-1 rounded text-xs'
                      style={{
                        backgroundColor: `${colors.secondary}20`,
                        color: colors.secondary,
                        fontFamily: fonts.body,
                        fontSize: fonts.size.small,
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
    );
  };

  const renderAchievements = () => {
    if (!data.achievements || data.achievements.length === 0) return null;

    return (
      <div className='mb-6'>
        <h2
          className='font-semibold mb-4 border-b-2 pb-1'
          style={{
            fontFamily: fonts.heading,
            fontSize: fonts.size.subheading,
            color: colors.primary,
            borderColor: colors.accent,
          }}
        >
          Achievements
        </h2>
        <ul className='list-disc list-inside space-y-1'>
          {data.achievements.map((achievement, index) => (
            <li
              key={index}
              style={{
                fontFamily: fonts.body,
                fontSize: fonts.size.body,
                color: colors.text,
              }}
            >
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div
      className={`resume-template ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body,
        fontSize: fonts.size.body,
        lineHeight: spacing.lineHeight,
        padding: spacing.padding,
        margin: spacing.margins,
      }}
    >
      {renderHeader()}
      {renderSummary()}
      {renderExperience()}
      {renderProjects()}
      {renderSkills()}
      {renderEducation()}
      {renderAchievements()}
    </div>
  );
};

export default ResumeTemplateRenderer;
