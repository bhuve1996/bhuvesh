'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { UnifiedWelcomeBar } from '@/components/layout/UnifiedWelcomeBar';
import { FileUpload } from '@/components/molecules/FileUpload/FileUpload';
import { ATSAnalysis } from '@/components/resume/ATSAnalysis';
import { ResultsDisplay } from '@/components/resume/ResultsDisplay';
import { Section } from '@/components/ui/Section';
import { useAnalysisProgress } from '@/hooks/useAnalysisProgress';
import { atsApi } from '@/lib/ats/api';
import { useResumeActions, useResumeStore } from '@/store/resumeStore';
import type { AnalysisResult } from '@/types';
import { ResumeDataUtils } from '@/types/resume';

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);

  // Use global state
  const analysisResult = useResumeStore(state => state.analysisResult);
  const resumeData = useResumeStore(state => state.resumeData);
  const isLoading = useResumeStore(state => state.isLoading);
  const error = useResumeStore(state => state.error);

  const [activeTab, setActiveTab] = useState<'upload' | 'results'>(
    analysisResult ? 'results' : 'upload'
  );

  // Update activeTab when analysisResult changes
  useEffect(() => {
    if (analysisResult) {
      setActiveTab('results');
    }
  }, [analysisResult]);

  const {
    setAnalysisResult,
    setResumeData,
    setExtractedDataBackup,
    setError,
    setLoading,
    clearAnalysisData,
  } = useResumeActions();

  // Progress tracking
  const {
    progress,
    startAnalysis,
    completeAnalysis,
    setError: setProgressError,
  } = useAnalysisProgress();

  // Handle file upload and parse to ResumeData directly
  const handleFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setFile(file);
      setLoading(true);
      setError(null);

      // Use the new endpoint that returns ResumeData directly
      const result = await atsApi.uploadFile(file);

      if (result.success && result.data) {
        // Clean the data using ResumeDataUtils (backend already does most cleaning)
        const cleanedData = ResumeDataUtils.cleanResumeData(result.data);

        // Set the cleaned ResumeData directly in the store
        setResumeData(cleanedData);
        setExtractedDataBackup(cleanedData);

        toast.success('Resume uploaded and parsed successfully!');
      } else {
        throw new Error(result.message || 'Failed to parse resume');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload resume';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle ATS analysis with job description
  const handleAnalysis = async (jobDescription: string) => {
    if (!file) {
      toast.error('Please upload a resume first');
      return;
    }

    try {
      startAnalysis();
      setError(null);

      // Perform ATS analysis
      const result = await atsApi.analyzeResumeWithJobDescription(
        file,
        jobDescription
      );

      if (result.success && result.data) {
        // Convert backend response to AnalysisResult format
        const analysisResult: AnalysisResult = {
          jobType: result.data.match_category || 'Unknown',
          atsScore: result.data.ats_score || 0,
          keywordMatches: result.data.keyword_matches || [],
          missingKeywords: result.data.missing_keywords || [],
          suggestions: result.data.suggestions || [],
          strengths: result.data.strengths || [],
          weaknesses: result.data.weaknesses || [],
          wordCount: result.data.word_count || 0,
          characterCount: result.data.word_count * 5 || 0, // Rough estimate
          keywordDensity: {}, // TODO: Calculate keyword density from backend data
          detailed_scores: {
            keyword_score: result.data.detailed_scores?.keyword_score || 0,
            semantic_score: result.data.detailed_scores?.semantic_score || 0,
            format_score: result.data.detailed_scores?.format_score || 0,
            content_score: result.data.detailed_scores?.content_score || 0,
            ats_score: result.data.detailed_scores?.ats_score || 0,
          },
        };

        setAnalysisResult(analysisResult);
        completeAnalysis();
        toast.success('ATS analysis completed successfully!');
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      setProgressError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Clear all data
  const handleClearData = () => {
    clearAnalysisData();
    setFile(null);
    setActiveTab('upload');
    toast.success('Data cleared successfully');
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
      <UnifiedWelcomeBar currentPage='ats-checker' />

      <main className='container mx-auto px-4 py-8'>
        <Section className='mb-8'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold text-gray-900 mb-4'>
              ATS Resume Checker
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Get your resume analyzed for ATS compatibility across all job
              profiles. Receive detailed feedback and optimization suggestions.
            </p>
          </div>

          {/* Action buttons */}
          <div className='flex flex-wrap gap-4 justify-center mb-8'>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              📄 Upload New Resume
            </button>

            {resumeData && (
              <button
                onClick={() => setActiveTab('results')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'results'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                📊 Analysis Results
              </button>
            )}
          </div>

          {/* Error display */}
          {error && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
              <p className='text-red-800'>{error}</p>
            </div>
          )}

          {/* Tab content */}
          {activeTab === 'upload' && (
            <div className='max-w-2xl mx-auto'>
              <FileUpload
                onFileUpload={handleFileUpload}
                loading={isLoading}
                accept={'.pdf,.docx,.doc,.txt'}
                maxSize={10 * 1024 * 1024} // 10MB
              />

              {resumeData && (
                <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg'>
                  <h3 className='text-lg font-semibold text-green-800 mb-2'>
                    ✅ Resume Parsed Successfully!
                  </h3>
                  <p className='text-green-700 mb-4'>
                    Your resume has been parsed and is ready for ATS analysis.
                  </p>
                  <div className='flex gap-4'>
                    <button
                      onClick={() => setActiveTab('results')}
                      className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                    >
                      View Parsed Data
                    </button>
                    <button
                      onClick={handleClearData}
                      className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                    >
                      Clear Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && resumeData && (
            <div className='space-y-6'>
              {/* ATS Analysis Section */}
              <ATSAnalysis
                file={file!}
                onAnalyze={handleAnalysis}
                error={error}
                progress={progress}
              />

              {/* Results Display */}
              {analysisResult && <ResultsDisplay result={analysisResult} />}
            </div>
          )}
        </Section>
      </main>
    </div>
  );
}
