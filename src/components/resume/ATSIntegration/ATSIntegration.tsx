'use client';

import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import {
  analyzeResumeWithJobDescription,
  checkBackendHealth,
  type ATSAnalysisResult,
} from '@/lib/ats/api';
import { ResumeData } from '@/types/resume';

interface ATSIntegrationProps {
  resumeData: ResumeData;
  onAnalysisComplete?: (result: ATSAnalysisResult) => void;
}

export const ATSIntegration: React.FC<ATSIntegrationProps> = ({
  resumeData,
  onAnalysisComplete,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<
    'checking' | 'online' | 'offline'
  >('checking');

  // Check backend status on mount
  React.useEffect(() => {
    const checkStatus = async () => {
      const isHealthy = await checkBackendHealth();
      setBackendStatus(isHealthy ? 'online' : 'offline');
    };
    checkStatus();
  }, []);

  const handleAnalysis = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert resume data to a file-like object for analysis
      const resumeText = generateResumeText(resumeData);
      const resumeFile = new File([resumeText], 'resume.txt', {
        type: 'text/plain',
      });

      const result = await analyzeResumeWithJobDescription(
        resumeFile,
        jobDescription
      );
      setAnalysisResult(result.data);

      if (onAnalysisComplete) {
        onAnalysisComplete(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateResumeText = (data: ResumeData): string => {
    let text = '';

    // Personal Information
    text += `${data.personal.fullName}\n`;
    text += `${data.personal.email} | ${data.personal.phone} | ${data.personal.location}\n`;
    if (data.personal.linkedin) text += `LinkedIn: ${data.personal.linkedin}\n`;
    if (data.personal.github) text += `GitHub: ${data.personal.github}\n`;
    text += '\n';

    // Summary
    if (data.summary) {
      text += `SUMMARY\n${data.summary}\n\n`;
    }

    // Experience
    if (data.experience && data.experience.length > 0) {
      text += 'EXPERIENCE\n';
      data.experience.forEach(exp => {
        text += `${exp.position} at ${exp.company}\n`;
        text += `${exp.location} | ${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ''}\n`;
        text += `${exp.description}\n\n`;
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      text += 'EDUCATION\n';
      data.education.forEach(edu => {
        text += `${edu.degree} from ${edu.institution}\n`;
        text += `${edu.location} | ${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        text += '\n';
      });
    }

    // Skills
    if (data.skills) {
      text += 'SKILLS\n';
      if (data.skills.technical && data.skills.technical.length > 0) {
        text += `Technical: ${data.skills.technical.join(', ')}\n`;
      }
      if (data.skills.soft && data.skills.soft.length > 0) {
        text += `Soft Skills: ${data.skills.soft.join(', ')}\n`;
      }
      text += '\n';
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      text += 'PROJECTS\n';
      data.projects.forEach(project => {
        text += `${project.name}\n`;
        text += `${project.description}\n`;
        if (project.technologies && project.technologies.length > 0) {
          text += `Technologies: ${project.technologies.join(', ')}\n`;
        }
        if (project.url) text += `Link: ${project.url}\n`;
        text += '\n';
      });
    }

    // Certifications
    if (data.skills.certifications && data.skills.certifications.length > 0) {
      text += 'CERTIFICATIONS\n';
      data.skills.certifications.forEach((cert: string) => {
        text += `• ${cert}\n`;
      });
      text += '\n';
    }

    // Achievements
    if (data.achievements && data.achievements.length > 0) {
      text += 'ACHIEVEMENTS\n';
      data.achievements.forEach(achievement => {
        text += `• ${achievement}\n`;
      });
    }

    return text;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor Match';
  };

  if (backendStatus === 'checking') {
    return (
      <Card className='p-6'>
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400'></div>
          <span className='ml-2 text-gray-600'>Checking ATS service...</span>
        </div>
      </Card>
    );
  }

  if (backendStatus === 'offline') {
    return (
      <Card className='p-6'>
        <div className='text-center py-8'>
          <div className='w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center'>
            <svg
              className='w-8 h-8 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            ATS Service Offline
          </h3>
          <p className='text-gray-600 mb-4'>
            The ATS analysis service is currently unavailable. Please try again
            later.
          </p>
          <Button
            onClick={() => {
              setBackendStatus('checking');
              checkBackendHealth().then(isHealthy => {
                setBackendStatus(isHealthy ? 'online' : 'offline');
              });
            }}
            variant='outline'
          >
            Retry Connection
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Job Description Input */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4 flex items-center'>
          <svg
            className='w-5 h-5 mr-2 text-cyan-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709'
            />
          </svg>
          ATS Analysis
        </h3>
        <p className='text-sm text-gray-600 mb-4'>
          Paste a job description to analyze how well your resume matches the
          requirements.
        </p>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder='Paste the job description here...'
              className='w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent'
            />
          </div>

          <Button
            onClick={handleAnalysis}
            disabled={isAnalyzing || !jobDescription.trim()}
            className='w-full bg-cyan-500 hover:bg-cyan-600'
          >
            {isAnalyzing ? (
              <>
                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
                Analyze Resume
              </>
            )}
          </Button>
        </div>

        {error && (
          <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}
      </Card>

      {/* Analysis Results */}
      {analysisResult && (
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4 flex items-center'>
            <svg
              className='w-5 h-5 mr-2 text-green-500'
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
            Analysis Results
          </h3>

          {/* Overall Score */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-muted-foreground'>
                Overall ATS Score
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysisResult.ats_score)}`}
              >
                {analysisResult.ats_score}/100 -{' '}
                {getScoreLabel(analysisResult.ats_score)}
              </span>
            </div>
            <div className='w-full bg-muted rounded-full h-3'>
              <div
                className={`h-3 rounded-full ${
                  analysisResult.ats_score >= 80
                    ? 'bg-success-500'
                    : analysisResult.ats_score >= 70
                      ? 'bg-primary-500'
                      : analysisResult.ats_score >= 60
                        ? 'bg-warning-500'
                        : 'bg-error-500'
                }`}
                style={{ width: `${analysisResult.ats_score}%` }}
              ></div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
            <div className='text-center p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>
                {analysisResult.detailed_scores.keyword_score}
              </div>
              <div className='text-xs text-gray-600'>Keyword Match</div>
            </div>
            <div className='text-center p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-purple-600'>
                {analysisResult.detailed_scores.semantic_score}
              </div>
              <div className='text-xs text-gray-600'>Semantic Match</div>
            </div>
            <div className='text-center p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>
                {analysisResult.detailed_scores.format_score}
              </div>
              <div className='text-xs text-gray-600'>Format Score</div>
            </div>
            <div className='text-center p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>
                {analysisResult.detailed_scores.content_score}
              </div>
              <div className='text-xs text-gray-600'>Content Quality</div>
            </div>
            <div className='text-center p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-cyan-600'>
                {analysisResult.detailed_scores.ats_score}
              </div>
              <div className='text-xs text-gray-600'>ATS Friendly</div>
            </div>
            <div className='text-center p-3 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-indigo-600'>
                {analysisResult.word_count}
              </div>
              <div className='text-xs text-gray-600'>Word Count</div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div>
              <h4 className='font-medium text-green-700 mb-2 flex items-center'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                Strengths
              </h4>
              <ul className='space-y-1'>
                {analysisResult.strengths.map(
                  (strength: string, index: number) => (
                    <li
                      key={index}
                      className='text-sm text-gray-700 flex items-start'
                    >
                      <span className='text-green-500 mr-2'>•</span>
                      {strength}
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className='font-medium text-red-700 mb-2 flex items-center'>
                <svg
                  className='w-4 h-4 mr-1'
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
                Areas for Improvement
              </h4>
              <ul className='space-y-1'>
                {analysisResult.weaknesses.map(
                  (weakness: string, index: number) => (
                    <li
                      key={index}
                      className='text-sm text-gray-700 flex items-start'
                    >
                      <span className='text-red-500 mr-2'>•</span>
                      {weakness}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          {analysisResult.suggestions &&
            analysisResult.suggestions.length > 0 && (
              <div className='mb-6'>
                <h4 className='font-medium text-blue-700 mb-2 flex items-center'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                    />
                  </svg>
                  Suggestions
                </h4>
                <ul className='space-y-1'>
                  {analysisResult.suggestions.map(
                    (suggestion: string, index: number) => (
                      <li
                        key={index}
                        className='text-sm text-gray-700 flex items-start'
                      >
                        <span className='text-blue-500 mr-2'>•</span>
                        {suggestion}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

          {/* Missing Keywords */}
          {analysisResult.missing_keywords &&
            analysisResult.missing_keywords.length > 0 && (
              <div className='mb-6'>
                <h4 className='font-medium text-orange-700 mb-2'>
                  Missing Keywords
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {analysisResult.missing_keywords.map(
                    (keyword: string, index: number) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full'
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Matched Keywords */}
          {analysisResult.keyword_matches &&
            analysisResult.keyword_matches.length > 0 && (
              <div>
                <h4 className='font-medium text-green-700 mb-2'>
                  Matched Keywords
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {analysisResult.keyword_matches.map(
                    (keyword: string, index: number) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'
                      >
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
        </Card>
      )}
    </div>
  );
};

export default ATSIntegration;
