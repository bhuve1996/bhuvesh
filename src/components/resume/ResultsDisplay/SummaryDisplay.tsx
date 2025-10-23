import React from 'react';

import { Card, SectionSeparator } from '@/components/ui';
import type { AnalysisResult } from '@/types';

interface SummaryDisplayProps {
  result: AnalysisResult;
}

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 80) return 'A';
    if (score >= 60) return 'B';
    if (score >= 40) return 'C';
    return 'D';
  };

  return (
    <div className='space-y-6'>
      {/* Overall Score Card */}
      <Card className='p-6'>
        <div className='text-center mb-6'>
          <h3 className='text-2xl font-bold mb-2 text-foreground'>
            🎯 Overall ATS Score
          </h3>
          <div className='flex items-center justify-center space-x-4'>
            <div
              className={`text-6xl font-bold ${getScoreColor(result.atsScore)}`}
            >
              {result.atsScore}
            </div>
            <div className='text-center'>
              <div
                className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}
              >
                {getScoreGrade(result.atsScore)}
              </div>
              <div className='text-sm text-slate-500 dark:text-slate-400'>
                Grade
              </div>
            </div>
          </div>
          <p className='text-lg text-slate-600 dark:text-slate-400 mt-4'>
            {result.atsScore >= 80 &&
              '🎉 Excellent! Your resume is highly ATS-compatible.'}
            {result.atsScore >= 60 &&
              result.atsScore < 80 &&
              '👍 Good! Your resume has solid ATS compatibility.'}
            {result.atsScore >= 40 &&
              result.atsScore < 60 &&
              '⚠️ Fair. Your resume needs some improvements.'}
            {result.atsScore < 40 &&
              '🔧 Your resume needs significant improvements for ATS compatibility.'}
          </p>
        </div>
      </Card>

      <SectionSeparator variant='dots' spacing='md' color='primary' />

      {/* Quick Stats Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <Card className='p-4 text-center'>
          <div className='text-2xl font-bold text-blue-400 mb-1'>
            {result.wordCount}
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400'>
            Words
          </div>
        </Card>
        <Card className='p-4 text-center'>
          <div className='text-2xl font-bold text-green-400 mb-1'>
            {result.keywordMatches.length}
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400'>
            Keywords Found
          </div>
        </Card>
        <Card className='p-4 text-center'>
          <div className='text-2xl font-bold text-red-400 mb-1'>
            {result.missingKeywords.length}
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400'>
            Missing Keywords
          </div>
        </Card>
        <Card className='p-4 text-center'>
          <div className='text-2xl font-bold text-purple-400 mb-1'>
            {result.format_analysis?.sections_found || 0}/3
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400'>
            Required Sections
          </div>
        </Card>
      </div>

      <SectionSeparator variant='gradient' spacing='lg' color='muted' />

      {/* Key Insights */}
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-cyan-400'>
          🔍 Key Insights
        </h3>
        <div className='space-y-4'>
          {/* Contact Info Status */}
          <div className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg'>
            <span className='text-slate-700 dark:text-slate-300'>
              Contact Information
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.format_analysis?.contact_completeness?.includes('2/2')
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-orange-500/20 text-orange-400'
              }`}
            >
              {result.format_analysis?.contact_completeness || 'Unknown'}
            </span>
          </div>

          {/* Professional Summary Status */}
          <div className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg'>
            <span className='text-slate-700 dark:text-slate-300'>
              Professional Summary
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.format_analysis?.has_professional_summary
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {result.format_analysis?.has_professional_summary
                ? 'Present'
                : 'Missing'}
            </span>
          </div>

          {/* Content Length Status */}
          <div className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg'>
            <span className='text-slate-700 dark:text-slate-300'>
              Content Length
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.wordCount >= 300 && result.wordCount <= 800
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-orange-500/20 text-orange-400'
              }`}
            >
              {result.wordCount < 300
                ? 'Too Short'
                : result.wordCount > 800
                  ? 'Too Long'
                  : 'Optimal'}
            </span>
          </div>

          {/* Job Type */}
          <div className='flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-lg'>
            <span className='text-slate-700 dark:text-slate-300'>
              Detected Job Type
            </span>
            <span className='px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium'>
              {result.jobType || 'Software Engineer'}
            </span>
          </div>
        </div>
      </Card>

      {/* Top Recommendations */}
      {result.suggestions && result.suggestions.length > 0 && (
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-yellow-400'>
            💡 Top Recommendations
          </h3>
          <ul className='space-y-2'>
            {result.suggestions.slice(0, 3).map((suggestion, index) => (
              <li key={index} className='flex items-start space-x-3'>
                <span className='text-yellow-400 mt-1'>{index + 1}.</span>
                <span className='text-slate-500 dark:text-slate-300'>
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default SummaryDisplay;
