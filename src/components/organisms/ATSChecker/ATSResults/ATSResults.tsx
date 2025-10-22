import React from 'react';

import type { AnalysisResult } from '@/types';

import { Button } from '../../../atoms/Button/Button';
import { Card } from '../../../ui/Card/Card';

interface ATSResultsProps {
  result: AnalysisResult;
  onTryAgain: () => void;
  onNewUpload: () => void;
}

export const ATSResults: React.FC<ATSResultsProps> = ({
  result,
  onTryAgain,
  onNewUpload,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-400';
    if (score >= 60) return 'text-warning-400';
    return 'text-error-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  return (
    <div className='space-y-6'>
      {/* Score Display */}
      <Card className='p-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-2'>ATS Analysis Results</h2>
          <div
            className={`text-6xl font-bold ${getScoreColor(result.atsScore)}`}
          >
            {result.atsScore}
          </div>
          <div className='text-xl text-muted-foreground mb-4'>
            Grade: {getScoreGrade(result.atsScore)}
          </div>
          <p className='text-muted-foreground'>Job Type: {result.jobType}</p>
        </div>
      </Card>

      {/* Keywords Analysis */}
      <div className='grid md:grid-cols-3 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4 text-green-600'>
            ✅ Matched Keywords ({result.keywordMatches.length})
          </h3>
          <div className='flex flex-wrap gap-2'>
            {result.keywordMatches.map((keyword, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm'
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4 text-red-600'>
            ❌ Missing Keywords ({result.missingKeywords.length})
          </h3>
          <div className='flex flex-wrap gap-2'>
            {result.missingKeywords.map((keyword, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-red-100 text-red-800 rounded-md text-sm'
              >
                {keyword}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Strengths and Weaknesses */}
      <div className='grid md:grid-cols-3 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4 text-green-600'>
            💪 Strengths
          </h3>
          <ul className='space-y-2'>
            {result.strengths.map((strength, index) => (
              <li key={index} className='flex items-start'>
                <span className='text-green-500 mr-2'>•</span>
                <span className='text-gray-700'>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4 text-red-600'>
            ⚠️ Areas for Improvement
          </h3>
          <ul className='space-y-2'>
            {result.weaknesses.map((weakness, index) => (
              <li key={index} className='flex items-start'>
                <span className='text-red-500 mr-2'>•</span>
                <span className='text-gray-700'>{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4 text-blue-600'>
          💡 Suggestions
        </h3>
        <ul className='space-y-2'>
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className='flex items-start'>
              <span className='text-blue-500 mr-2'>•</span>
              <span className='text-gray-700'>{suggestion}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className='flex justify-center space-x-4'>
        <Button variant='outline' onClick={onTryAgain}>
          Try Again
        </Button>
        <Button variant='primary' onClick={onNewUpload}>
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
};

export default ATSResults;
