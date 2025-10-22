import React from 'react';

import { Card, Tabs } from '@/components/ui';
import type { AnalysisResult } from '@/types';

interface DetailedAnalyticsDisplayProps {
  result: AnalysisResult;
}

export const DetailedAnalyticsDisplay: React.FC<
  DetailedAnalyticsDisplayProps
> = ({ result }) => {
  // Structure & Format Tab Content
  const StructureContent = () => (
    <div className='space-y-6'>
      {/* Resume Structure & Contact Analysis */}
      {result.format_analysis && (
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-blue-400'>
            📋 Resume Structure & Contact Analysis
          </h3>

          {/* Key Metrics Grid */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
            <div className='text-center p-3 bg-blue-500/10 rounded-lg'>
              <p className='text-2xl font-bold text-blue-400'>
                {result.format_analysis.sections_found || 0}/3
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Required Sections
              </p>
            </div>
            <div className='text-center p-3 bg-green-500/10 rounded-lg'>
              <p className='text-2xl font-bold text-green-400'>
                {result.format_analysis.optional_sections_found || 0}
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Optional Sections
              </p>
            </div>
            <div className='text-center p-3 bg-cyan-500/10 rounded-lg'>
              <p className='text-2xl font-bold text-cyan-400'>
                {result.format_analysis.contact_completeness?.split('/')[0] ||
                  '0'}
                /2
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Contact Info
              </p>
            </div>
            <div className='text-center p-3 bg-purple-500/10 rounded-lg'>
              <p className='text-2xl font-bold text-purple-400'>
                {result.format_analysis.has_professional_summary ? '✅' : '❌'}
              </p>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                Summary
              </p>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/30 rounded'>
              <span className='text-slate-700 dark:text-slate-300'>
                Contact Information
              </span>
              <span className='text-slate-600 dark:text-slate-400'>
                {result.format_analysis.contact_completeness || 'N/A'}
              </span>
            </div>
            <div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/30 rounded'>
              <span className='text-slate-700 dark:text-slate-300'>
                Professional Summary
              </span>
              <span className='text-slate-600 dark:text-slate-400'>
                {result.format_analysis.has_professional_summary
                  ? 'Present'
                  : 'Missing'}
              </span>
            </div>
            <div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/30 rounded'>
              <span className='text-slate-700 dark:text-slate-300'>
                Section Headers
              </span>
              <span className='text-slate-600 dark:text-slate-400'>
                {result.format_analysis.section_headers_count || 0} detected
              </span>
            </div>
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
                <span className='text-slate-500 dark:text-slate-300'>
                  {issue}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );

  // Content & Keywords Tab Content
  const ContentContent = () => (
    <div className='space-y-6'>
      {/* Resume Statistics & Keywords */}
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-blue-400'>
          📊 Resume Statistics & Keywords
        </h3>

        {/* Content Metrics */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <div className='text-center p-3 bg-blue-500/10 rounded-lg'>
            <p className='text-2xl font-bold text-blue-400'>
              {result.wordCount}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400'>Words</p>
          </div>
          <div className='text-center p-3 bg-green-500/10 rounded-lg'>
            <p className='text-2xl font-bold text-green-400'>
              {result.characterCount}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Characters
            </p>
          </div>
          <div className='text-center p-3 bg-cyan-500/10 rounded-lg'>
            <p className='text-2xl font-bold text-cyan-400'>
              {result.keywordMatches.length}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Keywords Found
            </p>
          </div>
          <div className='text-center p-3 bg-red-500/10 rounded-lg'>
            <p className='text-2xl font-bold text-red-400'>
              {result.missingKeywords.length}
            </p>
            <p className='text-xs text-slate-500 dark:text-slate-400'>
              Missing
            </p>
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className='space-y-3'>
          <div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/30 rounded'>
            <span className='text-slate-700 dark:text-slate-300'>
              Keyword Match Rate
            </span>
            <span className='text-slate-600 dark:text-slate-400'>
              {result.keywordMatches.length > 0 ||
              result.missingKeywords.length > 0
                ? `${Math.round((result.keywordMatches.length / (result.keywordMatches.length + result.missingKeywords.length)) * 100)}%`
                : 'N/A'}
            </span>
          </div>
          <div className='flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/30 rounded'>
            <span className='text-slate-700 dark:text-slate-300'>
              Content Length
            </span>
            <span className='text-slate-600 dark:text-slate-400'>
              {result.wordCount < 300
                ? 'Too Short'
                : result.wordCount > 800
                  ? 'Too Long'
                  : 'Optimal'}
            </span>
          </div>
        </div>
      </Card>

      {/* Keyword Details */}
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Found Keywords */}
        {result.keywordMatches.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-lg font-bold mb-4 text-green-400'>
              ✅ Keywords Found ({result.keywordMatches.length})
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
            <h3 className='text-lg font-bold mb-4 text-red-400'>
              ❌ Missing Keywords ({result.missingKeywords.length})
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
    </div>
  );

  // ATS Compatibility Tab Content
  const ATSContent = () => (
    <div className='space-y-6'>
      {/* ATS Compatibility Analysis */}
      {result.ats_compatibility && (
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-green-400'>
            ✅ ATS Compatibility Analysis
          </h3>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-semibold mb-3 text-foreground'>
                Compatibility Score
              </h4>
              <div className='text-center p-4 bg-green-500/10 rounded-lg border border-green-500/30'>
                <p className='text-3xl font-bold text-green-400 mb-2'>
                  {result.atsScore}/100
                </p>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  {result.atsScore >= 80
                    ? 'Excellent ATS Compatibility'
                    : result.atsScore >= 60
                      ? 'Good ATS Compatibility'
                      : result.atsScore >= 40
                        ? 'Fair ATS Compatibility'
                        : 'Needs Improvement'}
                </p>
              </div>
            </div>
            <div>
              <h4 className='font-semibold mb-3 text-foreground'>
                Format Grade
              </h4>
              <div className='text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/30'>
                <p className='text-3xl font-bold text-blue-400 mb-2'>
                  {result.format_analysis?.grade || 'N/A'}
                </p>
                <p className='text-sm text-slate-500 dark:text-slate-400'>
                  Document Structure Quality
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ATS Recommendations */}
      {result.ats_compatibility?.recommendations &&
        result.ats_compatibility.recommendations.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-xl font-bold mb-4 text-cyan-400'>
              💡 ATS Recommendations
            </h3>
            <ul className='space-y-3'>
              {result.ats_compatibility.recommendations.map((rec, index) => (
                <li key={index} className='flex items-start space-x-3'>
                  <span className='text-cyan-400 mt-1'>→</span>
                  <span className='text-slate-500 dark:text-slate-300'>
                    {rec}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
    </div>
  );

  // Job Match Tab Content
  const JobMatchContent = () => (
    <div className='space-y-6'>
      {/* Job Type Detection */}
      <Card className='p-6'>
        <h3 className='text-xl font-bold mb-4 text-purple-400'>
          🎯 Detected Job Type
        </h3>
        <div className='text-center p-6 bg-purple-500/10 rounded-lg border border-purple-500/30'>
          <p className='text-2xl font-bold text-purple-400 mb-2'>
            {result.jobType || 'Software Engineer'}
          </p>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Based on resume content analysis
          </p>
        </div>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className='grid md:grid-cols-2 gap-6'>
        {/* Strengths */}
        {result.strengths && result.strengths.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-lg font-bold mb-4 text-green-400'>
              💪 Strengths
            </h3>
            <ul className='space-y-2'>
              {result.strengths.map((strength, index) => (
                <li key={index} className='flex items-start space-x-2'>
                  <span className='text-green-400 mt-1'>✓</span>
                  <span className='text-slate-500 dark:text-slate-300'>
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Weaknesses */}
        {result.weaknesses && result.weaknesses.length > 0 && (
          <Card className='p-6'>
            <h3 className='text-lg font-bold mb-4 text-orange-400'>
              ⚠️ Areas for Improvement
            </h3>
            <ul className='space-y-2'>
              {result.weaknesses.map((weakness, index) => (
                <li key={index} className='flex items-start space-x-2'>
                  <span className='text-orange-400 mt-1'>•</span>
                  <span className='text-slate-500 dark:text-slate-300'>
                    {weakness}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );

  const tabItems = [
    {
      id: 'structure',
      label: 'Structure & Format',
      icon: '📋',
      content: <StructureContent />,
    },
    {
      id: 'content',
      label: 'Content & Keywords',
      icon: '📊',
      content: <ContentContent />,
    },
    {
      id: 'ats',
      label: 'ATS Compatibility',
      icon: '✅',
      content: <ATSContent />,
    },
    {
      id: 'jobmatch',
      label: 'Job Match',
      icon: '🎯',
      content: <JobMatchContent />,
    },
  ];

  return (
    <div className='space-y-6'>
      <Tabs items={tabItems} variant='pills' className='w-full' />
    </div>
  );
};

export default DetailedAnalyticsDisplay;
