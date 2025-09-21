'use client';

import { useState } from 'react';

import { ATSAnalysis } from '@/components/resume/ATSAnalysis';
import { FileUpload } from '@/components/resume/FileUpload';
import { ResultsDisplay } from '@/components/resume/ResultsDisplay';
import { Section } from '@/components/ui/Section';
import { AnalysisResult } from '@/lib/ats/analyzer';

export default function ATSCheckerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Call our Python backend API
      const result = await analyzeResumeWithBackend(file);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeResumeWithBackend = async (
    file: File
  ): Promise<AnalysisResult> => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Call Python backend API
      const response = await fetch('http://localhost:8000/api/upload/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResult = await response.json();

      if (!apiResult.success) {
        throw new Error(apiResult.message || 'Failed to parse file');
      }

      // Return real analysis results from Python backend
      return {
        jobType: apiResult.data.job_type,
        atsScore: apiResult.data.ats_score,
        keywordMatches: apiResult.data.keyword_matches,
        missingKeywords: apiResult.data.missing_keywords,
        suggestions: apiResult.data.suggestions,
        strengths: apiResult.data.strengths,
        weaknesses: apiResult.data.weaknesses,
        keywordDensity: apiResult.data.keyword_density,
        wordCount: apiResult.data.word_count,
        characterCount: apiResult.data.character_count,
      };
    } catch {
      // Backend API error - show user-friendly message
      throw new Error(
        'Failed to connect to analysis server. Please try again.'
      );
    }
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <Section id='ats-checker' className='py-20'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              ATS Resume Checker
            </h1>
            <p className='text-xl text-gray-300 max-w-2xl mx-auto'>
              Get your resume analyzed for ATS compatibility across all job
              profiles. Receive detailed feedback and optimization suggestions.
            </p>
          </div>

          {/* File Upload Section */}
          <div className='mb-8'>
            <FileUpload onFileUpload={handleFileUpload} />
          </div>

          {/* Analysis Section */}
          {file && (
            <div className='mb-8'>
              <ATSAnalysis
                file={file}
                onAnalyze={handleAnalysis}
                isAnalyzing={isAnalyzing}
                error={error}
              />
            </div>
          )}

          {/* Results Section */}
          {analysisResult && (
            <div>
              <ResultsDisplay result={analysisResult} />
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
