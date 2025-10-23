'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { ResumeData, ResumeTemplate } from '@/types/resume';

interface PaginatedTemplatePreviewProps {
  template: ResumeTemplate;
  data: ResumeData;
  className?: string;
  maxHeight?: string;
}

interface PageContent {
  id: string;
  title: string;
  content: React.ReactNode;
}

export const PaginatedTemplatePreview: React.FC<
  PaginatedTemplatePreviewProps
> = ({ template, data, className = '', maxHeight = '400px' }) => {
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
      } else if (e.key === 'ArrowRight' && currentPage < 10) { // Use a reasonable max
        setCurrentPage(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  if (!template) {
    return (
      <div
        className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
      >
        <div className='p-4 text-center text-gray-500'>
          No template selected
        </div>
      </div>
    );
  }

  const { layout } = template;

  if (!layout) {
    return (
      <div
        className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
      >
        <div className='p-4 text-center text-gray-500'>
          No layout data available
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className={`template-preview bg-white shadow-lg rounded-lg overflow-hidden ${className}`}
      >
        <div className='p-4 text-center text-gray-500'>No data available</div>
      </div>
    );
  }

  const { colors, fonts } = layout;

  // Create pages based on content sections
  const createPages = (): PageContent[] => {
    const pages: PageContent[] = [];

    // Page 1: Header + Summary
    pages.push({
      id: 'header-summary',
      title: 'Header & Summary',
      content: (
        <div className='space-y-4'>
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
              {data.personal?.fullName || 'John Doe'}
            </h1>
            <div
              className='flex flex-wrap justify-center gap-2 text-xs'
              style={{ color: colors.secondary }}
            >
              <a
                href={`mailto:${data.personal?.email || 'john.doe@email.com'}`}
                className='hover:underline hover:text-blue-600 transition-colors'
                style={{ color: colors.secondary }}
              >
                {data.personal?.email || 'john.doe@email.com'}
              </a>
              {data.personal?.phone && (
                <>
                  <span>•</span>
                  <a
                    href={`tel:${data.personal.phone}`}
                    className='hover:underline hover:text-blue-600 transition-colors'
                    style={{ color: colors.secondary }}
                  >
                    {data.personal.phone}
                  </a>
                </>
              )}
              {data.personal?.location && (
                <>
                  <span>•</span>
                  <span>{data.personal.location}</span>
                </>
              )}
              {data.personal?.linkedin && (
                <>
                  <span>•</span>
                  <a
                    href={
                      data.personal.linkedin.startsWith('http')
                        ? data.personal.linkedin
                        : `https://linkedin.com/in/${data.personal.linkedin}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline hover:text-blue-600 transition-colors'
                    style={{ color: colors.secondary }}
                  >
                    LinkedIn
                  </a>
                </>
              )}
              {data.personal?.github && (
                <>
                  <span>•</span>
                  <a
                    href={
                      data.personal.github.startsWith('http')
                        ? data.personal.github
                        : `https://github.com/${data.personal.github}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline hover:text-blue-600 transition-colors'
                    style={{ color: colors.secondary }}
                  >
                    GitHub
                  </a>
                </>
              )}
              {data.personal?.portfolio && (
                <>
                  <span>•</span>
                  <a
                    href={
                      data.personal.portfolio.startsWith('http')
                        ? data.personal.portfolio
                        : `https://${data.personal.portfolio}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:underline hover:text-blue-600 transition-colors'
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
        title: 'Experience',
        content: (
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
              {data.experience.map((exp, index) => (
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
                      {exp.achievements.map((achievement, achIndex) => (
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
        ),
      });
    }

    // Page 3: Skills
    if (data.skills) {
      pages.push({
        id: 'skills',
        title: 'Skills',
        content: (
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
            <div className='space-y-2'>
              {data.skills.technical && data.skills.technical.length > 0 && (
                <div>
                  <h3
                    className='text-xs font-medium mb-1'
                    style={{ color: colors.primary }}
                  >
                    Technical Skills
                  </h3>
                  <div className='flex flex-wrap gap-1'>
                    {data.skills.technical.map((skill, index) => (
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
                </div>
              )}
              {data.skills.business && data.skills.business.length > 0 && (
                <div>
                  <h3
                    className='text-xs font-medium mb-1'
                    style={{ color: colors.primary }}
                  >
                    Business Skills
                  </h3>
                  <div className='flex flex-wrap gap-1'>
                    {data.skills.business.map((skill, index) => (
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
                </div>
              )}
              {data.skills.soft && data.skills.soft.length > 0 && (
                <div>
                  <h3
                    className='text-xs font-medium mb-1'
                    style={{ color: colors.primary }}
                  >
                    Soft Skills
                  </h3>
                  <div className='flex flex-wrap gap-1'>
                    {data.skills.soft.map((skill, index) => (
                      <span
                        key={index}
                        className='px-2 py-0.5 rounded text-xs'
                        style={{
                          backgroundColor: `${colors.secondary}20`,
                          color: colors.secondary,
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
        content: (
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
              {data.education.map((edu, index) => (
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
                      {edu.gpa && (
                        <p
                          className='text-xs'
                          style={{ color: colors.secondary }}
                        >
                          GPA: {edu.gpa}
                        </p>
                      )}
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
        ),
      });
    }

    // Page 5: Projects
    if (data.projects && data.projects.length > 0) {
      pages.push({
        id: 'projects',
        title: 'Projects',
        content: (
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
              {data.projects.map((project, index) => (
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
                      {project.technologies.map((tech, techIndex) => (
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
        ),
      });
    }

    // Page 6: Achievements
    if (data.achievements && data.achievements.length > 0) {
      pages.push({
        id: 'achievements',
        title: 'Achievements',
        content: (
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
              {data.achievements.map((achievement, index) => (
                <li key={index} style={{ color: colors.text }}>
                  • {achievement}
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
    if (Math.abs(translateX) > threshold) {
      if (translateX > 0 && currentPage > 0) {
        setCurrentPage(prev => prev - 1);
      } else if (translateX < 0 && currentPage < pages.length - 1) {
        setCurrentPage(prev => prev + 1);
      }
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
    <div className={`template-preview-container ${className}`}>
      {/* Preview Container */}
      <div
        ref={containerRef}
        className='template-preview bg-white shadow-lg rounded-lg overflow-hidden relative'
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
          maxHeight,
        }}
        onMouseDown={e => handleStart(e.clientX)}
        onMouseMove={e => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={e => handleStart(e.touches[0]?.clientX || 0)}
        onTouchMove={e => handleMove(e.touches[0]?.clientX || 0)}
        onTouchEnd={handleEnd}
      >
        {/* Page Content */}
        <div className='p-3 h-full overflow-y-auto'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {pages[currentPage]?.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        {pages.length > 1 && (
          <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1'>
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentPage
                    ? 'bg-blue-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={{
                  backgroundColor:
                    index === currentPage
                      ? colors.primary
                      : `${colors.secondary}40`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {pages.length > 1 && (
        <div className='flex items-center justify-between mt-2 px-2'>
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className='flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
            <span>Previous</span>
          </button>

          <div className='flex items-center space-x-2'>
            <span className='text-xs text-gray-600'>
              {`${currentPage + 1} of ${pages.length}`}
            </span>
            <span className='text-xs text-gray-500'>
              {pages[currentPage]?.title}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))
            }
            disabled={currentPage === pages.length - 1}
            className='flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <span>Next</span>
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      )}

      {/* Swipe Instructions */}
      {pages.length > 1 && (
        <div className='text-center mt-1'>
          <p className='text-xs text-gray-500'>
            {`Swipe or use arrow keys to navigate • ${pages.length} pages`}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaginatedTemplatePreview;
