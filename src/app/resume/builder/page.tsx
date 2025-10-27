'use client';

import { useState } from 'react';

import { UnifiedWelcomeBar } from '@/components/layout/UnifiedWelcomeBar';
import { ResumeBuilder } from '@/components/resume/ResumeBuilder';
import { CloudResume, cloudStorage } from '@/lib/resume/cloudStorage';
import { useResumeStore } from '@/store/resumeStore';
import { ResumeData } from '@/types/resume';

export default function ResumeBuilderPage() {
  const [currentResume] = useState<CloudResume | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<string | undefined>(
    undefined
  );

  // Use global state
  const resumeData = useResumeStore(state => state.resumeData);
  const analysisResult = useResumeStore(state => state.analysisResult);

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

  const handleBackToATSChecker = () => {
    window.location.href = '/resume/ats-checker';
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
          onBackToManager={handleBackToATSChecker}
        />

        <ResumeBuilder initialData={getInitialData()} onSave={handleSave} />
      </div>
    </div>
  );
}
