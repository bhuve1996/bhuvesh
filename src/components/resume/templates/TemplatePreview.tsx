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
  const { layout } = template;
  const { colors, fonts } = layout;

  // Sample data for preview
  const sampleData = {
    personal: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johnsmith',
      github: 'github.com/johnsmith',
    },
    summary:
      'Experienced professional with expertise in modern technologies and proven track record of delivering high-quality solutions.',
    experience: [
      {
        id: '1',
        company: 'Tech Company Inc.',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        current: true,
        description:
          'Led development of scalable web applications using modern technologies.',
        achievements: [
          'Improved system performance by 40%',
          'Mentored 5 junior developers',
          'Delivered 3 major product features',
        ],
      },
    ],
    education: [
      {
        id: '1',
        institution: 'University of California',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        location: 'Berkeley, CA',
        startDate: '2018',
        endDate: '2022',
        current: false,
        gpa: '3.8',
      },
    ],
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'Python'],
      business: ['Project Management', 'Team Leadership'],
      soft: ['Communication', 'Problem Solving'],
      languages: ['English (Native)'],
      certifications: ['AWS Certified Developer'],
    },
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description:
          'Built a full-stack e-commerce solution with React and Node.js.',
        technologies: ['React', 'Node.js', 'MongoDB'],
        startDate: '2023',
        endDate: '2023',
      },
    ],
  };

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
          <span>•</span>
          <span>{sampleData.personal.phone}</span>
          <span>•</span>
          <span>{sampleData.personal.location}</span>
        </div>
      </div>

      <div className='p-3 space-y-3'>
        {/* Summary */}
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
            Professional Summary
          </h2>
          <p className='text-xs leading-relaxed' style={{ color: colors.text }}>
            {sampleData.summary}
          </p>
        </div>

        {/* Experience */}
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
            Experience
          </h2>
          <div
            className='border-l-2 pl-2'
            style={{ borderColor: colors.accent }}
          >
            <div className='flex justify-between items-start mb-1'>
              <div>
                <h3
                  className='font-semibold text-xs'
                  style={{ color: colors.text }}
                >
                  {sampleData.experience[0]?.position || 'Software Engineer'}
                </h3>
                <p
                  className='font-medium text-xs'
                  style={{ color: colors.primary }}
                >
                  {sampleData.experience[0]?.company || 'Tech Company'}
                </p>
              </div>
              <span className='text-xs' style={{ color: colors.secondary }}>
                2022 - Present
              </span>
            </div>
            <p className='text-xs mb-1' style={{ color: colors.text }}>
              {sampleData.experience[0]?.description ||
                'Led development of scalable web applications using modern technologies.'}
            </p>
            <ul className='text-xs space-y-0.5'>
              {(sampleData.experience[0]?.achievements || [])
                .slice(0, 2)
                .map((achievement, index) => (
                  <li key={index} style={{ color: colors.text }}>
                    • {achievement}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        {/* Skills */}
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
            Skills
          </h2>
          <div className='flex flex-wrap gap-1'>
            {sampleData.skills.technical.slice(0, 4).map((skill, index) => (
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

        {/* Education */}
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
            Education
          </h2>
          <div
            className='border-l-2 pl-2'
            style={{ borderColor: colors.accent }}
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3
                  className='font-semibold text-xs'
                  style={{ color: colors.text }}
                >
                  {sampleData.education[0]?.degree || '...'} in{' '}
                  {sampleData.education[0]?.field || '...'}
                </h3>
                <p
                  className='font-medium text-xs'
                  style={{ color: colors.primary }}
                >
                  {sampleData.education[0]?.institution || '...'}
                </p>
              </div>
              <span className='text-xs' style={{ color: colors.secondary }}>
                2018 - 2022
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreview;
