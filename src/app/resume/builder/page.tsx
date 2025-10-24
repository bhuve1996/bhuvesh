'use client';

import { useEffect, useState } from 'react';

import { UnifiedWelcomeBar } from '@/components/layout/UnifiedWelcomeBar';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { ResumeManager } from '@/components/resume/ResumeManager';
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

  // Use global state
  const resumeData = useResumeStore(state => state.resumeData);
  const analysisResult = useResumeStore(state => state.analysisResult);

  // Load data from global state on component mount
  useEffect(() => {
    const loadExistingData = () => {
      try {
        // Check if we have data from global state
        if (resumeData && analysisResult) {
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
    setCurrentResume(resume);
    setCurrentResumeId(resume.id);
    setCurrentView('builder');
  };

  const handleNewResume = () => {
    setCurrentResume(null);
    setCurrentResumeId(undefined);
    setCurrentView('builder');
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
          {/* Unified Welcome Bar */}
          <UnifiedWelcomeBar
            currentPage='builder'
            analysisResult={
              analysisResult
                ? {
                    jobType: analysisResult.jobType,
                    atsScore: analysisResult.atsScore?.toString(),
                  }
                : null
            }
            resumeData={resumeData}
          />

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
