'use client';

import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';

import { AnimatedScore, Card, DataVisualization, Tabs } from '@/components/ui';
import { useResumeNavigation } from '@/contexts/ResumeNavigationContext';
import { mapATSToResumeData } from '@/lib/utils/atsToResumeMapper';
import { useResumeActions } from '@/store/resumeStore';
import type { AnalysisResult, ImprovementItem } from '@/types';

import { TabbedImprovementPlan } from '../ImprovementPlan/TabbedImprovementPlan';

import { DetailedAnalyticsDisplay } from './DetailedAnalyticsDisplay';
import { SummaryDisplay } from './SummaryDisplay';
import { TabbedParsedDataDisplay } from './TabbedParsedDataDisplay';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onTryAgain?: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  // const router = useRouter();
  const { setResumeData, setAnalysisResult } = useResumeActions();
  const { navigateToResumeBuilder, navigateToTemplates } =
    useResumeNavigation();
  const [improvementPlan, setImprovementPlan] = useState<{
    improvements: ImprovementItem[];
    summary: {
      total_improvements: number;
      high_priority: number;
      estimated_impact: number;
      estimated_time: string;
    };
    quick_wins: ImprovementItem[];
  } | null>(null);
  const [loadingImprovements, setLoadingImprovements] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);

  const convertToResumeData = useCallback(() => {
    // Use the unified mapper to convert ATS data to Resume Builder format
    if (!result.extraction_details) return null;
    return mapATSToResumeData(
      result.extraction_details,
      result.structured_experience
    );
  }, [result.extraction_details, result.structured_experience]);

  const handleEditInBuilder = useCallback(() => {
    const resumeData = convertToResumeData();

    if (resumeData) {
      try {
        // Store in global state
        setResumeData(resumeData);
        setAnalysisResult(result);

        // Navigate to resume builder
        navigateToResumeBuilder();
      } catch (error) {
        // console.error('Error storing resume data:', error);
        // Still navigate even if storage fails
        navigateToResumeBuilder();
      }
    } else {
      // If conversion fails, still navigate to builder with empty data
      navigateToResumeBuilder();
    }
  }, [
    convertToResumeData,
    result,
    setResumeData,
    setAnalysisResult,
    navigateToResumeBuilder,
  ]);

  const fetchImprovementPlan = useCallback(async () => {
    if (!result.extraction_details) return;

    setLoadingImprovements(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/upload/improvement-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_result: result,
          extracted_data: result.extraction_details,
          job_description: null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setImprovementPlan(data.data);
        }
      }
    } catch {
      // Silently fail - improvement plan is optional
    } finally {
      setLoadingImprovements(false);
    }
  }, [result]);

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
      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-2 text-foreground'>
          Analysis Complete
        </h2>
        <p className='text-muted-foreground'>
          Detected job type:{' '}
          <span className='text-primary-600 dark:text-primary-400 font-medium'>
            {result.jobType}
          </span>
        </p>

        {/* Resume Improvement Actions */}
        {result.extraction_details && (
          <div className='mt-8 space-y-4'>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                Ready to Improve Your Resume?
              </h3>
              <p className='text-muted-foreground mb-6'>
                Take action based on your ATS analysis results
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto'>
              {/* Primary Action - Edit in Resume Builder */}
              <button
                onClick={handleEditInBuilder}
                className='group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                <div className='relative flex items-center justify-center space-x-3'>
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                    />
                  </svg>
                  <div className='text-left'>
                    <div className='text-lg font-bold'>
                      Edit in Resume Builder
                    </div>
                    <div className='text-sm opacity-90'>
                      Pre-filled with your data
                    </div>
                  </div>
                </div>
              </button>

              {/* Secondary Action - View Templates */}
              <button
                onClick={() => {
                  // Store analysis result and navigate to templates
                  setAnalysisResult(result);
                  navigateToTemplates();
                }}
                className='group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300'></div>
                <div className='relative flex items-center justify-center space-x-3'>
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z'
                    />
                  </svg>
                  <div className='text-left'>
                    <div className='text-lg font-bold'>View Templates</div>
                    <div className='text-sm opacity-90'>Choose a design</div>
                  </div>
                </div>
              </button>
            </div>

            {/* Additional Options */}
            <div className='flex flex-wrap justify-center gap-3 mt-6'>
              <button
                onClick={handleEditInBuilder}
                className='inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 text-sm'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709'
                  />
                </svg>
                Improve Content
              </button>
              <button
                onClick={handleEditInBuilder}
                className='inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 text-sm'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'
                  />
                </svg>
                Optimize for ATS
              </button>
              <button
                onClick={handleEditInBuilder}
                className='inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors duration-200 text-sm'
              >
                <svg
                  className='w-4 h-4 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                  />
                </svg>
                Export Resume
              </button>
            </div>

            <div className='text-center mt-4'>
              <p className='text-sm text-slate-500 dark:text-slate-400'>
                ✨ Your resume data will be automatically loaded into the
                builder
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI-Generated Job Description - Hidden by default with toggle */}
      {result.job_description && (
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-xl font-bold text-purple-600 dark:text-purple-400'>
              🤖 AI-Generated Job Description
            </h3>
            <button
              onClick={() => setShowJobDescription(!showJobDescription)}
              className='px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition-colors duration-200 text-sm font-medium'
            >
              {showJobDescription ? 'Hide' : 'Show'} Job Description
            </button>
          </div>
          {showJobDescription && (
            <div className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'>
              <p className='text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap'>
                {result.job_description}
              </p>
            </div>
          )}
          <p className='text-sm text-slate-500 dark:text-slate-400 mt-3'>
            This job description was automatically generated by AI based on your
            resume content and industry standards for your detected role.
          </p>
        </Card>
      )}

      {/* Main Grid Layout */}
      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Main Content - Left 2/3 */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Enhanced ATS Score Display */}
          <Card className='p-6' delay={0.2}>
            <div className='text-center'>
              <h3 className='text-xl font-bold mb-6 text-foreground'>
                🎯 ATS Compatibility Score
              </h3>

              {/* Animated Score Display */}
              <AnimatedScore
                score={result.atsScore}
                size='xl'
                showGrade={true}
                className='mb-6'
              />

              <p className='text-muted-foreground mt-4 max-w-md mx-auto'>
                {result.atsScore >= 80 &&
                  '🎉 Excellent! Your resume is highly ATS-compatible and ready to impress recruiters.'}
                {result.atsScore >= 60 &&
                  result.atsScore < 80 &&
                  '👍 Good! Your resume has solid ATS compatibility with room for strategic improvements.'}
                {result.atsScore < 60 &&
                  result.atsScore >= 0 &&
                  '🔧 Your resume needs targeted improvements for better ATS compatibility and visibility.'}
              </p>
            </div>
          </Card>

          {/* Main Results Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Tabs
              items={[
                {
                  id: 'summary',
                  label: 'Overview',
                  icon: '📋',
                  content: <SummaryDisplay result={result} />,
                },
                {
                  id: 'parsed',
                  label: 'Extracted Content',
                  icon: '📄',
                  badge: Object.keys(result.structured_experience || {}).length,
                  content: <TabbedParsedDataDisplay result={result} />,
                },
                {
                  id: 'analysis',
                  label: 'ATS Analysis',
                  icon: '📊',
                  badge: result.atsScore,
                  content: <DetailedAnalyticsDisplay result={result} />,
                },
                {
                  id: 'improvement',
                  label: 'Improvement Plan',
                  icon: '📈',
                  content: (
                    <div className='space-y-6'>
                      {!improvementPlan && (
                        <div className='text-center'>
                          <button
                            onClick={fetchImprovementPlan}
                            disabled={loadingImprovements}
                            className='px-8 py-3 text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg'
                          >
                            {loadingImprovements ? (
                              <span className='flex items-center gap-2'>
                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Generating Plan...
                              </span>
                            ) : (
                              <span className='flex items-center gap-2'>
                                📈 Get Detailed Improvement Plan
                              </span>
                            )}
                          </button>
                        </div>
                      )}

                      {improvementPlan && (
                        <TabbedImprovementPlan
                          improvements={improvementPlan.improvements}
                          summary={improvementPlan.summary}
                          quick_wins={improvementPlan.quick_wins}
                          currentScore={result.atsScore}
                        />
                      )}
                    </div>
                  ),
                },
              ]}
              defaultActiveTab='parsed'
              variant='underline'
              className='w-full'
            />
          </motion.div>
        </div>

        {/* Analysis & Metrics Sidebar - Right 1/3 */}
        <div className='space-y-6'>
          {/* Hover Popup: Analysis Grades */}
          {result.ats_compatibility && (
            <div className='group relative'>
              <Card className='p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover-lift hover-glow click-bounce'>
                <div className='text-center'>
                  <div className='text-4xl mb-2'>📊</div>
                  <h3 className='text-lg font-bold text-foreground mb-2'>
                    Analysis Grades
                  </h3>
                  <div className='text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700'>
                    <p className='text-sm text-cyan-600 dark:text-cyan-400 mb-1'>
                      ATS Score
                    </p>
                    <p className='text-xl font-bold text-cyan-600 dark:text-cyan-400'>
                      {getScoreGrade(result.atsScore)}
                    </p>
                  </div>
                  <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
                    Hover to see details
                  </p>
                </div>
              </Card>

              {/* Hover Popup */}
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-80 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-50 animate-slide-in-up'>
                <Card className='p-6 shadow-2xl border-2 border-cyan-200 dark:border-cyan-700 bg-white dark:bg-slate-800'>
                  <h3 className='text-lg font-bold mb-4 text-foreground'>
                    📊 Analysis Grades
                  </h3>
                  <div className='space-y-4'>
                    <div className='text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700'>
                      <p className='text-sm text-cyan-600 dark:text-cyan-400 mb-2'>
                        ATS Compatibility
                      </p>
                      <p className='text-2xl font-bold text-cyan-600 dark:text-cyan-400'>
                        {getScoreGrade(result.atsScore)}
                      </p>
                      <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                        Score: {result.atsScore}/100
                      </p>
                    </div>
                    <div className='text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700'>
                      <p className='text-sm text-blue-600 dark:text-blue-400 mb-2'>
                        Format Structure
                      </p>
                      <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                        {result.format_analysis?.grade || 'N/A'}
                      </p>
                      <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                        Document formatting quality
                      </p>
                    </div>
                  </div>
                  {/* Arrow pointing down */}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-cyan-200 dark:border-t-cyan-700'></div>
                </Card>
              </div>
            </div>
          )}

          {/* Flip Card: Key Metrics */}
          <div className='group relative h-48 perspective-1000 hover:z-10'>
            <div className='relative w-full h-full transition-transform duration-700 transform-gpu group-hover:rotate-y-180 transform-style-preserve-3d'>
              {/* Front of card */}
              <div className='absolute inset-0 w-full h-full backface-hidden'>
                <Card className='p-6 h-full flex flex-col justify-center items-center cursor-pointer'>
                  <div className='text-center'>
                    <div className='text-4xl mb-2'>📋</div>
                    <h3 className='text-lg font-bold text-foreground mb-2'>
                      Key Metrics
                    </h3>
                    <div className='grid grid-cols-3 gap-2 text-center'>
                      <div className='p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-700'>
                        <p className='text-xs text-cyan-600 dark:text-cyan-400'>
                          Job Type
                        </p>
                        <p className='text-sm font-bold text-cyan-600 dark:text-cyan-400'>
                          {result.jobType?.split(' (')[0]?.substring(0, 8) ||
                            'Unknown'}
                          ...
                        </p>
                      </div>
                      <div className='p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700'>
                        <p className='text-xs text-green-600 dark:text-green-400'>
                          Matches
                        </p>
                        <p className='text-sm font-bold text-green-600 dark:text-green-400'>
                          {result.keywordMatches.length}
                        </p>
                      </div>
                      <div className='p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700'>
                        <p className='text-xs text-red-600 dark:text-red-400'>
                          Missing
                        </p>
                        <p className='text-sm font-bold text-red-600 dark:text-red-400'>
                          {result.missingKeywords.length}
                        </p>
                      </div>
                    </div>
                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
                      Hover to see details
                    </p>
                  </div>
                </Card>
              </div>

              {/* Back of card */}
              <div className='absolute inset-0 w-full h-full backface-hidden rotate-y-180'>
                <Card className='p-6 h-full'>
                  <h3 className='text-lg font-bold mb-4 text-foreground'>
                    📋 Key Metrics
                  </h3>
                  <div className='space-y-3'>
                    <div className='text-center p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700'>
                      <p className='text-sm text-cyan-600 dark:text-cyan-400 mb-1'>
                        🎯 Job Type
                      </p>
                      <p className='text-sm font-semibold text-cyan-600 dark:text-cyan-400'>
                        {result.jobType}
                      </p>
                    </div>
                    <div className='text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700'>
                      <p className='text-sm text-green-600 dark:text-green-400 mb-1'>
                        ✅ Matches
                      </p>
                      <p className='text-sm font-semibold text-green-600 dark:text-green-400'>
                        {result.keywordMatches.length}
                      </p>
                    </div>
                    <div className='text-center p-3 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-700'>
                      <p className='text-sm text-red-600 dark:text-red-400 mb-1'>
                        ❌ Missing
                      </p>
                      <p className='text-sm font-semibold text-red-600 dark:text-red-400'>
                        {result.missingKeywords.length}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Original Key Metrics - keeping for reference */}
          <Card className='p-6 hidden'>
            <h3 className='text-lg font-bold mb-4 text-foreground'>
              📋 Key Metrics
            </h3>

            <div className='space-y-3'>
              {/* Interactive Job Type Card */}
              <div className='group relative'>
                <div className='text-center p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'>
                  <p className='text-sm text-cyan-600 dark:text-cyan-400 mb-1'>
                    🎯 Job Type
                  </p>
                  <p className='text-sm font-semibold text-cyan-600 dark:text-cyan-400'>
                    {result.jobType.split(' (')[0]}
                  </p>
                </div>
                {/* Hover Tooltip */}
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10'>
                  {result.jobType}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900'></div>
                </div>
              </div>

              {/* Interactive Keyword Matches Card */}
              <div className='group relative'>
                <div className='text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'>
                  <p className='text-sm text-green-600 dark:text-green-400 mb-1'>
                    ✅ Matches
                  </p>
                  <p className='text-sm font-semibold text-green-600 dark:text-green-400'>
                    {result.keywordMatches.length}
                  </p>
                </div>
                {/* Hover Tooltip */}
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 max-w-xs'>
                  <div className='font-semibold mb-1'>Matched Keywords:</div>
                  <div className='text-xs'>
                    {result.keywordMatches.slice(0, 3).join(', ')}
                    {result.keywordMatches.length > 3 &&
                      ` +${result.keywordMatches.length - 3} more`}
                  </div>
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900'></div>
                </div>
              </div>

              {/* Interactive Missing Keywords Card */}
              <div className='group relative'>
                <div className='text-center p-3 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg border border-red-200 dark:border-red-700 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105'>
                  <p className='text-sm text-red-600 dark:text-red-400 mb-1'>
                    ❌ Missing
                  </p>
                  <p className='text-sm font-semibold text-red-600 dark:text-red-400'>
                    {result.missingKeywords.length}
                  </p>
                </div>
                {/* Hover Tooltip */}
                <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 max-w-xs'>
                  <div className='font-semibold mb-1'>Missing Keywords:</div>
                  <div className='text-xs'>
                    {result.missingKeywords.slice(0, 3).join(', ')}
                    {result.missingKeywords.length > 3 &&
                      ` +${result.missingKeywords.length - 3} more`}
                  </div>
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900'></div>
                </div>
              </div>
            </div>

            {/* Compact Radial Chart */}
            <div className='mt-4'>
              <DataVisualization
                title='📊 Quick Overview'
                data={[
                  {
                    label: 'Job Match',
                    value: 100,
                    icon: '🎯',
                    color: 'from-cyan-400 to-blue-500',
                  },
                  {
                    label: 'Keywords',
                    value: Math.min(
                      (result.keywordMatches.length / 20) * 100,
                      100
                    ),
                    icon: '✅',
                    color: 'from-green-400 to-emerald-500',
                  },
                  {
                    label: 'Missing',
                    value: Math.min(
                      (result.missingKeywords.length / 10) * 100,
                      100
                    ),
                    icon: '❌',
                    color: 'from-red-400 to-pink-500',
                  },
                ]}
                type='radial'
                className='scale-75 origin-center'
              />
            </div>
          </Card>

          {/* Flip Card: Match Details */}
          {(result.match_category || result.semantic_similarity) && (
            <div className='group relative h-64 perspective-1000 hover:z-10'>
              <div className='relative w-full h-full transition-transform duration-700 transform-gpu group-hover:rotate-y-180 transform-style-preserve-3d'>
                {/* Front of card */}
                <div className='absolute inset-0 w-full h-full backface-hidden'>
                  <Card className='p-6 h-full flex flex-col justify-center items-center cursor-pointer'>
                    <div className='text-center'>
                      <div className='text-4xl mb-2'>🎯</div>
                      <h3 className='text-lg font-bold text-foreground mb-2'>
                        Match Details
                      </h3>
                      <div className='grid grid-cols-2 gap-2 text-center'>
                        {result.match_category && (
                          <div className='p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-700'>
                            <p className='text-xs text-cyan-600 dark:text-cyan-400'>
                              Category
                            </p>
                            <p className='text-sm font-bold text-cyan-600 dark:text-cyan-400'>
                              {result.match_category.substring(0, 8)}...
                            </p>
                          </div>
                        )}
                        {result.semantic_similarity && (
                          <div className='p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700'>
                            <p className='text-xs text-purple-600 dark:text-purple-400'>
                              Similarity
                            </p>
                            <p className='text-sm font-bold text-purple-600 dark:text-purple-400'>
                              {Math.round(result.semantic_similarity * 100)}%
                            </p>
                          </div>
                        )}
                      </div>
                      <p className='text-xs text-slate-500 dark:text-slate-400 mt-2'>
                        Hover to see details
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Back of card */}
                <div className='absolute inset-0 w-full h-full backface-hidden rotate-y-180'>
                  <Card className='p-6 h-full overflow-y-auto'>
                    <h3 className='text-lg font-bold mb-4 text-foreground'>
                      🎯 Match Details
                    </h3>
                    <div className='space-y-3'>
                      {result.match_category && (
                        <div className='text-center p-3 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700'>
                          <p className='text-sm text-cyan-600 dark:text-cyan-400 mb-1'>
                            🎯 Match Category
                          </p>
                          <p className='text-sm font-semibold text-cyan-600 dark:text-cyan-400'>
                            {result.match_category}
                          </p>
                        </div>
                      )}
                      {result.semantic_similarity && (
                        <div className='text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700'>
                          <p className='text-sm text-purple-600 dark:text-purple-400 mb-1'>
                            🧠 Semantic Similarity
                          </p>
                          <p className='text-sm font-semibold text-purple-600 dark:text-purple-400'>
                            {Math.round(result.semantic_similarity * 100)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Scores */}
          {result.detailed_scores && (
            <Card className='p-6'>
              <h3 className='text-lg font-bold mb-4 text-foreground'>
                📊 Detailed Scores
              </h3>
              <DataVisualization
                title='Analysis Breakdown'
                data={[
                  {
                    label: 'Keywords',
                    value: result.detailed_scores.keyword_score || 0,
                    icon: '🔍',
                    color: 'from-blue-400 to-cyan-500',
                  },
                  {
                    label: 'Semantic',
                    value: result.detailed_scores.semantic_score || 0,
                    icon: '🧠',
                    color: 'from-purple-400 to-pink-500',
                  },
                  {
                    label: 'Format',
                    value: result.detailed_scores.format_score || 0,
                    icon: '📋',
                    color: 'from-green-400 to-emerald-500',
                  },
                  {
                    label: 'Content',
                    value: result.detailed_scores.content_score || 0,
                    icon: '✨',
                    color: 'from-yellow-400 to-orange-500',
                  },
                ]}
                type='bar'
                className='mt-4'
              />
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons - Commented out as they are not functional yet */}
      {/*
      <div className='text-center space-x-4'>
        <button className='px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all font-medium'>
          Download Report
        </button>
        <button className='px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-500 hover:text-white transition-all font-medium'>
          Analyze Another Resume
        </button>
      </div>
      */}
    </div>
  );
};
