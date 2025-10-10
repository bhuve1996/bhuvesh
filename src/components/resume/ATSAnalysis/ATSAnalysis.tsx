'use client';

import React, { useState } from 'react';

import { AnimatedProgress, Button, Card } from '@/components/ui';
import type { AnalysisProgress } from '@/hooks/useAnalysisProgress';

interface ATSAnalysisProps {
  file: File;
  onAnalyze: (jobDescription: string) => void;
  error: string | null;
  progress: AnalysisProgress;
}

export const ATSAnalysis: React.FC<ATSAnalysisProps> = ({
  file,
  onAnalyze,
  error: _error,
  progress,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [showJDInput, setShowJDInput] = useState(false);
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 50 && showJDInput) {
      alert('Please provide a job description of at least 50 characters');
      return;
    }

    // Hide the analysis form when analysis starts
    setHasStartedAnalysis(true);

    // Simply call the parent's analysis function
    // Progress tracking is now handled by the parent component
    onAnalyze(jobDescription);
  };

  return (
    <div className='space-y-6'>
      {/* Progress Steps */}
      {(progress.isAnalyzing ||
        progress.error ||
        (progress.steps.some(step => step.status === 'completed') &&
          !progress.isAnalyzing)) && (
        <Card className='p-6'>
          <div className='text-center mb-6'>
            <h3 className='text-xl font-bold text-white mb-2'>
              {progress.error
                ? 'Analysis Failed'
                : progress.isAnalyzing
                  ? 'Analyzing Your Resume'
                  : 'Analysis Complete!'}
            </h3>
            <p className='text-gray-400 mb-4'>
              {progress.error
                ? 'There was an error processing your resume. Please try again.'
                : progress.isAnalyzing
                  ? 'Please wait while we process your resume...'
                  : 'Your resume has been successfully analyzed!'}
            </p>

            {/* Progress Percentage */}
            {!progress.error && (
              <div className='mb-4'>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    progress.isAnalyzing ? 'text-cyan-400' : 'text-green-400'
                  }`}
                >
                  {progress.isAnalyzing
                    ? Math.round(
                        (progress.currentStep / (progress.steps.length - 1)) *
                          100
                      )
                    : 100}
                  %
                </div>
                <div className='w-full bg-gray-700 rounded-full h-3'>
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${
                      progress.isAnalyzing
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500'
                        : 'bg-gradient-to-r from-green-400 to-emerald-500'
                    }`}
                    style={{
                      width: `${
                        progress.isAnalyzing
                          ? (progress.currentStep /
                              (progress.steps.length - 1)) *
                            100
                          : 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {progress.error && (
              <div className='mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
                <p className='text-red-400'>{progress.error}</p>
              </div>
            )}
          </div>
          <AnimatedProgress
            steps={progress.steps}
            currentStep={progress.currentStep}
            className='mb-6'
          />
        </Card>
      )}

      {/* Analysis Form - Hide after analysis starts */}
      {!hasStartedAnalysis && (
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
      )}
    </div>
  );
};
