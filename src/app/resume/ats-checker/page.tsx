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

    setError(null);

    try {
      const result = await analyzeResumeWithBackend(file, jobDescription);

      // Store result in sessionStorage and redirect to results page
      sessionStorage.setItem('ats_analysis_result', JSON.stringify(result));
      router.push('/resume/ats-checker/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
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
          // Enhanced analysis data
          ats_compatibility: apiResult.data.ats_compatibility || undefined,
          format_analysis: apiResult.data.format_analysis || undefined,
          detailed_scores: apiResult.data.detailed_scores || undefined,
          semantic_similarity: apiResult.data.semantic_similarity || undefined,
          match_category: apiResult.data.match_category || undefined,
          ats_friendly: apiResult.data.ats_friendly || undefined,
          formatting_issues: apiResult.data.formatting_issues || undefined,
          structured_experience:
            apiResult.data.structured_experience || undefined,
        };
      } else {
        // Quick analysis - backend will generate specific JD based on detected job type
        const formData = new FormData();
        formData.append('file', file);
        formData.append(
          'job_description',
          'Quick Analysis - AI will generate specific job description'
        );

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

        // Return analysis with AI-generated specific job description
        const detectedJob = apiResult.data.detected_job_type
          ? `${apiResult.data.detected_job_type} (${Math.round((apiResult.data.job_detection_confidence || 0) * 100)}% confidence)`
          : 'General Analysis';

        return {
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
            apiResult.data.extraction_details?.full_resume_text?.length || 0,
          extraction_details: apiResult.data.extraction_details,
          // Enhanced analysis data
          ats_compatibility: apiResult.data.ats_compatibility || undefined,
          format_analysis: apiResult.data.format_analysis || undefined,
          detailed_scores: apiResult.data.detailed_scores || undefined,
          semantic_similarity: apiResult.data.semantic_similarity || undefined,
          match_category: apiResult.data.match_category || undefined,
          ats_friendly: apiResult.data.ats_friendly || undefined,
          formatting_issues: apiResult.data.formatting_issues || undefined,
          structured_experience:
            apiResult.data.structured_experience || undefined,
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
