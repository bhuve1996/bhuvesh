'use client';

import React from 'react';

import { useResumeStore } from '@/store/resumeStore';
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
  // Get customizations from global state - this will cause re-render when state changes
  const templateCustomizations = useResumeStore(
    state => state.templateCustomizations
  );

  const { layout } = template;
  const { colors, fonts, spacing } = layout;

  // Apply customizations to the template
  const customizedLayout = {
    ...layout,
    columns: templateCustomizations.layout.columns,
    sidebar: templateCustomizations.layout.sidebar,
    colors: {
      ...colors,
      primary: templateCustomizations.colors.primaryColor,
      secondary: templateCustomizations.colors.secondaryColor,
      accent: templateCustomizations.colors.accentColor,
      text: templateCustomizations.colors.textColor,
      background: templateCustomizations.colors.backgroundColor,
    },
    spacing: {
      ...spacing,
      lineHeight: templateCustomizations.typography.lineHeight,
      sectionGap: templateCustomizations.spacing.sectionGap,
      padding: templateCustomizations.spacing.padding,
      margins: templateCustomizations.layout.margins,
    },
  };

  const customizedFonts = {
    ...fonts,
    body: templateCustomizations.typography.fontFamily,
    heading: templateCustomizations.typography.fontFamily,
    size: {
      ...fonts.size,
      body: `${templateCustomizations.typography.fontSize}px`,
      heading: `${templateCustomizations.typography.fontSize}px`,
      subheading: `${templateCustomizations.typography.fontSize}px`,
      small: `${templateCustomizations.typography.fontSize}px`,
    },
  };

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

  // Helper function to get customized colors
  const getCustomizedColors = () => customizedLayout.colors;

  // Helper function to get customized fonts
  const getCustomizedFonts = () => customizedFonts;

  // Helper function to get customized spacing
  const getCustomizedSpacing = () => customizedLayout.spacing;

  // Helper function to check if a section is visible
  const isSectionVisible = (sectionId: string): boolean => {
    const section = template.sections?.find(s => s.id === sectionId);
    return section?.visible !== false; // Default to visible if not specified
  };

  const renderHeader = (sidebarBackground?: string) => {
    if (!isSectionVisible('header')) return null;

    return (
      <div
        className='text-center mb-6 lg:mb-8'
        style={{
          color: getSectionStyle(
            'header',
            'color',
            customizedLayout.colors.text
          ),
          backgroundColor: getSectionStyle(
            'header',
            'backgroundColor',
            'transparent'
          ),
          padding: getSectionStyle(
            'header',
            'spacing',
            customizedLayout.spacing.padding
          ),
        }}
      >
        <div className='mb-3 lg:mb-4'>
          <h1
            className={`font-bold mb-1 ${
              sidebarBackground ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl'
            }`}
            style={{
              fontFamily: getSectionStyle(
                'header',
                'fontFamily',
                customizedFonts.heading
              ),
              fontSize: getSectionStyle(
                'header',
                'fontSize',
                sidebarBackground ? '18px' : customizedFonts.size.heading
              ),
              color: getContrastingTextColor(
                sidebarBackground ||
                  getSectionStyle(
                    'header',
                    'backgroundColor',
                    customizedLayout.colors.background
                  )
              ),
            }}
          >
            {data.personal.fullName}
          </h1>
          {/* Current Position */}
          {(data.personal.jobTitle ||
            (data.experience.length > 0 && data.experience[0]?.position)) && (
            <h2
              className={`font-semibold ${
                sidebarBackground
                  ? 'text-base lg:text-lg'
                  : 'text-lg lg:text-xl'
              } text-slate-600 dark:text-slate-300`}
              style={{
                fontFamily: getSectionStyle(
                  'header',
                  'fontFamily',
                  customizedFonts.heading
                ),
                fontSize: getSectionStyle(
                  'header',
                  'fontSize',
                  sidebarBackground ? '16px' : customizedFonts.size.subheading
                ),
                color: getContrastingTextColor(
                  sidebarBackground ||
                    getSectionStyle(
                      'header',
                      'backgroundColor',
                      customizedLayout.colors.background
                    )
                ),
              }}
            >
              {data.personal.jobTitle ||
                (data.experience.length > 0
                  ? data.experience[0]?.position
                  : '')}
            </h2>
          )}
        </div>
        {/* Contact Information - Single column layout for sidebar */}
        <div
          className={`${
            sidebarBackground
              ? 'flex flex-col gap-2' // Single column in sidebar
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2' // 3 columns in main layout
          } text-sm`}
          style={{
            color: getContrastingTextColor(
              sidebarBackground ||
                getSectionStyle(
                  'contact',
                  'backgroundColor',
                  customizedLayout.colors.background
                )
            ),
            backgroundColor: getSectionStyle(
              'contact',
              'backgroundColor',
              'transparent'
            ),
          }}
        >
          {/* Email */}
          <a
            href={`mailto:${data.personal.email}`}
            className='hover:underline hover:text-blue-600 transition-colors flex items-center gap-2'
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
            <span className='text-sm'>📧</span>
            <span className='break-all'>{data.personal.email}</span>
          </a>

          {/* Phone */}
          {data.personal.phone && (
            <a
              href={`tel:${data.personal.phone}`}
              className='hover:underline hover:text-blue-600 transition-colors flex items-center gap-2'
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
              <span className='text-sm'>📱</span>
              <span className='break-all'>{data.personal.phone}</span>
            </a>
          )}

          {/* Location */}
          {data.personal.location && (
            <span
              className='flex items-center gap-2'
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
              <span className='text-sm'>📍</span>
              <span className='break-words'>{data.personal.location}</span>
            </span>
          )}

          {/* Portfolio */}
          {data.personal.portfolio && (
            <a
              href={
                data.personal.portfolio.startsWith('http')
                  ? data.personal.portfolio
                  : `https://${data.personal.portfolio}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-blue-600 transition-colors flex items-center gap-2'
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
              <span className='text-sm'>🌐</span>
              <span className='break-all'>Portfolio</span>
            </a>
          )}

          {/* LinkedIn */}
          {data.personal.linkedin && (
            <a
              href={
                data.personal.linkedin.startsWith('http')
                  ? data.personal.linkedin
                  : `https://linkedin.com/in/${data.personal.linkedin}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-blue-600 transition-colors flex items-center gap-2'
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
              <span className='text-sm'>💼</span>
              <span className='break-all'>LinkedIn</span>
            </a>
          )}

          {/* GitHub */}
          {data.personal.github && (
            <a
              href={
                data.personal.github.startsWith('http')
                  ? data.personal.github
                  : `https://github.com/${data.personal.github}`
              }
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-blue-600 transition-colors flex items-center gap-2'
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
              <span className='text-sm'>💻</span>
              <span className='break-all'>GitHub</span>
            </a>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    if (!data.summary || !isSectionVisible('summary')) return null;

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
              customizedFonts.heading
            ),
            fontSize: getSectionStyle(
              'headings',
              'fontSize',
              customizedFonts.size.subheading
            ),
            color: getSectionStyle(
              'headings',
              'color',
              customizedLayout.colors.primary
            ),
            backgroundColor: getSectionStyle(
              'headings',
              'backgroundColor',
              'transparent'
            ),
            borderColor: customizedLayout.colors.accent,
          }}
        >
          {layout.sections.find(s => s.type === 'summary')?.title ||
            'Professional Summary'}
        </h2>
        <p
          className='leading-relaxed text-sm lg:text-base'
          style={{
            fontFamily: getSectionStyle(
              'body',
              'fontFamily',
              customizedFonts.body
            ),
            fontSize: getSectionStyle(
              'body',
              'fontSize',
              customizedFonts.size.body
            ),
            color: getSectionStyle(
              'body',
              'color',
              customizedLayout.colors.text
            ),
            backgroundColor: getSectionStyle(
              'body',
              'backgroundColor',
              'transparent'
            ),
            lineHeight: customizedLayout.spacing.lineHeight,
          }}
        >
          {data.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!isSectionVisible('experience')) return null;

    const colors = getCustomizedColors();
    const fonts = getCustomizedFonts();

    return (
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
        <div className='space-y-6'>
          {data.experience.map(exp => (
            <div
              key={exp.id}
              className='bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent rounded-lg p-4 border-l-4 hover:shadow-md transition-all duration-300'
              style={{ borderColor: colors.accent }}
            >
              {/* Header Section */}
              <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start mb-3'>
                <div className='flex-1'>
                  <h3
                    className='font-bold text-lg mb-1'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.subheading,
                      color: colors.text,
                    }}
                  >
                    {exp.position}
                  </h3>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2'>
                    <p
                      className='font-semibold text-base'
                      style={{
                        fontFamily: fonts.body,
                        fontSize: fonts.size.body,
                        color: colors.primary,
                      }}
                    >
                      {exp.company}
                    </p>
                    {exp.location && (
                      <>
                        <span className='hidden sm:inline text-slate-400'>
                          •
                        </span>
                        <span
                          className='text-sm'
                          style={{
                            fontFamily: fonts.body,
                            fontSize: fonts.size.small,
                            color: colors.secondary,
                          }}
                        >
                          {exp.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className='mt-2 lg:mt-0 lg:ml-4 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-sm font-medium'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                    color: colors.secondary,
                  }}
                >
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>

              {/* Description */}
              {exp.description && (
                <p
                  className='mb-3 text-slate-700 dark:text-slate-300 leading-relaxed'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.body,
                    color: colors.text,
                  }}
                >
                  {exp.description}
                </p>
              )}

              {/* AI-Restructured Content */}
              {exp.achievements && exp.achievements.length > 0 && (
                <div className='mt-3'>
                  <h4
                    className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    Key Achievements:
                  </h4>
                  <ul className='space-y-2'>
                    {exp.achievements.map((achievement, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-2'
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fonts.size.body,
                          color: colors.text,
                        }}
                      >
                        <span
                          className='mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0'
                          style={{ backgroundColor: colors.accent }}
                        ></span>
                        <span className='leading-relaxed'>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Technologies */}
              {exp.keyTechnologies && exp.keyTechnologies.length > 0 && (
                <div className='mt-3'>
                  <h4
                    className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    Technologies Used:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {exp.keyTechnologies.map((tech, index) => (
                      <span
                        key={index}
                        className='px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fonts.size.small,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact Metrics */}
              {exp.impactMetrics && exp.impactMetrics.length > 0 && (
                <div className='mt-3'>
                  <h4
                    className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    Impact & Results:
                  </h4>
                  <ul className='space-y-1'>
                    {exp.impactMetrics.map((metric, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-2 text-sm'
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fonts.size.small,
                          color: colors.text,
                        }}
                      >
                        <span className='text-green-600 dark:text-green-400'>
                          ✓
                        </span>
                        <span className='leading-relaxed'>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = (sidebarBackground?: string) => {
    if (!isSectionVisible('education')) return null;

    const colors = getCustomizedColors();
    const fonts = getCustomizedFonts();

    return (
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
                  className={`text-sm mt-1 ${sidebarBackground ? 'text-left' : 'md:mt-0 md:text-right'}`}
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                    color: getContrastingTextColor(
                      sidebarBackground || colors.background
                    ),
                  }}
                >
                  {edu.startDate && edu.endDate
                    ? `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`
                    : edu.startDate
                      ? edu.startDate
                      : edu.endDate
                        ? edu.endDate
                        : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = (sidebarBackground?: string) => {
    if (!isSectionVisible('skills')) return null;

    const colors = getCustomizedColors();
    const fonts = getCustomizedFonts();
    const spacing = getCustomizedSpacing();

    return (
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
            color: getContrastingTextColor(
              sidebarBackground ||
                getSectionStyle(
                  'headings',
                  'backgroundColor',
                  colors.background
                )
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
        <div
          className={`${sidebarBackground ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}`}
        >
          {data.skills.technical.length > 0 && (
            <div
              className={`${sidebarBackground ? 'bg-transparent' : 'bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/20 dark:to-transparent rounded-lg p-4'}`}
            >
              <h3
                className={`font-semibold mb-3 ${sidebarBackground ? 'text-white' : 'text-green-800 dark:text-green-200'} flex items-center gap-2`}
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
                }}
              >
                <span>💻</span>
                Technical Skills
              </h3>
              <div className='flex flex-wrap gap-2'>
                {data.skills.technical.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sidebarBackground
                        ? 'bg-white/20 text-white'
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    }`}
                    style={{
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
            <div
              className={`${sidebarBackground ? 'bg-transparent' : 'bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent rounded-lg p-4'}`}
            >
              <h3
                className={`font-semibold mb-3 ${sidebarBackground ? 'text-white' : 'text-purple-800 dark:text-purple-200'} flex items-center gap-2`}
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
                }}
              >
                <span>💼</span>
                Business Skills
              </h3>
              <div className='flex flex-wrap gap-2'>
                {data.skills.business.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      sidebarBackground
                        ? 'bg-white/20 text-white'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                    }`}
                    style={{
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
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (
      !data.projects ||
      data.projects.length === 0 ||
      !isSectionVisible('projects')
    )
      return null;

    const colors = getCustomizedColors();
    const fonts = getCustomizedFonts();

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
        <div className='space-y-6'>
          {data.projects.map(project => (
            <div
              key={project.id}
              className='bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-lg p-4 border-l-4 hover:shadow-md transition-all duration-300'
              style={{ borderColor: colors.accent }}
            >
              {/* Header Section */}
              <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start mb-3'>
                <div className='flex-1'>
                  <h3
                    className='font-bold text-lg mb-1'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.subheading,
                      color: colors.text,
                    }}
                  >
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-1 text-sm font-medium hover:underline'
                      style={{
                        fontFamily: fonts.body,
                        fontSize: fonts.size.small,
                        color: colors.accent,
                      }}
                    >
                      <span>🌐</span>
                      View Project
                    </a>
                  )}
                </div>
                <div
                  className='mt-2 lg:mt-0 lg:ml-4 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-medium'
                  style={{
                    fontFamily: fonts.body,
                    fontSize: fonts.size.small,
                    color: colors.secondary,
                  }}
                >
                  {project.startDate} - {project.endDate || 'Present'}
                </div>
              </div>

              {/* Description */}
              <p
                className='mb-4 text-slate-700 dark:text-slate-300 leading-relaxed'
                style={{
                  fontFamily: fonts.body,
                  fontSize: fonts.size.body,
                  color: colors.text,
                }}
              >
                {project.description}
              </p>

              {/* Key Features */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className='mt-3'>
                  <h4
                    className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    Key Features:
                  </h4>
                  <ul className='space-y-1'>
                    {project.keyFeatures.map((feature, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-2 text-sm'
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fonts.size.small,
                          color: colors.text,
                        }}
                      >
                        <span className='text-blue-600 dark:text-blue-400'>
                          •
                        </span>
                        <span className='leading-relaxed'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {project.technologies.length > 0 && (
                <div className='mt-3'>
                  <h4
                    className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    Technologies Used:
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fonts.size.small,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact */}
              {project.impact && project.impact.length > 0 && (
                <div className='mt-3'>
                  <h4
                    className='text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400'
                    style={{
                      fontFamily: fonts.heading,
                      fontSize: fonts.size.small,
                      color: colors.secondary,
                    }}
                  >
                    Impact & Results:
                  </h4>
                  <ul className='space-y-1'>
                    {project.impact.map((impact, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-2 text-sm'
                        style={{
                          fontFamily: fonts.body,
                          fontSize: fonts.size.small,
                          color: colors.text,
                        }}
                      >
                        <span className='text-green-600 dark:text-green-400'>
                          ✓
                        </span>
                        <span className='leading-relaxed'>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (
      !data.achievements ||
      data.achievements.length === 0 ||
      !isSectionVisible('achievements')
    )
      return null;

    const colors = getCustomizedColors();
    const fonts = getCustomizedFonts();

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
        backgroundColor: customizedLayout.colors.background,
        color: customizedLayout.colors.text,
        fontFamily: customizedFonts.body,
        fontSize: customizedFonts.size.body,
        lineHeight: customizedLayout.spacing.lineHeight,
        padding: customizedLayout.spacing.padding,
        minHeight: '100vh',
        // margin removed - controlled by export functions
      }}
    >
      {customizedLayout.columns === 2 && customizedLayout.sidebar ? (
        // Two-column layout with sidebar - responsive
        <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
          {/* Sidebar */}
          <div
            className='w-full lg:w-2/5 p-6 lg:p-8 rounded-lg space-y-6'
            style={{
              backgroundColor:
                customizedLayout.colors.sidebar ||
                customizedLayout.colors.primary,
              color: customizedLayout.colors.sidebarText || '#ffffff',
              minHeight: 'fit-content',
            }}
          >
            {renderHeader(
              customizedLayout.colors.sidebar || customizedLayout.colors.primary
            )}
            {renderSkills(
              customizedLayout.colors.sidebar || customizedLayout.colors.primary
            )}
            {renderEducation(
              customizedLayout.colors.sidebar || customizedLayout.colors.primary
            )}
          </div>

          {/* Main Content */}
          <div className='flex-1 space-y-6 lg:space-y-8 pl-0 lg:pl-4'>
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
