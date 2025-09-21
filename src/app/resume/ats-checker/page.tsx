'use client';

import { useState } from 'react';

import { ATSAnalysis } from '@/components/resume/ATSAnalysis';
import { FileUpload } from '@/components/resume/FileUpload';
import { ResultsDisplay } from '@/components/resume/ResultsDisplay';
import { Section } from '@/components/ui/Section';
import { AnalysisResult, analyzeResume } from '@/lib/ats/analyzer';

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
      const result = await analyzeResume(file);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
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
