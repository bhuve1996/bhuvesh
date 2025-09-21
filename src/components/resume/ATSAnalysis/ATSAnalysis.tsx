'use client';

import React from 'react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ATSAnalysisProps {
  file: File;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  error: string | null;
}

export const ATSAnalysis: React.FC<ATSAnalysisProps> = ({
  file,
  onAnalyze,
  isAnalyzing,
  error,
}) => {
  return (
    <Card className='p-6'>
      <div className='text-center'>
        <h3 className='text-xl font-bold mb-4 text-white'>Ready to Analyze</h3>
        <p className='text-gray-300 mb-6'>
          Your resume{' '}
          <span className='text-cyan-400 font-medium'>{file.name}</span> is
          ready for ATS analysis.
        </p>

        {error && (
          <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className='px-8 py-3 text-lg'
        >
          {isAnalyzing ? (
            <div className='flex items-center space-x-2'>
              <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Analyzing Resume...</span>
            </div>
          ) : (
            'Start ATS Analysis'
          )}
        </Button>

        {isAnalyzing && (
          <div className='mt-6'>
            <div className='w-full bg-gray-700 rounded-full h-2'>
              <div className='bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full animate-pulse'></div>
            </div>
            <p className='text-sm text-gray-400 mt-2'>
              Analyzing your resume for ATS compatibility...
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
