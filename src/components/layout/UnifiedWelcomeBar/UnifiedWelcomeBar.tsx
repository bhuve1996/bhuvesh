'use client';

import React, { useState } from 'react';

import { ValidationModal } from '@/components/resume/ValidationModal';
import { Tooltip, UniversalTourTrigger } from '@/components/ui';
import {
  ValidationResult,
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
  onBackToManager?: () => void;
  onEditInBuilder?: () => void;
  onViewTemplates?: () => void;
  showActionButtons?: boolean;
}

export const UnifiedWelcomeBar: React.FC<UnifiedWelcomeBarProps> = ({
  currentPage,
  analysisResult,
  resumeData,
  onBackToManager,
  onEditInBuilder,
  onViewTemplates,
  showActionButtons = false,
}) => {
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
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
      // Save current data to store before navigation (same as floating button)
      const { setResumeData } = useResumeStore.getState();
      setResumeData(currentData);
      // Proceed with navigation
      window.location.href = targetUrl;
    }
  };

  const handleValidationProceed = () => {
    setShowValidationModal(false);
    // Save current data to store before navigation (same as floating button)
    const currentData = globalResumeData;
    if (currentData) {
      const { setResumeData } = useResumeStore.getState();
      setResumeData(currentData);
    }
    // Navigate to templates anyway
    window.location.href = '/resume/templates';
  };

  const handleValidationCancel = () => {
    setShowValidationModal(false);
  };

  const handleAIImprove = () => {
    setShowValidationModal(false);
    // TODO: Implement AI improvement flow
    // For now, show a toast and navigate to templates
    alert(
      'AI improvement feature coming soon! This will analyze your resume and provide targeted suggestions for better ATS compatibility.'
    );
    window.location.href = '/resume/templates';
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
      className={`${styling.gradient} ${styling.textColor} p-4 mt-2 rounded-lg shadow-lg border border-white/10 dark:border-white/5`}
    >
      {/* ATS Resume Checker Header */}
      <div className='text-center mb-4'>
        <h1
          className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r ${styling.accentColor} bg-clip-text text-transparent`}
        >
          {content.title}
        </h1>
        <p className='text-xs sm:text-sm text-white/90 max-w-2xl mx-auto mb-3'>
          {content.description}
        </p>
      </div>

      {/* Navigation Actions - Show on templates and builder pages */}
      {(currentPage === 'templates' || currentPage === 'builder') && (
        <div className='flex justify-center mb-4'>
          <div className='flex items-center space-x-1'>
            {/* Back to ATS Checker Button - Show on builder page */}
            {currentPage === 'builder' && onBackToManager && (
              <div className='relative inline-block'>
                <Tooltip content='Go back to ATS checker' position='top'>
                  <button
                    type='button'
                    onClick={onBackToManager}
                    className='flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
                    aria-label='Back to ATS Checker'
                    title='Back to ATS Checker'
                  >
                    <svg
                      className='w-4 h-4 text-white'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2.5}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            )}
            {currentPage === 'templates' && (
              <Tooltip content='Back to Builder' position='bottom'>
                <button
                  type='button'
                  className='flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
                  aria-disabled='false'
                  aria-busy='false'
                  tabIndex={0}
                  title='Back to Builder'
                  onClick={() => (window.location.href = '/resume/builder')}
                >
                  <svg
                    className='w-4 h-4 text-white'
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
                  className='flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
                  aria-disabled='false'
                  aria-busy='false'
                  tabIndex={0}
                  title='View Templates'
                  onClick={() =>
                    handleNavigationWithValidation('/resume/templates')
                  }
                >
                  <svg
                    className='w-4 h-4 text-white'
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

            {/* Universal Tour Trigger Button - Shows appropriate tour for current page */}
            <div className='relative inline-block'>
              <Tooltip content='Take a guided tour' position='top'>
                <UniversalTourTrigger
                  variant='icon'
                  className='flex items-center justify-center w-8 h-8 rounded-full bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2'
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
                      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </UniversalTourTrigger>
              </Tooltip>
            </div>
          </div>
        </div>
      )}

      {/* ATS Analysis Info - Show on builder page when data is available */}
      {currentPage === 'builder' && analysisResult && Boolean(resumeData) && (
        <div className='bg-white/10 rounded-lg p-3 mb-4 border border-white/20'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 bg-white/20 rounded-full flex items-center justify-center'>
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
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div>
              <p className='text-xs opacity-90'>
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

      {/* Action Buttons */}
      <div className='text-center mt-4 flex flex-col sm:flex-row gap-3 justify-center items-center'>
        {/* Show Start New Analysis button only on non-ATS checker pages */}
        {currentPage !== 'ats-checker' && (
          <Tooltip content='Start a new ATS analysis' position='top'>
            <button
              onClick={() => (window.location.href = '/resume/ats-checker')}
              className={`px-4 py-2 bg-gradient-to-r ${styling.gradient} hover:opacity-90 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-background text-sm`}
              aria-label='Start new analysis'
            >
              🆕 Start New Analysis
            </button>
          </Tooltip>
        )}

        {currentPage === 'builder' && (
          <Tooltip content='Improve your resume content with AI' position='top'>
            <button
              onClick={() => {
                // Trigger AI content improvement
                const event = new CustomEvent('ai-improve-content', {
                  detail: { source: 'unified-bar' },
                });
                window.dispatchEvent(event);
              }}
              className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-background text-sm relative overflow-hidden'
              aria-label='AI content improvement'
            >
              <span className='relative z-10 flex items-center gap-2'>
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
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
                🤖 AI Improve Content
              </span>
              {/* Pulsating effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg animate-pulse opacity-20'></div>
              <div className='absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg animate-ping opacity-30'></div>
            </button>
          </Tooltip>
        )}
      </div>

      {/* Resume Improvement Action Buttons - Show on ATS checker page when analysis is complete */}
      {showActionButtons && onEditInBuilder && onViewTemplates && (
        <div className='mt-6'>
          <div className='text-center mb-4'>
            <h3 className='text-lg font-semibold text-white mb-2'>
              Ready to Improve Your Resume?
            </h3>
            <p className='text-white/90 text-sm'>
              Take action based on your ATS analysis results
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto'>
            {/* Edit in Resume Builder Button */}
            <Tooltip
              content='Open resume builder with your parsed data pre-filled'
              position='top'
            >
              <div className='h-full'>
                <button
                  onClick={onEditInBuilder}
                  className='group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full h-full min-h-[80px]'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                  <div className='relative flex flex-col items-center justify-center space-y-1 h-full'>
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
                        d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                      />
                    </svg>
                    <div className='text-center'>
                      <div className='text-sm font-bold'>
                        Edit in Resume Builder
                      </div>
                      <div className='text-xs opacity-90'>
                        Pre-filled with your data
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </Tooltip>

            {/* View Templates Button */}
            <Tooltip
              content='Browse resume templates with your data'
              position='top'
            >
              <div className='h-full'>
                <button
                  onClick={onViewTemplates}
                  className='group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl w-full h-full min-h-[80px]'
                >
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                  <div className='relative flex flex-col items-center justify-center space-y-1 h-full'>
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
                        d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
                      />
                    </svg>
                    <div className='text-center'>
                      <div className='text-sm font-bold'>View Templates</div>
                      <div className='text-xs opacity-90'>Choose a design</div>
                    </div>
                  </div>
                </button>
              </div>
            </Tooltip>
          </div>
        </div>
      )}

      {/* Validation Modal */}
      {validationResult && (
        <ValidationModal
          isOpen={showValidationModal}
          onClose={handleValidationCancel}
          onProceed={handleValidationProceed}
          onAIImprove={handleAIImprove}
          validationResult={validationResult}
          actionType='navigate'
        />
      )}
    </div>
  );
};

export default UnifiedWelcomeBar;
