'use client';

import React from 'react';

import { ResumeData, ResumeTemplate } from '@/types/resume';

// Helper function to determine if a color is light or dark
const isLightColor = (color: string): boolean => {
  // Remove # if present
  const hex = color.replace('#', '');

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

// Helper function to get contrasting text color
const getContrastingTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? '#1f2937' : '#ffffff';
};

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

  // Helper function to get section-specific styles from custom styles
  const getSectionStyle = (
    sectionKey: string,
    property: string,
    fallback: string
  ) => {
    // Check if template has custom styles (added by floating customizer)
    const customStyles = (
      template as ResumeTemplate & {
        customStyles?: Record<string, Record<string, string>>;
      }
    ).customStyles;
    return customStyles?.[sectionKey]?.[property] || fallback;
  };

  const renderHeader = (sidebarBackground?: string) => (
    <div
      className='text-center mb-6 lg:mb-8'
      style={{
        color: getSectionStyle('header', 'color', colors.text),
        backgroundColor: getSectionStyle(
          'header',
          'backgroundColor',
          'transparent'
        ),
        padding: getSectionStyle('header', 'spacing', spacing.padding),
      }}
    >
      <h1
        className='font-bold mb-2 text-lg lg:text-2xl'
        style={{
          fontFamily: getSectionStyle('header', 'fontFamily', fonts.heading),
          fontSize: getSectionStyle('header', 'fontSize', fonts.size.heading),
          color: getContrastingTextColor(
            sidebarBackground ||
              getSectionStyle('header', 'backgroundColor', colors.background)
          ),
        }}
      >
        {data.personal.fullName}
      </h1>
      <div
        className='flex flex-col items-center gap-1 text-xs lg:text-sm'
        style={{
          color: getContrastingTextColor(
            sidebarBackground ||
              getSectionStyle('contact', 'backgroundColor', colors.background)
          ),
          backgroundColor: getSectionStyle(
            'contact',
            'backgroundColor',
            'transparent'
          ),
        }}
      >
        <a
          href={`mailto:${data.personal.email}`}
          className='hover:underline hover:text-blue-600 transition-colors'
          style={{
            color: getContrastingTextColor(
              sidebarBackground ||
                getSectionStyle('contact', 'backgroundColor', colors.background)
            ),
          }}
        >
          {data.personal.email}
        </a>
        {data.personal.phone && (
          <a
            href={`tel:${data.personal.phone}`}
            className='hover:underline hover:text-blue-600 transition-colors'
            style={{
              color: getContrastingTextColor(
                sidebarBackground ||
                  getSectionStyle(
                    'contact',
                    'backgroundColor',
                    colors.background
                  )
              ),
            }}
          >
            {data.personal.phone}
          </a>
        )}
        {data.personal.location && (
          <span
            style={{
              color: getContrastingTextColor(
                sidebarBackground ||
                  getSectionStyle(
                    'contact',
                    'backgroundColor',
                    colors.background
                  )
              ),
            }}
          >
            {data.personal.location}
          </span>
        )}
        {data.personal.linkedin && (
          <a
            href={
              data.personal.linkedin.startsWith('http')
                ? data.personal.linkedin
                : `https://linkedin.com/in/${data.personal.linkedin}`
            }
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline hover:text-blue-600 transition-colors'
            style={{
              color: getContrastingTextColor(
                sidebarBackground ||
                  getSectionStyle(
                    'contact',
                    'backgroundColor',
                    colors.background
                  )
              ),
            }}
          >
            {data.personal.linkedin.startsWith('http')
              ? data.personal.linkedin
              : `linkedin.com/in/${data.personal.linkedin}`}
          </a>
        )}
        {data.personal.github && (
          <a
            href={
              data.personal.github.startsWith('http')
                ? data.personal.github
                : `https://github.com/${data.personal.github}`
            }
            target='_blank'
            rel='noopener noreferrer'
            className='hover:underline hover:text-blue-600 transition-colors'
            style={{
              color: getContrastingTextColor(
                sidebarBackground ||
                  getSectionStyle(
                    'contact',
                    'backgroundColor',
                    colors.background
                  )
              ),
            }}
          >
            GitHub
          </a>
        )}
        {data.personal.portfolio && (
          <>
            <span
              className='mx-1'
              style={{
                color: getContrastingTextColor(
                  sidebarBackground ||
                    getSectionStyle(
                      'contact',
                      'backgroundColor',
                      colors.background
                    )
                ),
              }}
            >
              •
            </span>
            <a
              href={
                data.personal.portfolio.startsWith('http')
                  ? data.personal.portfolio
                  : `https://${data.personal.portfolio}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-blue-600 transition-colors'
              style={{
                color: getContrastingTextColor(
                  sidebarBackground ||
                    getSectionStyle(
                      'contact',
                      'backgroundColor',
                      colors.background
                    )
                ),
              }}
            >
              Portfolio
            </a>
          </>
        )}
      </div>
    </div>
  );

  const renderSummary = () => {
    if (!data.summary) return null;

    return (
      <div
        className='mb-4 lg:mb-6'
        style={{
          backgroundColor: getSectionStyle(
            'summary',
            'backgroundColor',
            'transparent'
          ),
          padding: getSectionStyle('summary', 'spacing', spacing.padding),
        }}
      >
        <h2
          className='font-semibold mb-2 lg:mb-3 border-b-2 pb-1 text-sm lg:text-base'
          style={{
            fontFamily: getSectionStyle(
              'headings',
              'fontFamily',
              fonts.heading
            ),
            fontSize: getSectionStyle(
              'headings',
              'fontSize',
              fonts.size.subheading
            ),
            color: getSectionStyle('headings', 'color', colors.primary),
            backgroundColor: getSectionStyle(
              'headings',
              'backgroundColor',
              'transparent'
            ),
            borderColor: colors.accent,
          }}
        >
          {layout.sections.find(s => s.type === 'summary')?.title ||
            'Professional Summary'}
        </h2>
        <p
          className='leading-relaxed text-sm lg:text-base'
          style={{
            fontFamily: getSectionStyle('body', 'fontFamily', fonts.body),
            fontSize: getSectionStyle('body', 'fontSize', fonts.size.body),
            color: getSectionStyle('body', 'color', colors.text),
            backgroundColor: getSectionStyle(
              'body',
              'backgroundColor',
              'transparent'
            ),
            lineHeight: spacing.lineHeight,
          }}
        >
          {data.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => (
    <div className='mb-4 lg:mb-6'>
      <h2
        className='font-semibold mb-3 lg:mb-4 border-b-2 pb-1 text-sm lg:text-base'
        style={{
          fontFamily: fonts.heading,
          fontSize: fonts.size.subheading,
          color: colors.primary,
          borderColor: colors.accent,
        }}
      >
        {layout.sections.find(s => s.type === 'experience')?.title ||
          'Professional Experience'}
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

  const renderEducation = (sidebarBackground?: string) => (
    <div className='mb-6'>
      <h2
        className='font-semibold mb-4 border-b-2 pb-1'
        style={{
          fontFamily: fonts.heading,
          fontSize: fonts.size.subheading,
          color: getContrastingTextColor(
            sidebarBackground || colors.background
          ),
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
                    color: getContrastingTextColor(
                      sidebarBackground || colors.background
                    ),
                  }}
                >
                  {edu.degree} in {edu.field}
                </h3>
                <p
                  className='font-medium'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.body,
                    color: getContrastingTextColor(
                      sidebarBackground || colors.background
                    ),
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
                      color: getContrastingTextColor(
                        sidebarBackground || colors.background
                      ),
                    }}
                  >
                    GPA: {edu.gpa}
                  </p>
                )}
              </div>
              <div
                className='text-sm mt-1 md:mt-0 md:text-right'
                style={{
                  fontFamily: fonts.body,
                  fontSize: fonts.size.small,
                  color: getContrastingTextColor(
                    sidebarBackground || colors.background
                  ),
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

  const renderSkills = (sidebarBackground?: string) => (
    <div
      className='mb-6'
      style={{
        backgroundColor: getSectionStyle(
          'skills',
          'backgroundColor',
          'transparent'
        ),
        padding: getSectionStyle('skills', 'spacing', spacing.padding),
      }}
    >
      <h2
        className='font-semibold mb-4 border-b-2 pb-1'
        style={{
          fontFamily: getSectionStyle('headings', 'fontFamily', fonts.heading),
          fontSize: getSectionStyle(
            'headings',
            'fontSize',
            fonts.size.subheading
          ),
          color: getContrastingTextColor(
            sidebarBackground ||
              getSectionStyle('headings', 'backgroundColor', colors.background)
          ),
          backgroundColor: getSectionStyle(
            'headings',
            'backgroundColor',
            'transparent'
          ),
          borderColor: colors.accent,
        }}
      >
        Skills
      </h2>
      <div className='space-y-4'>
        {data.skills.technical.length > 0 && (
          <div>
            <h3
              className='font-medium mb-2'
              style={{
                fontFamily: getSectionStyle(
                  'skills',
                  'fontFamily',
                  fonts.heading
                ),
                fontSize: getSectionStyle(
                  'skills',
                  'fontSize',
                  fonts.size.body
                ),
                color: getContrastingTextColor(
                  sidebarBackground || colors.background
                ),
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
                    backgroundColor: getSectionStyle(
                      'skillsTags',
                      'backgroundColor',
                      `${colors.accent}20`
                    ),
                    color: getContrastingTextColor(
                      getSectionStyle(
                        'skillsTags',
                        'backgroundColor',
                        `${colors.accent}20`
                      )
                    ),
                    fontFamily: getSectionStyle(
                      'skillsTags',
                      'fontFamily',
                      fonts.body
                    ),
                    fontSize: getSectionStyle(
                      'skillsTags',
                      'fontSize',
                      fonts.size.small
                    ),
                  }}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
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
                color: getContrastingTextColor(
                  sidebarBackground || colors.background
                ),
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
                    color: getContrastingTextColor(`${colors.primary}20`),
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                  }}
                >
                  {skill.charAt(0).toUpperCase() + skill.slice(1)}
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
        minHeight: '100vh',
        // margin removed - controlled by export functions
      }}
    >
      {layout.columns === 2 && layout.sidebar ? (
        // Two-column layout with sidebar - responsive
        <div className='flex flex-col lg:flex-row gap-4 lg:gap-6'>
          {/* Sidebar */}
          <div
            className='w-full lg:w-1/3 p-4 lg:p-6 rounded-lg'
            style={{
              backgroundColor: colors.sidebar || colors.primary,
              color: colors.sidebarText || '#ffffff',
            }}
          >
            {renderHeader(colors.sidebar || colors.primary)}
            {renderSkills(colors.sidebar || colors.primary)}
            {renderEducation(colors.sidebar || colors.primary)}
          </div>

          {/* Main Content */}
          <div className='flex-1 space-y-4 lg:space-y-6'>
            {renderSummary()}
            {renderExperience()}
            {renderProjects()}
            {renderAchievements()}
          </div>
        </div>
      ) : (
        // Single column layout
        <div className='space-y-4 lg:space-y-6'>
          {renderHeader()}
          {renderSummary()}
          {renderExperience()}
          {renderProjects()}
          {renderSkills()}
          {renderEducation()}
          {renderAchievements()}
        </div>
      )}
    </div>
  );
};

export default ResumeTemplateRenderer;
