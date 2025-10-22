'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { Card, Tabs } from '@/components/ui';
import type { AnalysisResult } from '@/types';

interface TabbedParsedDataDisplayProps {
  result: AnalysisResult;
}

export const TabbedParsedDataDisplay: React.FC<
  TabbedParsedDataDisplayProps
> = ({ result }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Contact Information Component
  const ContactInfo = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-blue-400'>
          📞 Contact Information
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <p className='text-slate-500 dark:text-slate-300'>
              <span className='text-blue-400 font-medium'>Name:</span>{' '}
              {result.structured_experience?.contact_info?.full_name}
            </p>
            <p className='text-slate-500 dark:text-slate-300'>
              <span className='text-blue-400 font-medium'>Email:</span>{' '}
              {result.structured_experience?.contact_info?.email}
            </p>
            <p className='text-slate-500 dark:text-slate-300'>
              <span className='text-blue-400 font-medium'>Phone:</span>{' '}
              {result.structured_experience?.contact_info?.phone}
            </p>
          </div>
          <div>
            <p className='text-slate-500 dark:text-slate-300'>
              <span className='text-blue-400 font-medium'>Location:</span>{' '}
              {result.structured_experience?.contact_info?.location}
            </p>
            {result.structured_experience?.contact_info?.linkedin && (
              <p className='text-slate-500 dark:text-slate-300'>
                <span className='text-blue-400 font-medium'>LinkedIn:</span>{' '}
                {result.structured_experience.contact_info.linkedin}
              </p>
            )}
            {result.structured_experience?.contact_info?.github && (
              <p className='text-slate-500 dark:text-slate-300'>
                <span className='text-blue-400 font-medium'>GitHub:</span>{' '}
                {result.structured_experience.contact_info.github}
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Professional Summary Component
  const ProfessionalSummary = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-green-400'>
          📝 Professional Summary
        </h3>
        <p className='text-slate-500 dark:text-slate-300 leading-relaxed'>
          {result.structured_experience?.summary}
        </p>
      </Card>
    </motion.div>
  );

  // Skills Component
  const Skills = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-yellow-400'>
          🛠️ Skills & Proficiencies
        </h3>
        <div className='space-y-4'>
          {result.structured_experience?.skills?.map((skillCategory, index) => (
            <div
              key={index}
              className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4'
            >
              <h4 className='text-lg font-semibold text-yellow-400 mb-3'>
                {skillCategory.category}
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                {skillCategory.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className='flex justify-between items-center bg-slate-100 dark:bg-slate-700/30 rounded-lg p-3'
                  >
                    <span className='text-slate-500 dark:text-slate-300 font-medium'>
                      {skill.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        skill.proficiency === 'Expert'
                          ? 'bg-red-500/20 text-red-400'
                          : skill.proficiency === 'Advanced'
                            ? 'bg-orange-500/20 text-orange-400'
                            : skill.proficiency === 'Intermediate'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {skill.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  // Education Component
  const Education = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-indigo-400'>🎓 Education</h3>
        <div className='space-y-4'>
          {result.structured_experience?.education?.map((edu, index) => (
            <div
              key={index}
              className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
            >
              <h4 className='text-lg font-semibold text-slate-900 dark:text-white mb-2'>
                {edu.degree}
              </h4>
              <p className='text-slate-500 dark:text-slate-300 mb-1'>
                <span className='text-indigo-400 font-medium'>
                  Institution:
                </span>{' '}
                {String(edu.institution) || 'Not specified'}
              </p>
              <p className='text-slate-500 dark:text-slate-300 mb-1'>
                <span className='text-indigo-400 font-medium'>Location:</span>{' '}
                {edu.location || 'Not specified'}
              </p>
              <p className='text-slate-500 dark:text-slate-300 mb-1'>
                <span className='text-indigo-400 font-medium'>Graduation:</span>{' '}
                {edu.graduation_year || 'Not specified'}
              </p>
              {edu.gpa && (
                <p className='text-slate-500 dark:text-slate-300 mb-1'>
                  <span className='text-indigo-400 font-medium'>GPA:</span>{' '}
                  {edu.gpa}
                </p>
              )}
              {edu.relevant_coursework &&
                edu.relevant_coursework.length > 0 && (
                  <div className='mt-3'>
                    <p className='text-indigo-400 font-medium mb-2'>
                      Relevant Coursework:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {edu.relevant_coursework.map((course, courseIndex) => (
                        <span
                          key={courseIndex}
                          className='px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs'
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  // Certifications Component
  const Certifications = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-purple-400'>
          🏆 Certifications
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {result.structured_experience?.certifications?.map((cert, index) => (
            <div
              key={index}
              className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
            >
              <h4 className='text-lg font-semibold text-slate-900 dark:text-white mb-2'>
                {cert.name}
              </h4>
              <p className='text-slate-500 dark:text-slate-300 mb-1'>
                <span className='text-purple-400 font-medium'>Issuer:</span>{' '}
                {cert.issuer}
              </p>
              <p className='text-slate-500 dark:text-slate-300 mb-1'>
                <span className='text-purple-400 font-medium'>Date:</span>{' '}
                {cert.date}
              </p>
              {cert.expiry && (
                <p className='text-slate-500 dark:text-slate-300'>
                  <span className='text-purple-400 font-medium'>Expires:</span>{' '}
                  {cert.expiry}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  // Awards Component
  const Awards = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-yellow-400'>
          🏅 Awards & Recognition
        </h3>
        <div className='space-y-3'>
          {result.structured_experience?.awards?.map((award, index) => (
            <div
              key={index}
              className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
            >
              <div className='flex items-start space-x-3'>
                <span className='text-yellow-400 text-xl'>🏆</span>
                <div className='flex-1'>
                  <h4 className='text-lg font-semibold text-slate-900 dark:text-white mb-1'>
                    {award.name}
                  </h4>
                  <p className='text-slate-500 dark:text-slate-300 mb-1'>
                    <span className='text-yellow-400 font-medium'>Issuer:</span>{' '}
                    {award.issuer}
                  </p>
                  <p className='text-slate-500 dark:text-slate-300 mb-1'>
                    <span className='text-yellow-400 font-medium'>Date:</span>{' '}
                    {award.date}
                  </p>
                  {award.description && (
                    <p className='text-slate-500 dark:text-slate-300 text-sm'>
                      {award.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );

  // Projects Component
  const Projects = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-cyan-400'>
          ⚙️ Automation Projects
        </h3>
        <div className='space-y-4'>
          {result.structured_experience?.automations?.map(
            (automation, index) => (
              <div
                key={index}
                className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
              >
                <h4 className='text-lg font-semibold text-slate-900 dark:text-white mb-2'>
                  {automation.name}
                </h4>
                <p className='text-slate-500 dark:text-slate-300 mb-3'>
                  {automation.description}
                </p>
                {automation.technologies &&
                  automation.technologies.length > 0 && (
                    <div className='mb-3'>
                      <p className='text-cyan-400 font-medium mb-2'>
                        Technologies Used:
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {automation.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className='px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs'
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                {automation.impact && (
                  <p className='text-slate-500 dark:text-slate-300'>
                    <span className='text-cyan-400 font-medium'>Impact:</span>{' '}
                    {automation.impact}
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </Card>
    </motion.div>
  );

  // Work Experience Component
  const WorkExperience = () => (
    <motion.div variants={itemVariants} initial='hidden' animate='visible'>
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-purple-400'>
          🤖 AI-Enhanced Experience Analysis
        </h3>
        <div className='mb-4 p-3 bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-600'>
          <p className='text-sm text-slate-500 dark:text-slate-300'>
            <span className='text-cyan-400 font-medium'>
              {result.structured_experience?.work_experience?.length || 0}{' '}
              Companies
            </span>{' '}
            found in work experience
          </p>
        </div>
        <div className='space-y-4'>
          {result.structured_experience?.work_experience?.map(
            (company, index) => (
              <div
                key={index}
                className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
              >
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h4 className='text-slate-900 dark:text-white font-medium'>
                        {company.company}
                      </h4>
                      {company.current && (
                        <span className='bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium'>
                          Current
                        </span>
                      )}
                      <span className='bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs'>
                        {company.total_experience_years} years
                      </span>
                    </div>
                    {company.positions && company.positions.length > 0 && (
                      <div className='mt-1'>
                        {company.positions.map((position, pIndex) => (
                          <div
                            key={pIndex}
                            className='text-slate-500 dark:text-slate-300 text-sm'
                          >
                            <span className='font-medium'>
                              {position.title}
                            </span>
                            <span className='text-gray-400 text-xs ml-2'>
                              {position.location} • {position.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {company.skills_used && company.skills_used.length > 0 && (
                  <div className='mt-3'>
                    <h5 className='text-blue-400 text-sm font-medium mb-2'>
                      Technologies & Skills Used
                    </h5>
                    <div className='flex flex-wrap gap-1'>
                      {company.skills_used.map((skill, sIndex) => (
                        <span
                          key={sIndex}
                          className='bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {company.projects && company.projects.length > 0 && (
                  <div className='mt-3'>
                    <h5 className='text-cyan-400 text-sm font-medium mb-2'>
                      Projects ({company.projects.length})
                    </h5>
                    <div className='space-y-2'>
                      {company.projects.map((project, pIndex) => (
                        <div
                          key={pIndex}
                          className='bg-slate-100 dark:bg-slate-700/30 rounded p-3'
                        >
                          <h6 className='text-slate-900 dark:text-white text-sm font-medium'>
                            {project.name}
                          </h6>
                          <p className='text-slate-500 dark:text-slate-300 text-xs mt-1'>
                            {project.description}
                          </p>
                          {project.technologies &&
                            project.technologies.length > 0 && (
                              <div className='mt-2'>
                                <span className='text-gray-400 text-xs'>
                                  Technologies:{' '}
                                </span>
                                <span className='text-blue-400 text-xs'>
                                  {project.technologies.join(', ')}
                                </span>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {company.responsibilities &&
                  company.responsibilities.length > 0 && (
                    <div className='mt-3'>
                      <h5 className='text-green-400 text-sm font-medium mb-2'>
                        Key Responsibilities ({company.responsibilities.length})
                      </h5>
                      <ul className='text-slate-500 dark:text-slate-300 text-xs space-y-1'>
                        {company.responsibilities.map((resp, rIndex) => (
                          <li key={rIndex} className='flex items-start'>
                            <span className='text-green-400 mr-2'>•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {company.achievements && company.achievements.length > 0 && (
                  <div className='mt-3'>
                    <h5 className='text-yellow-400 text-sm font-medium mb-2'>
                      Key Achievements ({company.achievements.length})
                    </h5>
                    <ul className='text-slate-500 dark:text-slate-300 text-xs space-y-1'>
                      {company.achievements.map((achievement, aIndex) => (
                        <li key={aIndex} className='flex items-start'>
                          <span className='text-yellow-400 mr-2'>🏆</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </Card>
    </motion.div>
  );

  // Create tab items
  const tabItems = [
    {
      id: 'contact',
      label: 'Contact',
      icon: '📞',
      content: <ContactInfo />,
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: '📝',
      content: <ProfessionalSummary />,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: '🛠️',
      badge: result.structured_experience?.skills?.length || 0,
      content: <Skills />,
    },
    {
      id: 'education',
      label: 'Education',
      icon: '🎓',
      badge: result.structured_experience?.education?.length || 0,
      content: <Education />,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: '🏆',
      badge: result.structured_experience?.certifications?.length || 0,
      content: <Certifications />,
    },
    {
      id: 'awards',
      label: 'Awards',
      icon: '🏅',
      badge: result.structured_experience?.awards?.length || 0,
      content: <Awards />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: '⚙️',
      badge: result.structured_experience?.automations?.length || 0,
      content: <Projects />,
    },
    {
      id: 'experience',
      label: 'Work Experience',
      icon: '💼',
      badge: result.structured_experience?.work_experience?.length || 0,
      content: <WorkExperience />,
    },
  ].filter(item => {
    // Only show tabs that have content
    switch (item.id) {
      case 'contact':
        return result.structured_experience?.contact_info;
      case 'summary':
        return result.structured_experience?.summary;
      case 'skills':
        return (result.structured_experience?.skills?.length ?? 0) > 0;
      case 'education':
        return (result.structured_experience?.education?.length ?? 0) > 0;
      case 'certifications':
        return (result.structured_experience?.certifications?.length ?? 0) > 0;
      case 'awards':
        return (result.structured_experience?.awards?.length ?? 0) > 0;
      case 'projects':
        return (result.structured_experience?.automations?.length ?? 0) > 0;
      case 'experience':
        return (result.structured_experience?.work_experience?.length ?? 0) > 0;
      default:
        return true;
    }
  });

  return (
    <div className='space-y-6'>
      <Tabs
        items={tabItems}
        defaultActiveTab={tabItems[0]?.id || 'contact'}
        variant='pills'
        className='w-full'
      />
    </div>
  );
};

export default TabbedParsedDataDisplay;
