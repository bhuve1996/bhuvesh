'use client';

import React from 'react';

import { Card } from '@/components/ui/Card';
import type { AnalysisResult } from '@/types';

interface AnalysisDataDisplayProps {
  result: AnalysisResult;
}

export const AnalysisDataDisplay: React.FC<AnalysisDataDisplayProps> = ({
  result,
}) => {
  return (
    <div className='space-y-6'>
      {/* Keyword Analysis */}
      {(result.keywordMatches.length > 0 ||
        result.missingKeywords.length > 0) && (
        <div className='grid md:grid-cols-3 gap-6'>
          {/* Matched Keywords */}
          {result.keywordMatches.length > 0 && (
            <Card className='p-6'>
              <h3 className='text-xl font-bold mb-4 text-success-400'>
                ✅ Matched Keywords ({result.keywordMatches.length})
              </h3>
              <div className='flex flex-wrap gap-2'>
                {result.keywordMatches.map((keyword, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-success-500/20 text-success-400 rounded-full text-sm border border-success-500/30'
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
              <h3 className='text-xl font-bold mb-4 text-error-400'>
                ❌ Missing Keywords ({result.missingKeywords.length})
              </h3>
              <div className='flex flex-wrap gap-2'>
                {result.missingKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className='px-3 py-1 bg-error-500/20 text-error-400 rounded-full text-sm border border-error-500/30'
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
        <div className='grid md:grid-cols-3 gap-6'>
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

      {/* Formatting Issues */}
      {result.formatting_issues && result.formatting_issues.length > 0 && (
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-orange-400'>
            🔧 Formatting Issues
          </h3>
          <ul className='space-y-2'>
            {result.formatting_issues.map((issue, index) => (
              <li key={index} className='flex items-start space-x-2'>
                <span className='text-orange-400 mt-1'>⚠️</span>
                <span className='text-gray-300'>{issue}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Resume Statistics */}
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-blue-400'>
          📊 Resume Statistics
        </h3>
        <div className='grid grid-cols-3 md:grid-cols-5 gap-4'>
          <div className='text-center'>
            <p className='text-sm text-gray-400 mb-1'>Word Count</p>
            <p className='text-lg font-semibold text-blue-400'>
              {result.wordCount}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-gray-400 mb-1'>Character Count</p>
            <p className='text-lg font-semibold text-green-400'>
              {result.characterCount}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-gray-400 mb-1'>Keyword Matches</p>
            <p className='text-lg font-semibold text-cyan-400'>
              {result.keywordMatches.length}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-sm text-gray-400 mb-1'>Missing Keywords</p>
            <p className='text-lg font-semibold text-red-400'>
              {result.missingKeywords.length}
            </p>
          </div>
        </div>
      </Card>

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
    </div>
  );
};

export default AnalysisDataDisplay;
