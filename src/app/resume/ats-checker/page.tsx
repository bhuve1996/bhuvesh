'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { UnifiedWelcomeBar } from '@/components/layout/UnifiedWelcomeBar';
import { ATSAnalysis } from '@/components/resume/ATSAnalysis';
import { FileUpload } from '@/components/resume/FileUpload';
import { ResultsDisplay } from '@/components/resume/ResultsDisplay';
import { Section } from '@/components/ui/Section';
// import { useResumeNavigation } from '@/contexts/ResumeNavigationContext';
import { useAnalysisProgress } from '@/hooks/useAnalysisProgress';
import { useResumeActions, useResumeStore } from '@/store/resumeStore';
import type { ATSAnalysisBackendResponse, AnalysisResult } from '@/types';

// Note: Metadata is defined in layout.tsx

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  // Use global state
  const analysisResult = useResumeStore(state => state.analysisResult);
  const error = useResumeStore(state => state.error);
  const { setAnalysisResult, setError, clearAnalysisData } = useResumeActions();

  // Progress tracking
  const {
    progress,
    startAnalysis,
    updateStep,
    completeStep,
    completeAnalysis,
    setError: setProgressError,
  } = useAnalysisProgress();

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setAnalysisResult(null as unknown as AnalysisResult);
    setError(null);
    toast.success(`File "${uploadedFile.name}" uploaded successfully!`);
  };

  const handleAnalysis = async (jobDescription: string) => {
    if (!file) return;

    setError(null);
    // Progress error will be reset when startAnalysis is called

    // Start progress tracking
    startAnalysis();
    const loadingToast = toast.loading('Analyzing your resume...');

    try {
      // Step 1: Upload
      updateStep(0, 'active');
      await new Promise(resolve => setTimeout(resolve, 500));
      completeStep(0);

      // Step 2: Parsing
      updateStep(1, 'active');
      await new Promise(resolve => setTimeout(resolve, 500));
      completeStep(1);

      // Step 3: Analyzing
      updateStep(2, 'active');
      const result = await analyzeResumeWithBackend(file, jobDescription);
      completeStep(2);

      // Step 4: Results
      updateStep(3, 'active');
      await new Promise(resolve => setTimeout(resolve, 500));
      completeStep(3);

      // Complete analysis
      completeAnalysis();

      // Show completion state briefly before switching to results
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Set the analysis result to display inline and switch to results tab
      setAnalysisResult(result);
      setActiveTab('results');

      toast.dismiss(loadingToast);
      toast.success(`Analysis complete! ATS Score: ${result.atsScore}/100`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      setProgressError(errorMessage, 2); // Mark analyzing step as error

      toast.dismiss(loadingToast);
      toast.error(errorMessage);
    }
  };

  const handleNewUpload = () => {
    setFile(null);
    setAnalysisResult(null as unknown as AnalysisResult);
    setError(null);
    setActiveTab('upload');
    // Clear analysis data from global state
    clearAnalysisData();
    // Progress state will be reset when a new analysis starts
    toast.success('Ready for new analysis!');
  };

  const analyzeResumeWithBackend = async (
    file: File,
    jobDescription: string
  ): Promise<AnalysisResult> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      // If job description provided, use enhanced analysis
      if (jobDescription && jobDescription.trim().length >= 50) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jobDescription);

        const response = await fetch(`${API_URL}/api/upload/analyze`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Analysis failed');
        }

        const apiResult: ATSAnalysisBackendResponse = await response.json();

        if (!apiResult.success) {
          throw new Error(apiResult.message || 'Failed to analyze resume');
        }

        // Map enhanced backend response to frontend format
        if (!apiResult.data.detected_job_type) {
          throw new Error('AI job detection failed - no job type detected');
        }
        const detectedJob = `${apiResult.data.detected_job_type} (${Math.round((apiResult.data.job_detection_confidence || 0) * 100)}% confidence)`;

        const result: AnalysisResult = {
          jobType: detectedJob,
          atsScore: apiResult.data.ats_score,
          keywordMatches: apiResult.data.keyword_matches || [],
          missingKeywords: apiResult.data.missing_keywords || [],
          suggestions: apiResult.data.suggestions || [],
          strengths: apiResult.data.strengths || [],
          weaknesses: apiResult.data.weaknesses || [],
          keywordDensity: {},
          wordCount: apiResult.data.word_count || 0,
          characterCount:
            typeof apiResult.data.extraction_details?.full_resume_text ===
            'string'
              ? apiResult.data.extraction_details.full_resume_text.length
              : 0,
        };

        // Add optional properties only if they exist
        if (apiResult.data.extraction_details) {
          result.extraction_details = apiResult.data.extraction_details;
        }
        if (apiResult.data.ats_compatibility) {
          result.ats_compatibility = apiResult.data.ats_compatibility;
        }
        if (apiResult.data.format_analysis) {
          result.format_analysis = apiResult.data.format_analysis;
        }
        if (apiResult.data.detailed_scores) {
          result.detailed_scores = apiResult.data.detailed_scores;
        }
        if (apiResult.data.semantic_similarity !== undefined) {
          result.semantic_similarity = apiResult.data.semantic_similarity;
        }
        if (apiResult.data.match_category) {
          result.match_category = apiResult.data.match_category;
        }
        if (apiResult.data.ats_friendly !== undefined) {
          result.ats_friendly = apiResult.data.ats_friendly;
        }
        if (apiResult.data.formatting_issues) {
          result.formatting_issues = apiResult.data.formatting_issues;
        }
        if (apiResult.data.structured_experience) {
          result.structured_experience = apiResult.data.structured_experience;
        }
        if (apiResult.data.job_description) {
          result.job_description = apiResult.data.job_description;
        }

        return result;
      } else {
        // Quick analysis - backend will generate specific JD based on detected job type
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_URL}/api/upload/quick-analyze`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.detail || 'Analysis failed');
        }

        const apiResult: ATSAnalysisBackendResponse = await response.json();

        if (!apiResult.success) {
          throw new Error(apiResult.message || 'Failed to analyze resume');
        }

        // Return analysis with AI-generated specific job description
        if (!apiResult.data.detected_job_type) {
          throw new Error('AI job detection failed - no job type detected');
        }
        const detectedJob = `${apiResult.data.detected_job_type} (${Math.round((apiResult.data.job_detection_confidence || 0) * 100)}% confidence)`;

        const result: AnalysisResult = {
          jobType: detectedJob,
          atsScore: apiResult.data.ats_score,
          keywordMatches: apiResult.data.keyword_matches || [],
          missingKeywords: apiResult.data.missing_keywords || [],
          suggestions: [
            '🤖 AI analyzed your resume against a specific job description for your role',
            '📊 Results are based on industry-standard requirements for your position',
            '💡 Add a custom job description above for even more targeted analysis',
            ...(apiResult.data.suggestions || []),
          ],
          strengths: apiResult.data.strengths || [],
          weaknesses: apiResult.data.weaknesses || [],
          keywordDensity: {},
          wordCount: apiResult.data.word_count || 0,
          characterCount:
            typeof apiResult.data.extraction_details?.full_resume_text ===
            'string'
              ? apiResult.data.extraction_details.full_resume_text.length
              : 0,
        };

        // Add optional properties only if they exist
        if (apiResult.data.extraction_details) {
          result.extraction_details = apiResult.data.extraction_details;
        }
        if (apiResult.data.ats_compatibility) {
          result.ats_compatibility = apiResult.data.ats_compatibility;
        }
        if (apiResult.data.format_analysis) {
          result.format_analysis = apiResult.data.format_analysis;
        }
        if (apiResult.data.detailed_scores) {
          result.detailed_scores = apiResult.data.detailed_scores;
        }
        if (apiResult.data.semantic_similarity !== undefined) {
          result.semantic_similarity = apiResult.data.semantic_similarity;
        }
        if (apiResult.data.match_category) {
          result.match_category = apiResult.data.match_category;
        }
        if (apiResult.data.ats_friendly !== undefined) {
          result.ats_friendly = apiResult.data.ats_friendly;
        }
        if (apiResult.data.formatting_issues) {
          result.formatting_issues = apiResult.data.formatting_issues;
        }
        if (apiResult.data.structured_experience) {
          result.structured_experience = apiResult.data.structured_experience;
        }
        if (apiResult.data.job_description) {
          result.job_description = apiResult.data.job_description;
        }

        return result;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(
        'Failed to connect to analysis server. Please ensure the backend is running on port 8000.'
      );
    }
  };

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Section id='ats-checker' className='py-8 sm:py-12 lg:py-20'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Unified Welcome Bar */}
          <UnifiedWelcomeBar
            currentPage='ats-checker'
            analysisResult={
              analysisResult
                ? {
                    jobType: analysisResult.jobType,
                    atsScore: analysisResult.atsScore?.toString(),
                  }
                : null
            }
            resumeData={null}
          />

          {/* Tab Navigation - Show when we have results */}
          {analysisResult && (
            <div className='mb-8'>
              <div className='flex space-x-1 bg-muted/50 p-1 rounded-lg w-full max-w-md mx-auto overflow-x-auto scrollbar-hide'>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-6 py-3 rounded-md font-medium transition-all flex-shrink-0 ${
                    activeTab === 'upload'
                      ? 'bg-primary-500 text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  📄 Upload New Resume
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className={`px-6 py-3 rounded-md font-medium transition-all flex-shrink-0 ${
                    activeTab === 'results'
                      ? 'bg-primary-500 text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  📊 Analysis Results
                </button>
              </div>
            </div>
          )}

          {/* Upload Content - Show when no results or when upload tab is active */}
          {(!analysisResult || activeTab === 'upload') && (
            <div className='space-y-8'>
              {/* File Upload Section */}
              {!file && (
                <div>
                  <FileUpload onFileUpload={handleFileUpload} />
                </div>
              )}

              {/* Analysis Section */}
              {file && (
                <div>
                  <ATSAnalysis
                    file={file}
                    onAnalyze={handleAnalysis}
                    error={error}
                    progress={progress}
                  />
                </div>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && analysisResult && (
            <div className='space-y-6'>
              {/* New Upload Button */}
              <div className='text-center'>
                <button
                  onClick={handleNewUpload}
                  className='px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background'
                  aria-label='Analyze another resume'
                >
                  📄 Analyze Another Resume
                </button>
              </div>

              {/* Results Display */}
              <ResultsDisplay
                result={analysisResult}
                onTryAgain={handleNewUpload}
              />
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
