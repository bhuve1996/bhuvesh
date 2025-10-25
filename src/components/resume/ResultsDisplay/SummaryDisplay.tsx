import React from 'react';

import { Card } from '@/components/ui';
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
    <div className='space-y-8'>
      {/* Overall Score Card */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl'></div>
        <Card className='relative p-8 border-2 border-cyan-500/20 shadow-2xl'>
          <div className='text-center'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-6'>
              <span className='text-2xl'>🎯</span>
            </div>
            <h3 className='text-2xl font-bold mb-6 text-foreground'>
              Overall ATS Score
            </h3>
            <div className='flex items-center justify-center space-x-6 mb-6'>
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
            <div className='max-w-md mx-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700'>
              <p className='text-lg text-slate-600 dark:text-slate-400'>
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
          </div>
        </Card>
      </div>

      {/* Section Divider */}
      <div className='relative flex items-center justify-center'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gradient-to-r from-transparent via-cyan-500/30 to-transparent'></div>
        </div>
        <div className='relative bg-background px-6'>
          <div className='flex items-center space-x-2 text-cyan-400'>
            <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
            <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
            <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
          </div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl blur-xl'></div>
        <div className='relative'>
          <div className='text-center mb-6'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-3'>
              <span className='text-xl'>📊</span>
            </div>
            <h3 className='text-xl font-bold text-foreground mb-2'>
              Quick Statistics
            </h3>
            <p className='text-sm text-muted-foreground'>
              Key metrics from your resume analysis
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <Card className='p-6 text-center border-2 border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:scale-105'>
              <div className='inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-3'>
                <span className='text-lg'>📝</span>
              </div>
              <div className='text-2xl font-bold text-blue-400 mb-1'>
                {result.wordCount}
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                Words
              </div>
            </Card>
            <Card className='p-6 text-center border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:scale-105'>
              <div className='inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-3'>
                <span className='text-lg'>✅</span>
              </div>
              <div className='text-2xl font-bold text-green-400 mb-1'>
                {result.keywordMatches.length}
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                Keywords Found
              </div>
            </Card>
            <Card className='p-6 text-center border-2 border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:scale-105'>
              <div className='inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-3'>
                <span className='text-lg'>❌</span>
              </div>
              <div className='text-2xl font-bold text-red-400 mb-1'>
                {result.missingKeywords.length}
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                Missing Keywords
              </div>
            </Card>
            <Card className='p-6 text-center border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 hover:scale-105'>
              <div className='inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-3'>
                <span className='text-lg'>📋</span>
              </div>
              <div className='text-2xl font-bold text-purple-400 mb-1'>
                {result.format_analysis?.sections_found || 0}/3
              </div>
              <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                Required Sections
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className='relative flex items-center justify-center'>
        <div className='absolute inset-0 flex items-center'>
          <div className='w-full border-t border-gradient-to-r from-transparent via-purple-500/30 to-transparent'></div>
        </div>
        <div className='relative bg-background px-6'>
          <div className='flex items-center space-x-2 text-purple-400'>
            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
            <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
          </div>
        </div>
      </div>

      {/* Key Insights Section */}
      <div className='relative'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-2xl blur-xl'></div>
        <Card className='relative p-8 border-2 border-cyan-500/20 shadow-xl'>
          <div className='text-center mb-6'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-3'>
              <span className='text-xl'>🔍</span>
            </div>
            <h3 className='text-xl font-bold text-foreground mb-2'>
              Key Insights
            </h3>
            <p className='text-sm text-muted-foreground'>
              Important findings from your resume analysis
            </p>
          </div>

          <div className='space-y-4'>
            {/* Contact Info Status */}
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center'>
                  <span className='text-sm'>📞</span>
                </div>
                <span className='text-slate-700 dark:text-slate-300 font-medium'>
                  Contact Information
                </span>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  result.format_analysis?.contact_completeness?.includes('2/2')
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                }`}
              >
                {result.format_analysis?.contact_completeness || 'Unknown'}
              </span>
            </div>

            {/* Professional Summary Status */}
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center'>
                  <span className='text-sm'>📝</span>
                </div>
                <span className='text-slate-700 dark:text-slate-300 font-medium'>
                  Professional Summary
                </span>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  result.format_analysis?.has_professional_summary
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {result.format_analysis?.has_professional_summary
                  ? 'Present'
                  : 'Missing'}
              </span>
            </div>

            {/* Content Length Status */}
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                  <span className='text-sm'>📏</span>
                </div>
                <span className='text-slate-700 dark:text-slate-300 font-medium'>
                  Content Length
                </span>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  result.wordCount >= 300 && result.wordCount <= 800
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
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
            <div className='flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-700'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center'>
                  <span className='text-sm'>🎯</span>
                </div>
                <span className='text-slate-700 dark:text-slate-300 font-medium'>
                  Detected Job Type
                </span>
              </div>
              <span className='px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30'>
                {result.jobType || 'Software Engineer'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Recommendations */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-2xl blur-xl'></div>
          <Card className='relative p-8 border-2 border-yellow-500/20 shadow-xl'>
            <div className='text-center mb-6'>
              <div className='inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-3'>
                <span className='text-xl'>💡</span>
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                Top Recommendations
              </h3>
              <p className='text-sm text-muted-foreground'>
                Key suggestions to improve your resume
              </p>
            </div>

            <div className='space-y-4'>
              {result.suggestions.slice(0, 3).map((suggestion, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-4 p-4 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl border border-yellow-200/50 dark:border-yellow-700/50'
                >
                  <div className='flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-bold text-white'>
                      {index + 1}
                    </span>
                  </div>
                  <p className='text-slate-700 dark:text-slate-300 leading-relaxed'>
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay;
