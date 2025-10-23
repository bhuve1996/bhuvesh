'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { ResumeData, ResumeTemplate } from '@/types/resume';

interface ImprovedPaginatedTemplatePreviewProps {
  template: ResumeTemplate;
  data: ResumeData;
  className?: string;
  maxHeight?: string;
}

interface PageContent {
  id: string;
  title: string;
  content: React.ReactNode;
  suggestions: string[];
}

export const ImprovedPaginatedTemplatePreview: React.FC<
  ImprovedPaginatedTemplatePreviewProps
> = ({ template, data, className = '', maxHeight = '500px' }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentPage < 10) {
        setCurrentPage(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  if (!template || !template.layout || !data) {
    return (
      <div
        className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
      >
        <div className='p-4 text-center text-gray-500'>No data available</div>
      </div>
    );
  }

  const { colors, fonts } = template.layout;

  // Create pages with improved layout and suggestions
  const createPages = (): PageContent[] => {
    const pages: PageContent[] = [];

    // Page 1: Header + Summary
    pages.push({
      id: 'header-summary',
      title: 'Header & Summary',
      suggestions: [
        'Ensure contact information is complete and professional',
        'Keep summary concise (2-3 sentences)',
        'Use action verbs and quantifiable achievements',
        'Include relevant keywords from job descriptions',
      ],
      content: (
        <div className='space-y-6'>
          {/* Header */}
          <div
            className='text-center p-4 border-b-2'
            style={{
              borderColor: `${colors.accent}40`,
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
            }}
          >
            <h1
              className='font-bold mb-3'
              style={{
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '18px',
                color: colors.primary,
                fontWeight: '700',
                letterSpacing: '0.5px',
              }}
            >
              {data.personal?.fullName || 'John Doe'}
            </h1>
            <div
              className='flex flex-wrap justify-center gap-3 text-xs'
              style={{
                color: colors.secondary,
                fontFamily: '"Roboto", "Helvetica", sans-serif',
              }}
            >
              <a
                href={`mailto:${data.personal?.email || 'john.doe@email.com'}`}
                className='hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50'
                style={{ color: colors.secondary }}
              >
                {data.personal?.email || 'john.doe@email.com'}
              </a>
              {data.personal?.phone && (
                <>
                  <span className='text-gray-400'>•</span>
                  <a
                    href={`tel:${data.personal.phone}`}
                    className='hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50'
                    style={{ color: colors.secondary }}
                  >
                    {data.personal.phone}
                  </a>
                </>
              )}
              {data.personal?.location && (
                <>
                  <span className='text-gray-400'>•</span>
                  <span className='px-2 py-1'>{data.personal.location}</span>
                </>
              )}
              {data.personal?.linkedin && (
                <>
                  <span className='text-gray-400'>•</span>
                  <a
                    href={
                      data.personal.linkedin.startsWith('http')
                        ? data.personal.linkedin
                        : `https://linkedin.com/in/${data.personal.linkedin}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50'
                    style={{ color: colors.secondary }}
                  >
                    LinkedIn
                  </a>
                </>
              )}
              {data.personal?.github && (
                <>
                  <span className='text-gray-400'>•</span>
                  <a
                    href={
                      data.personal.github.startsWith('http')
                        ? data.personal.github
                        : `https://github.com/${data.personal.github}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50'
                    style={{ color: colors.secondary }}
                  >
                    GitHub
                  </a>
                </>
              )}
              {data.personal?.portfolio && (
                <>
                  <span className='text-gray-400'>•</span>
                  <a
                    href={
                      data.personal.portfolio.startsWith('http')
                        ? data.personal.portfolio
                        : `https://${data.personal.portfolio}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-blue-50'
                    style={{ color: colors.secondary }}
                  >
                    Portfolio
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Summary */}
          {data.summary && (
            <div className='space-y-3'>
              <h2
                className='font-semibold mb-3 border-b-2 pb-2'
                style={{
                  fontFamily: '"Inter", "Segoe UI", sans-serif',
                  fontSize: '14px',
                  color: colors.primary,
                  borderColor: colors.accent,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {template.layout.sections.find(s => s.type === 'summary')
                  ?.title || 'Professional Summary'}
              </h2>
              <p
                className='text-sm leading-relaxed'
                style={{
                  color: colors.text,
                  fontFamily: '"Roboto", "Helvetica", sans-serif',
                  lineHeight: '1.6',
                }}
              >
                {data.summary}
              </p>
            </div>
          )}
        </div>
      ),
    });

    // Page 2: Experience
    if (data.experience && data.experience.length > 0) {
      pages.push({
        id: 'experience',
        title: 'Work Experience',
        suggestions: [
          'Use action verbs to start each bullet point',
          'Include quantifiable achievements and metrics',
          'Focus on results and impact, not just responsibilities',
          'Use consistent formatting and tense (past tense for previous roles)',
        ],
        content: (
          <div className='space-y-4'>
            <h2
              className='font-semibold mb-4 border-b-2 pb-2'
              style={{
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '14px',
                color: colors.primary,
                borderColor: colors.accent,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {template.layout.sections.find(s => s.type === 'experience')
                ?.title || 'Work Experience'}
            </h2>
            <div className='space-y-4'>
              {data.experience.slice(0, 2).map((exp, index) => (
                <div
                  key={exp.id || index}
                  className='border-l-4 pl-4 py-2'
                  style={{ borderColor: colors.accent }}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3
                        className='font-semibold text-sm'
                        style={{
                          color: colors.text,
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: '600',
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        className='font-medium text-sm'
                        style={{
                          color: colors.primary,
                          fontFamily: '"Roboto", sans-serif',
                        }}
                      >
                        {exp.company}
                      </p>
                    </div>
                    <span
                      className='text-xs'
                      style={{
                        color: colors.secondary,
                        fontFamily: '"Roboto", sans-serif',
                      }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p
                      className='text-xs mb-2'
                      style={{
                        color: colors.text,
                        fontFamily: '"Roboto", sans-serif',
                        lineHeight: '1.5',
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className='text-xs space-y-1'>
                      {exp.achievements
                        .slice(0, 2)
                        .map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            style={{
                              color: colors.text,
                              fontFamily: '"Roboto", sans-serif',
                            }}
                          >
                            • {achievement}
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // Page 3: Skills
    if (data.skills) {
      pages.push({
        id: 'skills',
        title: 'Skills & Expertise',
        suggestions: [
          'Group skills by category (Technical, Business, Soft)',
          'Include relevant keywords from job postings',
          'Be specific about proficiency levels when appropriate',
          'Keep skills current and relevant to your target role',
        ],
        content: (
          <div className='space-y-4'>
            <h2
              className='font-semibold mb-4 border-b-2 pb-2'
              style={{
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '14px',
                color: colors.primary,
                borderColor: colors.accent,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {template.layout.sections.find(s => s.type === 'skills')?.title ||
                'Skills & Expertise'}
            </h2>
            <div className='space-y-4'>
              {data.skills.technical && data.skills.technical.length > 0 && (
                <div>
                  <h3
                    className='text-sm font-medium mb-2'
                    style={{
                      color: colors.primary,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: '500',
                    }}
                  >
                    Technical Skills
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {data.skills.technical.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 rounded-full text-xs'
                        style={{
                          backgroundColor: `${colors.accent}20`,
                          color: colors.accent,
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: '500',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.business && data.skills.business.length > 0 && (
                <div>
                  <h3
                    className='text-sm font-medium mb-2'
                    style={{
                      color: colors.primary,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: '500',
                    }}
                  >
                    Business Skills
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {data.skills.business.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 rounded-full text-xs'
                        style={{
                          backgroundColor: `${colors.primary}20`,
                          color: colors.primary,
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: '500',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.soft && data.skills.soft.length > 0 && (
                <div>
                  <h3
                    className='text-sm font-medium mb-2'
                    style={{
                      color: colors.primary,
                      fontFamily: '"Inter", sans-serif',
                      fontWeight: '500',
                    }}
                  >
                    Soft Skills
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {data.skills.soft.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 rounded-full text-xs'
                        style={{
                          backgroundColor: `${colors.secondary}20`,
                          color: colors.secondary,
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: '500',
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
        ),
      });
    }

    // Page 4: Education
    if (data.education && data.education.length > 0) {
      pages.push({
        id: 'education',
        title: 'Education',
        suggestions: [
          'Include relevant coursework or academic achievements',
          'Add GPA if it strengthens your application (3.5+)',
          'Include honors, awards, or academic distinctions',
          'List relevant certifications or professional development',
        ],
        content: (
          <div className='space-y-4'>
            <h2
              className='font-semibold mb-4 border-b-2 pb-2'
              style={{
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '14px',
                color: colors.primary,
                borderColor: colors.accent,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {template.layout.sections.find(s => s.type === 'education')
                ?.title || 'Education'}
            </h2>
            <div className='space-y-4'>
              {data.education.slice(0, 2).map((edu, index) => (
                <div
                  key={edu.id || index}
                  className='border-l-4 pl-4 py-2'
                  style={{ borderColor: colors.accent }}
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <h3
                        className='font-semibold text-sm'
                        style={{
                          color: colors.text,
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: '600',
                        }}
                      >
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p
                        className='font-medium text-sm'
                        style={{
                          color: colors.primary,
                          fontFamily: '"Roboto", sans-serif',
                        }}
                      >
                        {edu.institution}
                      </p>
                      {edu.gpa && (
                        <p
                          className='text-xs'
                          style={{
                            color: colors.secondary,
                            fontFamily: '"Roboto", sans-serif',
                          }}
                        >
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <span
                      className='text-xs'
                      style={{
                        color: colors.secondary,
                        fontFamily: '"Roboto", sans-serif',
                      }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      });
    }

    // Page 5: Projects
    if (data.projects && data.projects.length > 0) {
      pages.push({
        id: 'projects',
        title: 'Projects',
        suggestions: [
          'Include project outcomes and impact',
          'Mention technologies and tools used',
          'Highlight your role and contributions',
          'Add links to live projects or GitHub repositories',
        ],
        content: (
          <div className='space-y-4'>
            <h2
              className='font-semibold mb-4 border-b-2 pb-2'
              style={{
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '14px',
                color: colors.primary,
                borderColor: colors.accent,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {template.layout.sections.find(s => s.type === 'projects')
                ?.title || 'Projects'}
            </h2>
            <div className='space-y-4'>
              {data.projects.slice(0, 2).map((project, index) => (
                <div
                  key={project.id || index}
                  className='border-l-4 pl-4 py-2'
                  style={{ borderColor: colors.accent }}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <h3
                        className='font-semibold text-sm'
                        style={{
                          color: colors.text,
                          fontFamily: '"Inter", sans-serif',
                          fontWeight: '600',
                        }}
                      >
                        {project.name}
                      </h3>
                      {'link' in project && typeof project.link === 'string' && project.link && (
                        <a
                          href={project.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-xs text-blue-600 hover:underline'
                          style={{ fontFamily: '"Roboto", sans-serif' }}
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                    <span
                      className='text-xs'
                      style={{
                        color: colors.secondary,
                        fontFamily: '"Roboto", sans-serif',
                      }}
                    >
                      {project.startDate} - {project.endDate}
                    </span>
                  </div>
                  {project.description && (
                    <p
                      className='text-xs mb-2'
                      style={{
                        color: colors.text,
                        fontFamily: '"Roboto", sans-serif',
                        lineHeight: '1.5',
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className='flex flex-wrap gap-1'>
                      {project.technologies
                        .slice(0, 4)
                        .map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className='px-2 py-1 rounded text-xs'
                            style={{
                              backgroundColor: `${colors.secondary}20`,
                              color: colors.secondary,
                              fontFamily: '"Roboto", sans-serif',
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
        ),
      });
    }

    // Page 6: Achievements
    if (data.achievements && data.achievements.length > 0) {
      pages.push({
        id: 'achievements',
        title: 'Achievements',
        suggestions: [
          'Focus on quantifiable achievements and awards',
          'Include professional recognition and certifications',
          'Highlight leadership roles and team accomplishments',
          'Keep achievements relevant to your target position',
        ],
        content: (
          <div className='space-y-4'>
            <h2
              className='font-semibold mb-4 border-b-2 pb-2'
              style={{
                fontFamily: '"Inter", "Segoe UI", sans-serif',
                fontSize: '14px',
                color: colors.primary,
                borderColor: colors.accent,
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {template.layout.sections.find(s => s.type === 'achievements')
                ?.title || 'Achievements'}
            </h2>
            <ul className='space-y-2'>
              {data.achievements.slice(0, 4).map((achievement, index) => (
                <li
                  key={index}
                  className='flex items-start space-x-2'
                  style={{ color: colors.text }}
                >
                  <span
                    className='text-blue-500 mt-1'
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    •
                  </span>
                  <span
                    className='text-sm'
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      lineHeight: '1.5',
                    }}
                  >
                    {achievement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      });
    }

    return pages;
  };

  const pages = createPages();
  const totalPages = pages.length;

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  // Touch/Mouse handlers for swipe navigation
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (translateX > threshold && currentPage > 0) {
      goToPreviousPage();
    } else if (translateX < -threshold && currentPage < totalPages - 1) {
      goToNextPage();
    }
    setTranslateX(0);
  };

  if (pages.length === 0) {
    return (
      <div
        className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
      >
        <div className='p-4 text-center text-gray-500'>
          No content available
        </div>
      </div>
    );
  }

  return (
    <div
      className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden relative flex flex-col ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        fontFamily: fonts.body,
        fontSize: '10px',
        lineHeight: 1.4,
        height: maxHeight,
      }}
    >
      <div
        ref={containerRef}
        className='flex-1 relative overflow-hidden'
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0]?.clientX || 0)}
        onTouchMove={e => handleMove(e.touches[0]?.clientX || 0)}
        onTouchEnd={handleEnd}
      >
        <AnimatePresence initial={false} custom={translateX}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: translateX > 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: translateX > 0 ? 100 : -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className='absolute inset-0 p-4 space-y-4'
          >
            {/* Main Content */}
            {pages[currentPage]?.content}

            {/* Section-specific suggestions */}
            <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400'>
              <h4
                className='text-sm font-semibold text-blue-800 mb-3'
                style={{ fontFamily: '"Inter", sans-serif', fontWeight: '600' }}
              >
                💡 {pages[currentPage]?.title} Suggestions
              </h4>
              <ul
                className='text-xs text-blue-700 space-y-2'
                style={{ fontFamily: '"Roboto", sans-serif' }}
              >
                {pages[currentPage]?.suggestions.map((suggestion, index) => (
                  <li key={index} className='flex items-start space-x-2'>
                    <span className='text-blue-500 mt-0.5'>•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50'>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className='px-4 py-2 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors text-sm font-medium'
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Previous
          </button>
          <div className='flex items-center space-x-3'>
            <span
              className='text-sm font-medium text-slate-700'
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              {`${currentPage + 1} of ${totalPages}`}
            </span>
            <span
              className='text-sm text-slate-500'
              style={{ fontFamily: '"Roboto", sans-serif' }}
            >
              {pages[currentPage]?.title}
            </span>
            <div className='flex space-x-1'>
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className='px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm font-medium'
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            Next
          </button>
        </div>
      )}

      {/* Overall Suggestions */}
      <div className='p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200'>
        <h4
          className='text-sm font-semibold text-green-800 mb-2'
          style={{ fontFamily: '"Inter", sans-serif', fontWeight: '600' }}
        >
          🎯 Overall Resume Tips
        </h4>
        <ul
          className='text-xs text-green-700 space-y-1'
          style={{ fontFamily: '"Roboto", sans-serif' }}
        >
          <li>• Keep formatting consistent throughout all sections</li>
          <li>• Use bullet points for easy scanning by ATS systems</li>
          <li>• Include relevant keywords from job descriptions</li>
          <li>• Proofread for grammar and spelling errors</li>
        </ul>
      </div>

      {/* Swipe Instructions */}
      {totalPages > 1 && (
        <div className='text-center p-2 bg-slate-100'>
          <p
            className='text-xs text-slate-500'
            style={{ fontFamily: '"Roboto", sans-serif' }}
          >
            {`Swipe or use arrow keys to navigate • ${totalPages} pages`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImprovedPaginatedTemplatePreview;
