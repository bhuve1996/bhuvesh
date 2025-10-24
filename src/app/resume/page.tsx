'use client';

import Link from 'next/link';
import { useState } from 'react';

import { certifications, education, experience, skills } from '@/lib/data';

export default function Resume() {
  const [activeTab, setActiveTab] = useState('experience');

  return (
    <div className='min-h-screen bg-background text-foreground relative overflow-hidden'>
      {/* Hero Section */}
      <section className='pt-32 pb-16 px-6'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-cyan-400'>
            My Resume
          </h1>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Professional experience, education, and skills in web development
            and software engineering.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/resume/builder'
              className='bg-cyan-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-cyan-300 transition-colors text-center'
            >
              Build Your Resume
            </Link>
            <Link
              href='/resume/ats-checker'
              className='border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition-colors text-center'
            >
              ATS Checker
            </Link>
            <button className='border-2 border-cyan-400 text-cyan-400 px-8 py-3 rounded-lg font-bold hover:bg-cyan-400 hover:text-black transition-colors'>
              Download PDF
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className='px-6 pb-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-center'>
            <div className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-2'>
              {[
                { id: 'experience', label: 'Experience' },
                { id: 'education', label: 'Education' },
                { id: 'skills', label: 'Skills' },
                { id: 'certifications', label: 'Certifications' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-400 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className='px-6 pb-20'>
        <div className='max-w-6xl mx-auto'>
          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                Professional Experience
              </h2>
              {experience.map(job => (
                <div
                  key={job.id}
                  className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/10 transition-colors'
                >
                  <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-4'>
                    <div>
                      <h3 className='text-2xl font-bold text-white mb-2'>
                        {job.title}
                      </h3>
                      <p className='text-xl text-cyan-400 mb-1'>
                        {job.company}
                      </p>
                      <p className='text-gray-400'>{job.location}</p>
                    </div>
                    <div className='text-right mt-4 md:mt-0'>
                      <p className='text-white font-semibold'>{job.period}</p>
                      <p className='text-gray-400'>{job.type}</p>
                    </div>
                  </div>

                  <p className='text-gray-300 mb-6 leading-relaxed'>
                    {job.description}
                  </p>

                  <div className='mb-6'>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Key Achievements:
                    </h4>
                    <ul className='space-y-2'>
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} className='flex items-start space-x-3'>
                          <span className='text-cyan-400 mt-1'>•</span>
                          <span className='text-gray-300'>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Technologies Used:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {job.technologies?.map((tech: string) => (
                        <span
                          key={tech}
                          className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1 rounded-full text-sm'
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>Education</h2>
              {education.map(edu => (
                <div
                  key={edu.id}
                  className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/10 transition-colors'
                >
                  <div className='flex flex-col md:flex-row md:justify-between md:items-start mb-4'>
                    <div>
                      <h3 className='text-2xl font-bold text-white mb-2'>
                        {edu.degree}
                      </h3>
                      <p className='text-xl text-cyan-400 mb-1'>{edu.school}</p>
                      <p className='text-gray-400'>{edu.location}</p>
                    </div>
                    <div className='text-right mt-4 md:mt-0'>
                      <p className='text-white font-semibold'>{edu.period}</p>
                      <p className='text-gray-400'>{edu.gpa}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className='text-lg font-semibold text-white mb-3'>
                      Relevant Coursework:
                    </h4>
                    <div className='flex flex-wrap gap-2'>
                      {edu.relevant_courses?.map((course: string) => (
                        <span
                          key={course}
                          className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-3 py-1 rounded-full text-sm'
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                Technical Skills
              </h2>
              <div className='grid md:grid-cols-3 gap-8'>
                {Object.entries(skills).map(([category, skillList]) => (
                  <div
                    key={category}
                    className='bg-card/5 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/10 transition-colors'
                  >
                    <h3 className='text-xl font-bold text-white mb-6'>
                      {category}
                    </h3>
                    <div className='flex flex-wrap gap-3'>
                      {skillList.map((skill: string) => (
                        <span
                          key={skill}
                          className='bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-cyan-400/20 transition-colors cursor-pointer'
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <div className='space-y-8'>
              <h2 className='text-3xl font-bold text-white mb-8'>
                Certifications
              </h2>
              <div className='grid md:grid-cols-3 gap-6'>
                {certifications.map(cert => (
                  <div
                    key={cert.id}
                    className='bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-2xl p-6 hover:bg-white/10 transition-colors group cursor-pointer'
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-1'>
                          {cert.name}
                        </h3>
                        <p className='text-cyan-400'>{cert.issuer}</p>
                      </div>
                      <span className='text-gray-400 text-sm'>{cert.date}</span>
                    </div>

                    <p className='text-gray-300 text-sm mb-4'>
                      Credential ID: {cert.credential_id}
                    </p>

                    <button className='text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors'>
                      View Credential →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
