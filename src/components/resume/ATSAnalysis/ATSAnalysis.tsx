'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { useAnalysisProgress } from '@/hooks/useAnalysisProgress';

interface ATSAnalysisProps {
  file: File;
  onAnalyze: (jobDescription: string) => void;
  error: string | null;
}

export const ATSAnalysis: React.FC<ATSAnalysisProps> = ({
  file,
  onAnalyze,
  error: _error,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [showJDInput, setShowJDInput] = useState(false);
  const {
    progress,
    startAnalysis,
    updateStep,
    completeStep,
    completeAnalysis,
  } = useAnalysisProgress();

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 50 && showJDInput) {
      alert('Please provide a job description of at least 50 characters');
      return;
    }

    startAnalysis();

    // Simulate progress steps
    try {
      // Step 1: Upload
      updateStep(0, 'active');
      await new Promise(resolve => setTimeout(resolve, 1000));
      completeStep(0);

      // Step 2: Parsing
      updateStep(1, 'active');
      await new Promise(resolve => setTimeout(resolve, 1500));
      completeStep(1);

      // Step 3: Analyzing
      updateStep(2, 'active');
      await new Promise(resolve => setTimeout(resolve, 2000));
      completeStep(2);

      // Step 4: Results
      updateStep(3, 'active');
      await new Promise(resolve => setTimeout(resolve, 1000));
      completeStep(3);

      // Complete analysis
      completeAnalysis();
      onAnalyze(jobDescription);
    } catch {
      // Error handling is managed by the parent component
    }
  };

  return (
    <div className='space-y-6'>
      {/* Progress Steps */}
      {progress.isAnalyzing && (
        <Card className='p-6'>
          <div className='text-center mb-6'>
            <h3 className='text-xl font-bold text-white mb-2'>
              Analyzing Your Resume
            </h3>
            <p className='text-gray-400'>
              Please wait while we process your resume...
            </p>
          </div>
          <ProgressSteps
            steps={progress.steps}
            currentStep={progress.currentStep}
            className='mb-6'
          />
        </Card>
      )}

      {/* Analysis Form */}
      <Card className='p-6'>
        <div>
          <h3 className='text-xl font-bold mb-4 text-white'>
            Ready to Analyze
          </h3>
          <p className='text-gray-300 mb-6'>
            Your resume{' '}
            <span className='text-cyan-400 font-medium'>{file.name}</span> is
            ready for analysis.
          </p>

          {/* Job Description Toggle */}
          <div className='mb-6'>
            <label className='flex items-center space-x-2 text-gray-300 cursor-pointer'>
              <input
                type='checkbox'
                checked={showJDInput}
                onChange={e => setShowJDInput(e.target.checked)}
                className='w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500'
              />
              <span>
                Compare with specific job description (recommended for best
                results)
              </span>
            </label>
          </div>

          {/* Job Description Input */}
          {showJDInput && (
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Job Description
                <span className='text-xs text-gray-500 ml-2'>
                  (paste the full job posting)
                </span>
              </label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={8}
                placeholder='Paste the job description here...

Example:
Software Engineer - Full Stack Developer

Requirements:
- 3+ years of experience in software development
- Strong proficiency in JavaScript, TypeScript, Python
- Experience with React, Node.js, and modern web frameworks
- Knowledge of SQL databases
- Experience with AWS, Docker, Kubernetes'
                className='w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none'
              />
              <p className='text-xs text-gray-500 mt-1'>
                {jobDescription.length} characters (minimum 50 recommended)
              </p>
            </div>
          )}

          {_error && (
            <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
              <p className='text-red-400'>{_error}</p>
            </div>
          )}

          <div className='text-center'>
            <Button
              onClick={handleAnalyze}
              disabled={progress.isAnalyzing}
              className='px-8 py-3 text-lg'
            >
              {progress.isAnalyzing ? (
                <div className='flex items-center space-x-2'>
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>Analyzing with AI...</span>
                </div>
              ) : (
                <span>
                  {showJDInput
                    ? 'Analyze with Job Description'
                    : 'Quick Analysis'}
                </span>
              )}
            </Button>

            {progress.isAnalyzing && (
              <div className='mt-6'>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500'
                    style={{
                      width: `${(progress.currentStep / (progress.steps.length - 1)) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className='text-sm text-gray-400 mt-2'>
                  {progress.steps[progress.currentStep]?.description ||
                    'Processing...'}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
