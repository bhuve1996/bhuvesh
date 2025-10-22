'use client';

import { useEffect, useState } from 'react';

import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { ResumeManager } from '@/components/resume/ResumeManager';
import { CloudResume, cloudStorage } from '@/lib/resume/cloudStorage';
import { ResumeData } from '@/types/resume';

interface ATSDataSource {
  originalJobType?: string;
  atsScore?: number;
}

export default function ResumeBuilderPage() {
  const [currentView, setCurrentView] = useState<'manager' | 'builder'>(
    'manager'
  );
  const [currentResume, setCurrentResume] = useState<CloudResume | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | undefined>(
    undefined
  );
  const [atsCheckerData, setAtsCheckerData] = useState<{
    data: Partial<ResumeData>;
    source: ATSDataSource;
  } | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Load data from ATS checker on component mount
  useEffect(() => {
    const loadExistingData = () => {
      try {
        const savedData = localStorage.getItem('resume-builder-data');
        const sourceData = localStorage.getItem('resume-builder-source');

        // Loading saved data from localStorage

        if (savedData && sourceData) {
          const resumeData = JSON.parse(savedData);
          const source = JSON.parse(sourceData);

          // Only load ATS data if it's specifically from the ATS checker
          if (source.source === 'ats-checker') {
            // Loading ATS checker data

            setAtsCheckerData({ data: resumeData, source });
            setShowWelcomeMessage(true);

            // Auto-switch to builder view when data is loaded from ATS checker
            setCurrentView('builder');

            // Clear the localStorage data after loading
            localStorage.removeItem('resume-builder-data');
            localStorage.removeItem('resume-builder-source');
          } else {
            // Data found but not from ATS checker, ignoring
            // Clear any stale data
            localStorage.removeItem('resume-builder-data');
            localStorage.removeItem('resume-builder-source');
          }
        }
      } catch {
        // Error loading saved resume data
        // Clear any corrupted data
        localStorage.removeItem('resume-builder-data');
        localStorage.removeItem('resume-builder-source');
      }
    };

    loadExistingData();
  }, []);

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
    // Clear any ATS checker data when selecting an existing resume
    setAtsCheckerData(null);
    setShowWelcomeMessage(false);

    // Clear any stale localStorage data
    localStorage.removeItem('resume-builder-data');
    localStorage.removeItem('resume-builder-source');

    setCurrentResume(resume);
    setCurrentResumeId(resume.id);
    setCurrentView('builder');
  };

  const handleNewResume = () => {
    // Clear any ATS checker data when creating a new resume
    setAtsCheckerData(null);
    setShowWelcomeMessage(false);

    // Clear any stale localStorage data
    localStorage.removeItem('resume-builder-data');
    localStorage.removeItem('resume-builder-source');

    setCurrentResume(null);
    setCurrentResumeId(undefined);
    setCurrentView('builder');
  };

  const handleBackToManager = () => {
    setCurrentView('manager');
  };

  // Get initial data for the resume builder
  const getInitialData = (): Partial<ResumeData> | undefined => {
    // Priority: current resume data > ATS checker data (as fallback only)
    if (currentResume) {
      const latestData = cloudStorage.getLatestResumeData(currentResume.id);
      return latestData || undefined;
    }
    // Only use ATS data if no existing resume is selected
    if (atsCheckerData) {
      return atsCheckerData.data;
    }
    return undefined;
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {currentView === 'manager' ? (
        <ResumeManager
          onResumeSelect={handleResumeSelect}
          onNewResume={handleNewResume}
          currentResumeId={currentResumeId}
        />
      ) : (
        <div>
          {/* Header with back button */}
          <div className='bg-white border-b border-gray-200'>
            <div className='max-w-7xl mx-auto px-6 py-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <button
                    onClick={handleBackToManager}
                    className='flex items-center text-gray-600 hover:text-gray-900 transition-colors'
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
                    <div className='text-sm text-gray-500'>
                      Editing:{' '}
                      <span className='font-medium'>{currentResume.name}</span>
                    </div>
                  )}
                </div>
                <div className='text-sm text-gray-500'>
                  {currentResume
                    ? `Last saved: ${new Date(currentResume.updatedAt).toLocaleString()}`
                    : 'New resume'}
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Message for ATS Checker Data */}
          {showWelcomeMessage && atsCheckerData && (
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
                      {atsCheckerData.source.originalJobType && (
                        <>
                          {' '}
                          Detected job type:{' '}
                          <span className='font-medium'>
                            {atsCheckerData.source.originalJobType}
                          </span>
                        </>
                      )}
                      {atsCheckerData.source.atsScore && (
                        <>
                          {' '}
                          • Previous ATS Score:{' '}
                          <span className='font-medium'>
                            {atsCheckerData.source.atsScore}/100
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowWelcomeMessage(false);
                    // Optionally clear ATS data when user dismisses the message
                    // setAtsCheckerData(null);
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
