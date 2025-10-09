'use client';

import React from 'react';

import { Card } from '@/components/ui/Card';
import type { AnalysisResult } from '@/types/ats';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onTryAgain?: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-2 text-white'>
          Analysis Complete
        </h2>
        <p className='text-gray-300'>
          Detected job type:{' '}
          <span className='text-cyan-400 font-medium'>{result.jobType}</span>
        </p>
      </div>

      {/* Enhanced ATS Score Display */}
      <Card className='p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-4 text-white'>
            ATS Compatibility Score
          </h3>
          <div
            className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreBgColor(result.atsScore)}`}
          >
            <span
              className={`text-4xl font-bold ${getScoreColor(result.atsScore)}`}
            >
              {result.atsScore}
            </span>
          </div>
          <p className='text-gray-300 mt-4'>
            {result.atsScore >= 80 &&
              'Excellent! Your resume is highly ATS-compatible.'}
            {result.atsScore >= 60 &&
              result.atsScore < 80 &&
              'Good! Your resume has good ATS compatibility with room for improvement.'}
            {result.atsScore < 60 &&
              result.atsScore >= 0 &&
              'Your resume needs improvements for better ATS compatibility.'}
          </p>

          {/* Enhanced Analysis Grades */}
          {result.ats_compatibility && (
            <div className='mt-6 grid grid-cols-2 gap-4'>
              <div className='text-center'>
                <p className='text-sm text-gray-400 mb-1'>ATS Compatibility</p>
                <p className='text-lg font-semibold text-cyan-400'>
                  {result.ats_compatibility.grade || 'N/A'}
                </p>
              </div>
              <div className='text-center'>
                <p className='text-sm text-gray-400 mb-1'>Format Structure</p>
                <p className='text-lg font-semibold text-blue-400'>
                  {result.format_analysis?.grade || 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Keyword Analysis */}
      {(result.keywordMatches.length > 0 ||
        result.missingKeywords.length > 0) && (
        <div className='grid md:grid-cols-2 gap-6'>
          {/* Matched Keywords */}
          {result.keywordMatches.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-xl font-bold mb-4 text-green-400'>
                ✅ Matched Keywords
              </h3>
              <div className='flex flex-wrap gap-2'>
                {result.keywordMatches.map((keyword, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30'
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Missing Keywords */}
          {result.missingKeywords.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-xl font-bold mb-4 text-red-400'>
                ❌ Missing Keywords
              </h3>
              <div className='flex flex-wrap gap-2'>
                {result.missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30'
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Strengths and Weaknesses */}
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Strengths */}
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-green-400'>
            💪 Strengths
          </h3>
          <ul className='space-y-2'>
            {result.strengths.map((strength, index) => (
              <li key={index} className='flex items-start space-x-2'>
                <span className='text-green-400 mt-1'>•</span>
                <span className='text-gray-300'>{strength}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Weaknesses */}
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-red-400'>
            ⚠️ Areas for Improvement
          </h3>
          <ul className='space-y-2'>
            {result.weaknesses.map((weakness, index) => (
              <li key={index} className='flex items-start space-x-2'>
                <span className='text-red-400 mt-1'>•</span>
                <span className='text-gray-300'>{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Enhanced ATS Compatibility Analysis */}
      {result.ats_compatibility && (
        <div className='grid md:grid-cols-2 gap-6'>
          {/* ATS Issues & Warnings */}
          <Card className='p-6'>
            <h3 className='text-xl font-bold mb-4 text-orange-400'>
              ⚠️ ATS Compatibility Issues
            </h3>
            <div className='space-y-4'>
              {/* Critical Issues */}
              {result.ats_compatibility.issues?.length > 0 && (
                <div>
                  <h4 className='text-red-400 font-semibold mb-2'>
                    Critical Issues:
                  </h4>
                  <ul className='space-y-2'>
                    {result.ats_compatibility.issues.map(
                      (issue: string, index: number) => (
                        <li key={index} className='flex items-start space-x-2'>
                          <span className='text-red-400 mt-1'>•</span>
                          <span className='text-gray-300 text-sm'>{issue}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {result.ats_compatibility.warnings?.length > 0 && (
                <div>
                  <h4 className='text-yellow-400 font-semibold mb-2'>
                    Warnings:
                  </h4>
                  <ul className='space-y-2'>
                    {result.ats_compatibility.warnings.map(
                      (warning: string, index: number) => (
                        <li key={index} className='flex items-start space-x-2'>
                          <span className='text-yellow-400 mt-1'>•</span>
                          <span className='text-gray-300 text-sm'>
                            {warning}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </Card>

          {/* ATS Recommendations */}
          <Card className='p-6'>
            <h3 className='text-xl font-bold mb-4 text-green-400'>
              ✅ ATS Optimization Tips
            </h3>
            <ul className='space-y-2'>
              {result.ats_compatibility.recommendations?.map(
                (rec: string, index: number) => (
                  <li key={index} className='flex items-start space-x-2'>
                    <span className='text-green-400 mt-1'>•</span>
                    <span className='text-gray-300 text-sm'>{rec}</span>
                  </li>
                )
              )}
            </ul>
          </Card>
        </div>
      )}

      {/* Format Analysis Details */}
      {result.format_analysis && (
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-blue-400'>
            📋 Resume Structure Analysis
          </h3>
          <div className='grid md:grid-cols-3 gap-4 mb-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-blue-400'>
                {result.format_analysis.sections_found || 0}
              </p>
              <p className='text-sm text-gray-400'>Required Sections</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-green-400'>
                {result.format_analysis.optional_sections_found || 0}
              </p>
              <p className='text-sm text-gray-400'>Optional Sections</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-cyan-400'>
                {result.format_analysis.section_headers_count || 0}
              </p>
              <p className='text-sm text-gray-400'>Section Headers</p>
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-gray-300'>
              <span className='text-blue-400 font-semibold'>Contact Info:</span>{' '}
              {result.format_analysis.contact_completeness || 'N/A'}
            </p>
            <p className='text-gray-300'>
              <span className='text-blue-400 font-semibold'>
                Professional Summary:
              </span>{' '}
              {result.format_analysis.has_professional_summary
                ? '✅ Present'
                : '❌ Missing'}
            </p>
          </div>
        </Card>
      )}

      {/* Suggestions */}
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-cyan-400'>
          💡 Optimization Suggestions
        </h3>
        <ul className='space-y-3'>
          {result.suggestions.map((suggestion, index) => (
            <li key={index} className='flex items-start space-x-3'>
              <span className='text-cyan-400 mt-1'>→</span>
              <span className='text-gray-300'>{suggestion}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className='text-center space-x-4'>
        <button className='px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all font-medium'>
          Download Report
        </button>
        <button className='px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-all font-medium'>
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
};
