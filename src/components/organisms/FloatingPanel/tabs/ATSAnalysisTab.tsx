'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { atsApi } from '@/api/endpoints/ats';
import { Button } from '@/components/atoms/Button/Button';
import { StatusBadge } from '@/components/molecules/StatusBadge/StatusBadge';
import { Card } from '@/components/ui/Card';
import type { ATSAnalysisTabProps, ResumeData } from '@/types';

export const ATSAnalysisTab: React.FC<ATSAnalysisTabProps> = ({
  resumeData,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResult, setAtsResult] = useState<{
    atsScore: number;
    issues: string[];
    suggestions: string[];
  } | null>(null);

  const analyzeATS = async () => {
    setIsAnalyzing(true);
    try {
      // Convert resume data to text for analysis
      const resumeText = convertResumeDataToText(resumeData);

      // Create a File object for the current resume
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const file = new File([blob], 'resume.txt', { type: 'text/plain' });

      // Get ATS analysis
      const analysisResult = await atsApi.extractExperience(file);

      if (analysisResult.success && analysisResult.data) {
        const atsScore =
          (analysisResult.data as { ats_score?: number }).ats_score || 0;

        setAtsResult({
          atsScore,
          issues: analysisResult.data.issues || [],
          suggestions: analysisResult.data.suggestions || [],
        });

        toast.success('ATS analysis completed!');
      } else {
        throw new Error('Analysis failed');
      }
    } catch {
      toast.error('Failed to analyze resume');
      // ATS Analysis Error: error
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertResumeDataToText = (data: ResumeData): string => {
    let text = '';

    if (data.personal) {
      text += `${data.personal.fullName}\n`;
      text += `${data.personal.email}\n`;
      text += `${data.personal.phone}\n`;
      text += `${data.personal.location}\n\n`;
    }

    if (data.summary) {
      text += `SUMMARY\n${data.summary}\n\n`;
    }

    if (data.experience && data.experience.length > 0) {
      text += 'EXPERIENCE\n';
      data.experience.forEach(exp => {
        text += `${exp.title} at ${exp.company}\n`;
        text += `${exp.startDate} - ${exp.endDate}\n`;
        text += `${exp.description}\n\n`;
      });
    }

    if (data.skills) {
      text += 'SKILLS\n';
      if (data.skills.technical)
        text += `Technical: ${data.skills.technical.join(', ')}\n`;
      if (data.skills.business)
        text += `Business: ${data.skills.business.join(', ')}\n`;
      if (data.skills.soft) text += `Soft: ${data.skills.soft.join(', ')}\n\n`;
    }

    return text;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className='p-4 space-y-4 h-full overflow-y-auto' data-tour='ats-tab'>
      <div className='text-center'>
        <h4 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
          ATS Compatibility Analysis
        </h4>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          Analyze your resume for ATS compatibility and get improvement
          suggestions
        </p>
      </div>

      {!atsResult ? (
        <div className='space-y-4'>
          <Card className='p-4 text-center'>
            <div className='w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-primary-600 dark:text-primary-400'
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
            <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-2'>
              Ready to Analyze
            </h5>
            <p className='text-sm text-neutral-600 dark:text-neutral-400 mb-4'>
              Click the button below to analyze your resume for ATS
              compatibility
            </p>
            <Button
              onClick={analyzeATS}
              loading={isAnalyzing}
              variant='primary'
              fullWidth
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </Card>
        </div>
      ) : (
        <div className='space-y-4'>
          {/* Score Display */}
          <Card className='p-4 text-center'>
            <div className='mb-4'>
              <div className='text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
                {atsResult.atsScore}/100
              </div>
              <StatusBadge
                status={getScoreColor(atsResult.atsScore)}
                variant='soft'
                size='md'
              >
                {getScoreLabel(atsResult.atsScore)}
              </StatusBadge>
            </div>
            <Button
              onClick={analyzeATS}
              loading={isAnalyzing}
              variant='outline'
              size='sm'
            >
              Re-analyze
            </Button>
          </Card>

          {/* Issues */}
          {atsResult.issues.length > 0 && (
            <Card className='p-4'>
              <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-3'>
                Issues Found
              </h5>
              <ul className='space-y-2'>
                {atsResult.issues.map((issue, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <StatusBadge status='error' size='sm' icon='⚠️'>
                      Issue
                    </StatusBadge>
                    <span className='text-sm text-neutral-700 dark:text-neutral-300'>
                      {issue}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Suggestions */}
          {atsResult.suggestions.length > 0 && (
            <Card className='p-4'>
              <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-3'>
                Suggestions
              </h5>
              <ul className='space-y-2'>
                {atsResult.suggestions.map((suggestion, index) => (
                  <li key={index} className='flex items-start gap-2'>
                    <StatusBadge status='info' size='sm' icon='💡'>
                      Tip
                    </StatusBadge>
                    <span className='text-sm text-neutral-700 dark:text-neutral-300'>
                      {suggestion}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default ATSAnalysisTab;
