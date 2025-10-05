'use client';

import React, { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ATSAnalysisProps {
  file: File;
  onAnalyze: (jobDescription: string) => void;
  isAnalyzing: boolean;
  error: string | null;
}

export const ATSAnalysis: React.FC<ATSAnalysisProps> = ({
  file,
  onAnalyze,
  isAnalyzing,
  error,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [showJDInput, setShowJDInput] = useState(false);

  const handleAnalyze = () => {
    if (jobDescription.trim().length < 50 && showJDInput) {
      alert('Please provide a job description of at least 50 characters');
      return;
    }
    onAnalyze(jobDescription);
  };

  return (
    <Card className='p-6'>
      <div>
        <h3 className='text-xl font-bold mb-4 text-white'>Ready to Analyze</h3>
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

        {error && (
          <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        <div className='text-center'>
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className='px-8 py-3 text-lg'
          >
            {isAnalyzing ? (
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

          {isAnalyzing && (
            <div className='mt-6'>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div className='bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full animate-pulse'></div>
              </div>
              <p className='text-sm text-gray-400 mt-2'>
                {showJDInput
                  ? '🧠 Using semantic AI matching to compare your resume...'
                  : 'Analyzing your resume for ATS compatibility...'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
