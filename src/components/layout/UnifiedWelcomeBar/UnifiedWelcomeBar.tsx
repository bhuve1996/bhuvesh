'use client';

import { Tooltip } from '@/components/ui/Tooltip';
import React from 'react';

interface UnifiedWelcomeBarProps {
  currentPage: 'ats-checker' | 'builder' | 'templates';
  analysisResult?: {
    jobType?: string;
    atsScore?: string | number;
  } | null;
  resumeData?: any;
}

export const UnifiedWelcomeBar: React.FC<UnifiedWelcomeBarProps> = ({
  currentPage,
  analysisResult,
  resumeData,
}) => {
  const getPageContent = () => {
    switch (currentPage) {
      case 'ats-checker':
        return {
          title: 'ATS Resume Checker',
          description:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          showWelcome: false,
          showTemplates: false,
          showBuilder: false,
          showNavigation: false,
        };
      case 'builder':
        return {
          title: 'ATS Resume Checker',
          description:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          showWelcome: true,
          showTemplates: true,
          showBuilder: false,
          showNavigation: true,
        };
      case 'templates':
        return {
          title: 'ATS Resume Checker',
          description:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          showWelcome: false,
          showTemplates: true,
          showBuilder: true,
          showNavigation: false,
        };
      default:
        return {
          title: 'ATS Resume Checker',
          description:
            'Get your resume analyzed for ATS compatibility across all job profiles. Receive detailed feedback and optimization suggestions.',
          showWelcome: false,
          showTemplates: false,
          showBuilder: false,
          showNavigation: false,
        };
    }
  };

  const content = getPageContent();

  return (
    <div className='bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 mt-4 rounded-lg shadow-lg'>
      {/* ATS Resume Checker Header */}
      <div className='text-center mb-6'>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent'>
          {content.title}
        </h1>
        <p className='text-sm sm:text-base text-white/90 max-w-2xl mx-auto mb-4'>
          {content.description}
        </p>
      </div>

      {/* Resume Templates Header - Only show on templates page */}
      {content.showTemplates && currentPage === 'templates' && (
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent'>
              Resume Templates
            </h1>
            <p className='text-sm sm:text-base text-white/80 mt-1'>
              Choose from our collection of modern, professional resume
              templates
            </p>
          </div>
          <Tooltip content='Back to Builder' position='bottom'>
            <button
              type='button'
              className='flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
              aria-disabled='false'
              aria-busy='false'
              tabIndex={0}
              title='Back to Builder'
              onClick={() => (window.location.href = '/resume/builder')}
            >
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M15 19l-7-7 7-7'
                ></path>
              </svg>
            </button>
          </Tooltip>
        </div>
      )}

      {/* Resume Builder Section - Only show on builder page */}
      {content.showTemplates && currentPage === 'builder' && (
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6'>
          <div>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent'>
              Resume Builder
            </h1>
            <p className='text-sm sm:text-base text-white/80 mt-1'>
              Build and customize your professional resume with our intuitive editor
            </p>
          </div>
          <Tooltip content='View Templates' position='bottom'>
            <button
              type='button'
              className='flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
              aria-disabled='false'
              aria-busy='false'
              tabIndex={0}
              title='View Templates'
              onClick={() => (window.location.href = '/resume/templates')}
            >
              <svg
                className='w-5 h-5 text-white'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2.5}
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </button>
          </Tooltip>
        </div>
      )}

      {/* Welcome Message and Navigation - Only show on builder page */}
      {content.showWelcome && currentPage === 'builder' && analysisResult && resumeData && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center'>
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <h3 className='font-semibold text-lg'>
                Welcome to the Resume Builder!
              </h3>
              <p className='text-sm opacity-90'>
                Your resume data from the ATS checker has been loaded.
                {analysisResult.jobType && (
                  <>
                    {' '}
                    Detected job type:{' '}
                    <span className='font-medium'>
                      {analysisResult.jobType}
                    </span>
                  </>
                )}
                {analysisResult.atsScore && (
                  <>
                    {' '}
                    • Previous ATS Score:{' '}
                    <span className='font-medium'>
                      {analysisResult.atsScore}/100
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <Tooltip content='Back to ATS Checker' position='bottom'>
              <button
                onClick={() => window.history.back()}
                className='flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200 backdrop-blur-sm'
              >
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                <span>Back</span>
              </button>
            </Tooltip>
            <Tooltip content='Next to Resume Builder' position='bottom'>
              <button
                onClick={() => {
                  // Scroll to the first section or trigger next step
                  const firstSection = document.querySelector(
                    '[data-section="personal"]'
                  );
                  if (firstSection) {
                    firstSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className='flex items-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'
              >
                <span>Next</span>
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
                    d='M9 5l7 7-7 7'
                  />
                </svg>
              </button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Start New Analysis Button */}
      <div className='text-center mt-6'>
        <Tooltip content='Start a new ATS analysis' position='top'>
          <button
            onClick={() => (window.location.href = '/resume/ats-checker')}
            className='px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background'
            aria-label='Start new analysis'
          >
            🆕 Start New Analysis
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default UnifiedWelcomeBar;
