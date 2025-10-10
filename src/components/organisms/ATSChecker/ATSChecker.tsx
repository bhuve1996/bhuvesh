import React, { useCallback, useState } from 'react';

import type { AnalysisResult, ATSCheckerProps } from '@/types';

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
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'job_description',
        jobDescription || 'General professional role'
      );

      // Call the backend API
      const response = await fetch('/api/upload/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const analysisData: AnalysisResult = {
          jobType: result.data.detected_job_type || 'General Professional',
          atsScore: result.data.ats_score || 0,
          keywordMatches: result.data.keyword_matches || [],
          missingKeywords: result.data.missing_keywords || [],
          suggestions: result.data.suggestions || [],
          strengths: result.data.strengths || [],
          weaknesses: result.data.weaknesses || [],
          wordCount: result.data.word_count || 0,
          characterCount: result.data.word_count * 5 || 0, // Rough estimate
          extraction_details: result.data.extraction_details,
          ats_compatibility: result.data.ats_compatibility,
          format_analysis: result.data.format_analysis,
          detailed_scores: result.data.detailed_scores,
          semantic_similarity: result.data.semantic_similarity,
          match_category: result.data.match_category,
          ats_friendly: result.data.ats_friendly,
          formatting_issues: result.data.formatting_issues,
          structured_experience: result.data.structured_experience,
        };

        setAnalysisResult(analysisData);
        setActiveTab('results');

        if (onAnalysisComplete) {
          onAnalysisComplete(analysisData);
        }
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [file, jobDescription, onAnalysisComplete, onError]);

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
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder='Paste the job description here for better analysis...'
                className='w-full p-3 border border-gray-300 rounded-lg resize-none'
                rows={6}
                disabled={loading}
              />
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
        <div className='text-center py-12'>
          <p className='text-gray-500'>No analysis results available</p>
        </div>
      ),
    },
  ];

  return (
    <div className={`ats-checker ${className}`} {...props}>
      {/* Header */}
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          ATS Resume Checker
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
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
        defaultActiveTab={activeTab}
        className='max-w-6xl mx-auto'
      />
    </div>
  );
};

export default ATSChecker;
