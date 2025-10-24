'use client';

import React, { useState } from 'react';

import { ValidationModal } from '@/components/resume/ValidationModal';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  getValidationMessages,
  validateResumeData,
} from '@/lib/resume/validation';
import { useResumeStore } from '@/store/resumeStore';

interface UnifiedWelcomeBarProps {
  currentPage: 'ats-checker' | 'builder' | 'templates';
  analysisResult?: {
    jobType?: string;
    atsScore?: string | number;
  } | null;
  resumeData?: unknown;
}

export const UnifiedWelcomeBar: React.FC<UnifiedWelcomeBarProps> = ({
  currentPage,
  analysisResult,
  resumeData,
}) => {
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const globalResumeData = useResumeStore(state => state.resumeData);
  const getPageContent = (): {
    title: string;
    description: string;
    showWelcome: boolean;
    showTemplates: boolean;
    showBuilder: boolean;
    showNavigation: boolean;
  } => {
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
          title: 'Resume Builder',
          description:
            'Build and customize your professional resume with our intuitive editor. Your changes are automatically saved and reflected in templates.',
          showWelcome: true,
          showTemplates: true,
          showBuilder: false,
          showNavigation: false, // Remove navigation to avoid duplication
        };
      case 'templates':
        return {
          title: 'Resume Templates',
          description:
            'Choose from our collection of modern, professional resume templates. Preview with your data and export in multiple formats.',
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

  // Validation function for navigation
  const handleNavigationWithValidation = (targetUrl: string) => {
    const currentData = globalResumeData;
    if (!currentData) {
      // No data to validate, proceed
      window.location.href = targetUrl;
      return;
    }

    // Validate the current resume data
    const validation = validateResumeData(currentData);
    const messages = getValidationMessages(validation);

    // If there are critical errors, show validation modal
    if (!messages.canProceed) {
      setValidationResult(validation);
      setShowValidationModal(true);
    } else {
      // Proceed with navigation
      window.location.href = targetUrl;
    }
  };

  const handleValidationProceed = () => {
    setShowValidationModal(false);
    // Navigate to templates anyway
    window.location.href = '/resume/templates';
  };

  const handleValidationCancel = () => {
    setShowValidationModal(false);
  };

  // Get page-specific styling
  const getPageStyling = () => {
    switch (currentPage) {
      case 'ats-checker':
        return {
          gradient:
            'bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700',
          textColor: 'text-white',
          accentColor: 'from-emerald-400 to-teal-300',
        };
      case 'builder':
        return {
          gradient:
            'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700',
          textColor: 'text-white',
          accentColor: 'from-blue-400 to-indigo-300',
        };
      case 'templates':
        return {
          gradient:
            'bg-gradient-to-r from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700',
          textColor: 'text-white',
          accentColor: 'from-purple-400 to-pink-300',
        };
      default:
        return {
          gradient:
            'bg-gradient-to-r from-slate-500 to-gray-600 dark:from-slate-600 dark:to-gray-700',
          textColor: 'text-white',
          accentColor: 'from-slate-400 to-gray-300',
        };
    }
  };

  const styling = getPageStyling();

  return (
    <div
      className={`${styling.gradient} ${styling.textColor} p-6 mt-4 rounded-lg shadow-lg border border-white/10 dark:border-white/5`}
    >
      {/* ATS Resume Checker Header */}
      <div className='text-center mb-6'>
        <h1
          className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r ${styling.accentColor} bg-clip-text text-transparent`}
        >
          {content.title}
        </h1>
        <p className='text-sm sm:text-base text-white/90 max-w-2xl mx-auto mb-4'>
          {content.description}
        </p>
      </div>

      {/* Navigation Actions - Show on templates and builder pages */}
      {(currentPage === 'templates' || currentPage === 'builder') && (
        <div className='flex justify-center mb-6'>
          <div className='flex items-center space-x-2'>
            {currentPage === 'templates' && (
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
            )}
            {currentPage === 'builder' && (
              <Tooltip content='View Templates' position='bottom'>
                <button
                  type='button'
                  className='flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
                  aria-disabled='false'
                  aria-busy='false'
                  tabIndex={0}
                  title='View Templates'
                  onClick={() =>
                    handleNavigationWithValidation('/resume/templates')
                  }
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
            )}
          </div>
        </div>
      )}

      {/* ATS Analysis Info - Show on builder page when data is available */}
      {currentPage === 'builder' && analysisResult && Boolean(resumeData) && (
        <div className='bg-white/10 rounded-lg p-4 mb-6 border border-white/20'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-white/20 rounded-full flex items-center justify-center'>
              <svg
                className='w-5 h-5'
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
        </div>
      )}

      {/* Start New Analysis Button */}
      <div className='text-center mt-6'>
        <Tooltip content='Start a new ATS analysis' position='top'>
          <button
            onClick={() => (window.location.href = '/resume/ats-checker')}
            className={`px-6 py-3 bg-gradient-to-r ${styling.gradient} hover:opacity-90 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background`}
            aria-label='Start new analysis'
          >
            🆕 Start New Analysis
          </button>
        </Tooltip>
      </div>

      {/* Validation Modal */}
      {validationResult && (
        <ValidationModal
          isOpen={showValidationModal}
          onClose={handleValidationCancel}
          onProceed={handleValidationProceed}
          validationResult={validationResult}
          actionType='export'
        />
      )}
    </div>
  );
};

export default UnifiedWelcomeBar;
