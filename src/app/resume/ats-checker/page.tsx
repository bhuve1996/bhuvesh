'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ATSAnalysis } from '@/components/resume/ATSAnalysis';
import { FileUpload } from '@/components/resume/FileUpload';
import { ResultsDisplay } from '@/components/resume/ResultsDisplay';
import { Section } from '@/components/ui/Section';
import type { AnalysisResult, ATSAnalysisBackendResponse } from '@/types/ats';

// Note: Metadata is defined in layout.tsx

export default function ATSCheckerPage() {
  const router = useRouter();
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

  const handleAnalysis = async (jobDescription: string) => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeResumeWithBackend(file, jobDescription);

      // Store result in sessionStorage and redirect to results page
      sessionStorage.setItem('ats_analysis_result', JSON.stringify(result));
      router.push('/resume/ats-checker/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setIsAnalyzing(false);
    }
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
        const detectedJob = apiResult.data.detected_job_type
          ? `${apiResult.data.detected_job_type} (${Math.round((apiResult.data.job_detection_confidence || 0) * 100)}% confidence)`
          : 'General Analysis';

        return {
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
            apiResult.data.extraction_details?.full_resume_text?.length || 0,
          extraction_details: apiResult.data.extraction_details,
        };
      } else {
        // Basic analysis without job description - use generic job description
        const formData = new FormData();
        formData.append('file', file);

        // Create a generic job description for basic analysis
        const genericJD = `Professional role requiring:
- Strong communication and collaboration skills
- Problem-solving abilities
- Relevant experience in your field
- Technical or domain expertise
- Ability to work independently and in teams
- Attention to detail
- Project management capabilities`;

        formData.append('job_description', genericJD);

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

        // Return basic analysis with note about improving with JD
        const detectedJob = apiResult.data.detected_job_type
          ? `${apiResult.data.detected_job_type} (${Math.round((apiResult.data.job_detection_confidence || 0) * 100)}% confidence)`
          : 'General Analysis';

        return {
          jobType: detectedJob,
          atsScore: apiResult.data.ats_score,
          keywordMatches: apiResult.data.keyword_matches || [],
          missingKeywords: [],
          suggestions: [
            '💡 Add a specific job description for more accurate analysis',
            '🎯 Enable job description comparison above for semantic matching',
            '📊 Get tailored keyword suggestions from the actual job posting',
            ...(apiResult.data.suggestions || []),
          ],
          strengths: apiResult.data.strengths || [],
          weaknesses: apiResult.data.weaknesses || [],
          keywordDensity: {},
          wordCount: apiResult.data.word_count || 0,
          characterCount:
            apiResult.data.extraction_details?.full_resume_text?.length || 0,
          extraction_details: apiResult.data.extraction_details,
        };
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
