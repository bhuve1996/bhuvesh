import React, { useCallback, useState } from 'react';

import { atsApi } from '@/lib/ats/api';
import { ERROR_MESSAGES, formatErrorForUser } from '@/lib/utils/errorHandling';
import type {
  ATSCheckerProps,
  AnalysisResult,
  StructuredExperience,
} from '@/types';

import { Alert } from '../../atoms/Alert/Alert';
import { Button } from '../../atoms/Button/Button';
import { FileUpload } from '../../molecules/FileUpload/FileUpload';
import { Tabs } from '../../molecules/Tabs/Tabs';
import { Card } from '../../ui/Card/Card';

import { ATSResults } from './ATSResults/ATSResults';

export const ATSChecker: React.FC<ATSCheckerProps> = ({
  onAnalysisComplete,
  onError,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState('');

  const handleFileUpload = useCallback((files: File[]) => {
    if (files.length > 0 && files[0]) {
      setFile(files[0]);
      setError(null);
      setAnalysisResult(null);
    }
  }, []);

  const handleAnalysis = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Use quick analyze endpoint which handles everything in one step
      const analysisResult = await atsApi.analyzeResumeWithJobDescription(
        file,
        '', // Empty job description since we're using AI-generated one
        (_step: string, _progress: number) => {
          // Progress callback - you can add progress tracking here
        }
      );

      if (!analysisResult.success || !analysisResult.data) {
        throw new Error(analysisResult.message || 'Analysis failed');
      }

      const analysisData: AnalysisResult = {
        jobType: analysisResult.data.match_category || 'General Professional',
        atsScore: analysisResult.data.ats_score || 0,
        keywordMatches: analysisResult.data.keyword_matches || [],
        missingKeywords: analysisResult.data.missing_keywords || [],
        suggestions: analysisResult.data.suggestions || [],
        strengths: analysisResult.data.strengths || [],
        weaknesses: analysisResult.data.weaknesses || [],
        wordCount: analysisResult.data.word_count || 0,
        characterCount: analysisResult.data.word_count * 5 || 0, // Rough estimate
        keywordDensity: {}, // Will be populated by backend
        extraction_details: {
          full_resume_text: analysisResult.data.job_description || '',
          total_resume_keywords:
            analysisResult.data.keyword_matches?.length || 0,
          total_jd_keywords: 0,
          total_matched_keywords:
            analysisResult.data.keyword_matches?.length || 0,
          total_missing_keywords:
            analysisResult.data.missing_keywords?.length || 0,
        },
        ats_compatibility: {
          grade: 'C',
          issues: [],
          warnings: [],
          recommendations: [],
          sections_found: [],
          contact_completeness: 'Partial',
          bullet_consistency: false,
          word_count_optimal: false,
        },
        format_analysis: {
          grade: 'C',
          sections_found: 0,
          optional_sections_found: 0,
          contact_completeness: 'Partial',
          has_professional_summary: false,
          section_headers_count: 0,
          issues: [],
          recommendations: [],
        },
        detailed_scores: analysisResult.data.detailed_scores || {
          keyword_score: 0,
          semantic_score: 0,
          format_score: 0,
          content_score: 0,
          ats_score: 0,
        },
        semantic_similarity: analysisResult.data.semantic_similarity || 0,
        match_category: analysisResult.data.match_category || 'Unknown',
        ats_friendly: analysisResult.data.ats_friendly || false,
        formatting_issues: analysisResult.data.formatting_issues || [],
        job_description: analysisResult.data.job_description || '',
        structured_experience: (analysisResult.data
          .structured_experience as StructuredExperience) || {
          work_experience: [],
          contact_info: {
            full_name: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
          },
        },
      };

      setAnalysisResult(analysisData);
      setActiveTab('results');

      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData);
      }
    } catch (err) {
      const errorMessage = formatErrorForUser(err, ERROR_MESSAGES.ANALYSIS);
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [file, onAnalysisComplete, onError]);

  const handleNewUpload = useCallback(() => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setJobDescription('');
    setActiveTab('upload');
  }, []);

  const handleTryAgain = useCallback(() => {
    setError(null);
    if (file) {
      handleAnalysis();
    }
  }, [file, handleAnalysis]);

  const tabItems = [
    {
      id: 'upload',
      label: '📄 Upload Resume',
      content: (
        <div className='space-y-6'>
          {/* Clear Data Button - Show when there are results */}
          {analysisResult && (
            <Card className='p-4 bg-green-50 border-green-200'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                  <div>
                    <p className='text-sm font-medium text-green-800'>
                      Analysis Complete
                    </p>
                    <p className='text-xs text-green-600'>
                      Your resume has been analyzed successfully
                    </p>
                  </div>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleNewUpload}
                  className='border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400'
                >
                  Clear Data
                </Button>
              </div>
            </Card>
          )}

          {/* File Upload */}
          <FileUpload
            accept='.pdf,.docx,.doc,.txt'
            maxSize={10 * 1024 * 1024} // 10MB
            onFileUpload={handleFileUpload}
            onError={error => setError(error)}
            loading={loading}
            dragAndDrop
            preview
          />

          {/* Job Description Input */}
          {file && (
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Job Description (Optional)
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                Provide a job description for more targeted analysis
              </p>
              <textarea
                id='job-description-input'
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder='Paste the job description here for better analysis...'
                className='w-full p-3 border border-gray-300 rounded-lg resize-none'
                rows={6}
                disabled={loading}
                aria-label='Job description for analysis'
              />
              <label htmlFor='job-description-input' className='sr-only'>
                Job description for analysis
              </label>
              <div className='mt-4 flex justify-end space-x-3'>
                <Button
                  variant='outline'
                  onClick={handleNewUpload}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  onClick={handleAnalysis}
                  loading={loading}
                  disabled={!file}
                >
                  {loading ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'results',
      label: '📊 Analysis Results',
      content: analysisResult ? (
        <ATSResults
          result={analysisResult}
          onTryAgain={handleNewUpload}
          onNewUpload={handleNewUpload}
        />
      ) : (
        <div className='text-center py-6'>
          <p className='text-muted-foreground'>No analysis results available</p>
        </div>
      ),
    },
  ];

  return (
    <div className={`ats-checker ${className}`} {...props}>
      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-foreground mb-4'>
          ATS Resume Checker
        </h1>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Get your resume analyzed for ATS compatibility and receive detailed
          feedback to improve your chances of landing interviews.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className='mb-6'>
          <Alert variant='error'>
            <div className='flex items-center justify-between'>
              <span>{error}</span>
              <Button
                variant='outline'
                size='sm'
                onClick={handleTryAgain}
                disabled={loading}
              >
                Try Again
              </Button>
            </div>
          </Alert>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        onTabChange={tabId => setActiveTab(tabId as 'upload' | 'results')}
        className='max-w-6xl mx-auto'
      />
    </div>
  );
};

export default ATSChecker;
