'use client';

import { useEffect, useState } from 'react';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { ResumeManager } from '@/components/resume/ResumeManager';
import { ValidationStatus } from '@/components/resume/ValidationStatus/ValidationStatus';
import { SectionSeparator } from '@/components/ui';
import { useResumeNavigation } from '@/contexts/ResumeNavigationContext';
import { CloudResume, cloudStorage } from '@/lib/resume/cloudStorage';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';

export default function ResumeBuilderPage() {
  const [currentView, setCurrentView] = useState<'manager' | 'builder'>(
    'manager'
  );
  const [currentResume, setCurrentResume] = useState<CloudResume | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | undefined>(
    undefined
  );
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Use global state
  const resumeData = useResumeStore(state => state.resumeData);
  const analysisResult = useResumeStore(state => state.analysisResult);
  const { navigateToTemplates, navigateToAtsChecker } = useResumeNavigation();

  // Load data from global state on component mount
  useEffect(() => {
    const loadExistingData = () => {
      try {
        // Check if we have data from global state
        if (resumeData && analysisResult) {
          setShowWelcomeMessage(true);
          // Auto-switch to builder view when data is loaded from ATS checker
          setCurrentView('builder');
        }
      } catch {
        // Error loading resume data - silently handle
      }
    };

    loadExistingData();
  }, [resumeData, analysisResult]);

  const handleSave = (data: ResumeData, resumeName?: string) => {
    try {
      if (currentResumeId) {
        // Update existing resume
        cloudStorage.updateResume(currentResumeId, data, resumeName);
      } else {
        // Create new resume
        const name =
          resumeName || prompt('Enter resume name:') || 'Untitled Resume';
        const newResumeId = cloudStorage.saveResume(name, data, 'unknown');
        setCurrentResumeId(newResumeId);
      }
      alert('Resume saved successfully!');
    } catch {
      // Error saving resume
      alert('Failed to save resume');
    }
  };

  const handleExport = (_data: ResumeData, format: 'pdf' | 'docx' | 'txt') => {
    // Exporting resume
    // Here you would implement the actual export functionality
    alert(`Exporting resume as ${format.toUpperCase()}...`);
  };

  const handleResumeSelect = (resume: CloudResume) => {
    // Clear welcome message when selecting an existing resume
    setShowWelcomeMessage(false);

    setCurrentResume(resume);
    setCurrentResumeId(resume.id);
    setCurrentView('builder');
  };

  const handleNewResume = () => {
    // Clear welcome message when creating a new resume
    setShowWelcomeMessage(false);

    setCurrentResume(null);
    setCurrentResumeId(undefined);
    setCurrentView('builder');
  };

  const handleBackToManager = () => {
    setCurrentView('manager');
  };

  // Get initial data for the resume builder
  const getInitialData = (): Partial<ResumeData> | undefined => {
    // Priority: current resume data > global state data (as fallback only)
    if (currentResume) {
      const latestData = cloudStorage.getLatestResumeData(currentResume.id);
      return latestData || undefined;
    }
    // Only use global state data if no existing resume is selected
    if (resumeData) {
      return resumeData;
    }
    return undefined;
  };

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {currentView === 'manager' ? (
        <ResumeManager
          onResumeSelect={handleResumeSelect}
          onNewResume={handleNewResume}
          currentResumeId={currentResumeId}
        />
      ) : (
        <div>
          {/* Header with back button */}
          <div className='bg-card border-b border-border'>
            <div className='max-w-7xl mx-auto px-6 py-4 pt-24'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <button
                    onClick={handleBackToManager}
                    className='flex items-center text-muted-foreground hover:text-foreground transition-colors'
                  >
                    <svg
                      className='w-5 h-5 mr-2'
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
                    Back to Resume Manager
                  </button>
                  {currentResume && (
                    <div className='text-sm text-muted-foreground'>
                      Editing:{' '}
                      <span className='font-medium'>{currentResume.name}</span>
                    </div>
                  )}
                </div>
                <div className='flex items-center space-x-4'>
                  <div className='text-sm text-muted-foreground'>
                    {currentResume
                      ? `Last saved: ${new Date(currentResume.updatedAt).toLocaleString()}`
                      : 'New resume'}
                  </div>
                  {getInitialData() && (
                    <ValidationStatus
                      resumeData={getInitialData() as ResumeData}
                      className='text-xs'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <SectionSeparator variant='gradient' color='muted' spacing='md' />

          {/* Welcome Message for ATS Checker Data */}
          {showWelcomeMessage && resumeData && analysisResult && (
            <div className='bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4 mx-6 mt-4 rounded-lg shadow-lg'>
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
                <button
                  onClick={() => {
                    setShowWelcomeMessage(false);
                  }}
                  className='text-white/80 hover:text-white transition-colors'
                >
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
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className='flex gap-3 mt-4'>
                <button
                  onClick={() => navigateToAtsChecker()}
                  className='px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium'
                >
                  ← Back to ATS Checker
                </button>
                <button
                  onClick={() => navigateToTemplates()}
                  className='px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium'
                >
                  View Templates →
                </button>
              </div>
            </div>
          )}

          <ResumeBuilder
            initialData={getInitialData()}
            onSave={handleSave}
            onExport={handleExport}
          />
        </div>
      )}
    </div>
  );
}
