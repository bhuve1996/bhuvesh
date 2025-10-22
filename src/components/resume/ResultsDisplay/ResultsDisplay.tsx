'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import { ImprovementPlan } from '@/components/resume/ImprovementPlan';
import { AnimatedScore, Card, DataVisualization, Tabs } from '@/components/ui';
import type {
  ATSEducation,
  ATSWorkExperience,
  AnalysisResult,
  ImprovementItem,
  StructuredEducation,
  StructuredWorkExperience,
} from '@/types';

import { AnalysisDataDisplay } from './AnalysisDataDisplay';
import { TabbedParsedDataDisplay } from './TabbedParsedDataDisplay';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onTryAgain?: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const router = useRouter();
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

  const convertToResumeData = useCallback(() => {
    if (!result.extraction_details) return null;

    const extracted = result.extraction_details;

    // Debug logging removed for production

    // Use structured_experience if available, otherwise fall back to categorized_resume
    const structuredData = result.structured_experience;
    const categorizedData = extracted.categorized_resume;

    // Convert extracted data to ResumeData format
    const resumeData = {
      personal: {
        fullName:
          structuredData?.contact_info?.full_name ||
          categorizedData?.contact_info?.full_name ||
          '',
        email:
          structuredData?.contact_info?.email ||
          categorizedData?.contact_info?.email ||
          '',
        phone:
          structuredData?.contact_info?.phone ||
          (typeof categorizedData?.contact_info?.phone === 'object'
            ? categorizedData?.contact_info?.phone?.raw ||
              categorizedData?.contact_info?.phone?.number ||
              ''
            : categorizedData?.contact_info?.phone || ''),
        location:
          structuredData?.contact_info?.location ||
          (typeof categorizedData?.contact_info?.location === 'object'
            ? categorizedData?.contact_info?.location?.full ||
              `${categorizedData?.contact_info?.location?.city || ''}, ${categorizedData?.contact_info?.location?.state || ''}, ${categorizedData?.contact_info?.location?.country || ''}`
                .replace(/^,\s*|,\s*$/g, '')
                .replace(/,\s*,/g, ',')
            : categorizedData?.contact_info?.location || ''),
        linkedin:
          structuredData?.contact_info?.linkedin ||
          (typeof categorizedData?.contact_info?.linkedin === 'object'
            ? categorizedData?.contact_info?.linkedin?.url || ''
            : categorizedData?.contact_info?.linkedin || ''),
        github:
          structuredData?.contact_info?.github ||
          (typeof categorizedData?.contact_info?.github === 'object'
            ? categorizedData?.contact_info?.github?.url || ''
            : categorizedData?.contact_info?.github || ''),
        portfolio: categorizedData?.contact_info?.portfolio || '',
      },
      summary:
        structuredData?.summary || categorizedData?.summary_profile || '',
      experience:
        structuredData?.work_experience?.map(
          (exp: StructuredWorkExperience, index: number) => ({
            id: `job-${index}`,
            position: exp.positions?.[0]?.title || '',
            company: exp.company || '',
            location: '',
            startDate: exp.positions?.[0]?.start_date || '',
            endDate: exp.positions?.[0]?.end_date || '',
            current: exp.current || false,
            description: exp.responsibilities?.join('\n') || '',
            achievements: exp.achievements || [],
          })
        ) ||
        categorizedData?.work_experience?.map(
          (exp: ATSWorkExperience, index: number) => ({
            id: `job-${index}`,
            position: exp.role || '',
            company: exp.company || '',
            location: exp.location || '',
            startDate: exp.start_date || '',
            endDate: exp.end_date || '',
            current: false,
            description: '',
            achievements: [],
          })
        ) ||
        [],
      education:
        structuredData?.education?.map(
          (edu: StructuredEducation, index: number) => ({
            id: `edu-${index}`,
            degree: edu.degree || '',
            institution: edu.institution || '',
            field: '',
            location: edu.location || '',
            startDate: '',
            endDate: edu.graduation_year || '',
            current: false,
            gpa: edu.gpa || '',
            honors: [],
          })
        ) ||
        categorizedData?.education?.map((edu: ATSEducation, index: number) => ({
          id: `edu-${index}`,
          degree: edu.degree_full || '',
          institution: edu.institution?.name || '',
          field: edu.major || '',
          location: edu.institution?.location || '',
          startDate: edu.duration?.start_year || '',
          endDate: edu.duration?.end_year || '',
          current: false,
          gpa: edu.grade?.value || '',
          honors: [],
        })) ||
        [],
      skills: {
        technical: [],
        business: [],
        soft: [],
        languages: [],
        certifications: [],
      },
      projects: [],
      achievements:
        structuredData?.work_experience?.flatMap(
          exp => exp.achievements || []
        ) ||
        categorizedData?.achievements ||
        [],
    };

    // Resume data converted successfully
    return resumeData;
  }, [result.extraction_details, result.structured_experience]);

  const handleEditInBuilder = useCallback(() => {
    const resumeData = convertToResumeData();
    // Converting to resume data

    if (resumeData) {
      try {
        // Save the resume data to localStorage for the builder to pick up
        localStorage.setItem('resume-builder-data', JSON.stringify(resumeData));

        // Also save metadata about the source
        localStorage.setItem(
          'resume-builder-source',
          JSON.stringify({
            source: 'ats-checker',
            timestamp: new Date().toISOString(),
            originalJobType: result.jobType,
            atsScore: result.ats_score,
          })
        );

        // Show success message (optional - could be a toast notification)
        // Resume data saved successfully, navigating to builder

        // Navigate to the resume builder
        router.push('/resume/builder');
      } catch {
        // Error saving resume data
        // Still navigate even if localStorage fails
        router.push('/resume/builder');
      }
    } else {
      // No resume data to save, navigating to builder anyway
      router.push('/resume/builder');
    }
  }, [convertToResumeData, router, result.jobType, result.ats_score]);

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
        <h2 className='text-3xl font-bold mb-2 text-white'>
          Analysis Complete
        </h2>
        <p className='text-gray-300'>
          Detected job type:{' '}
          <span className='text-cyan-400 font-medium'>{result.jobType}</span>
        </p>

        {/* Resume Improvement Actions */}
        {result.extraction_details && (
          <div className='mt-8 space-y-4'>
            <div className='text-center'>
              <h3 className='text-xl font-semibold text-white mb-2'>
                Ready to Improve Your Resume?
              </h3>
              <p className='text-gray-300 mb-6'>
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

              {/* Secondary Action - Improve Design */}
              <button
                onClick={handleEditInBuilder}
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
                    <div className='text-lg font-bold'>Change Design</div>
                    <div className='text-sm opacity-90'>
                      New template & layout
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Additional Options */}
            <div className='flex flex-wrap justify-center gap-3 mt-6'>
              <button
                onClick={handleEditInBuilder}
                className='inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200 text-sm'
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
                className='inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200 text-sm'
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
                className='inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors duration-200 text-sm'
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
              <p className='text-sm text-gray-400'>
                ✨ Your resume data will be automatically loaded into the
                builder
              </p>
            </div>
          </div>
        )}
      </div>

      {/* AI-Generated Job Description */}
      {result.job_description && (
        <Card className='p-6'>
          <h3 className='text-xl font-bold mb-4 text-purple-400'>
            🤖 AI-Generated Job Description
          </h3>
          <div className='bg-gray-800/50 rounded-lg p-4 border border-gray-700'>
            <p className='text-gray-300 leading-relaxed whitespace-pre-wrap'>
              {result.job_description}
            </p>
          </div>
          <p className='text-sm text-gray-400 mt-3'>
            This job description was automatically generated by AI based on your
            resume content and industry standards for your detected role.
          </p>
        </Card>
      )}

      {/* Enhanced ATS Score Display */}
      <Card className='p-6' delay={0.2}>
        <div className='text-center'>
          <h3 className='text-xl font-bold mb-6 text-white'>
            🎯 ATS Compatibility Score
          </h3>

          {/* Animated Score Display */}
          <AnimatedScore
            score={result.atsScore}
            size='xl'
            showGrade={true}
            className='mb-6'
          />

          <p className='text-gray-300 mt-4 max-w-md mx-auto'>
            {result.atsScore >= 80 &&
              '🎉 Excellent! Your resume is highly ATS-compatible and ready to impress recruiters.'}
            {result.atsScore >= 60 &&
              result.atsScore < 80 &&
              '👍 Good! Your resume has solid ATS compatibility with room for strategic improvements.'}
            {result.atsScore < 60 &&
              result.atsScore >= 0 &&
              '🔧 Your resume needs targeted improvements for better ATS compatibility and visibility.'}
          </p>

          {/* Enhanced Analysis Grades */}
          {result.ats_compatibility && (
            <div className='mt-8 grid grid-cols-3 gap-6'>
              <div className='text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700'>
                <p className='text-sm text-gray-400 mb-2'>ATS Compatibility</p>
                <p className='text-2xl font-bold text-cyan-400'>
                  {getScoreGrade(result.atsScore)}
                </p>
              </div>
              <div className='text-center p-4 bg-gray-800/30 rounded-lg border border-gray-700'>
                <p className='text-sm text-gray-400 mb-2'>Format Structure</p>
                <p className='text-2xl font-bold text-blue-400'>
                  {result.format_analysis?.grade || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {/* Detailed Scores with Data Visualization */}
          {result.detailed_scores && (
            <div className='mt-8'>
              <DataVisualization
                title='📊 Detailed Analysis Breakdown'
                data={[
                  {
                    label: 'Keyword Optimization',
                    value: result.detailed_scores.keyword_score || 0,
                    icon: '🔍',
                    color: 'from-blue-400 to-cyan-500',
                  },
                  {
                    label: 'Semantic Matching',
                    value: result.detailed_scores.semantic_score || 0,
                    icon: '🧠',
                    color: 'from-purple-400 to-pink-500',
                  },
                  {
                    label: 'Format Structure',
                    value: result.detailed_scores.format_score || 0,
                    icon: '📋',
                    color: 'from-green-400 to-emerald-500',
                  },
                  {
                    label: 'Content Quality',
                    value: result.detailed_scores.content_score || 0,
                    icon: '✨',
                    color: 'from-yellow-400 to-orange-500',
                  },
                ]}
                type='bar'
                className='mt-6'
              />
            </div>
          )}

          {/* Match Category & Semantic Similarity */}
          {(result.match_category || result.semantic_similarity) && (
            <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
              {result.match_category && (
                <div className='text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20'>
                  <p className='text-sm text-gray-400 mb-2'>
                    🎯 Match Category
                  </p>
                  <p className='text-lg font-semibold text-cyan-400'>
                    {result.match_category}
                  </p>
                </div>
              )}
              {result.semantic_similarity && (
                <div className='text-center p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20'>
                  <p className='text-sm text-gray-400 mb-2'>
                    🧠 Semantic Similarity
                  </p>
                  <p className='text-lg font-semibold text-purple-400'>
                    {Math.round(result.semantic_similarity * 100)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Parsed Data Summary */}
      <Card className='p-6' delay={0.4}>
        <h3 className='text-xl font-bold mb-6 text-white'>📋 Resume Summary</h3>

        <DataVisualization
          title='📊 Key Metrics'
          data={[
            {
              label: 'Job Type Detected',
              value: 100,
              icon: '🎯',
              color: 'from-cyan-400 to-blue-500',
            },
            {
              label: 'Keyword Matches',
              value: Math.min((result.keywordMatches.length / 20) * 100, 100),
              icon: '✅',
              color: 'from-green-400 to-emerald-500',
            },
            {
              label: 'Missing Keywords',
              value: Math.min((result.missingKeywords.length / 10) * 100, 100),
              icon: '❌',
              color: 'from-red-400 to-pink-500',
            },
          ]}
          type='radial'
          className='mb-6'
        />

        <div className='grid md:grid-cols-3 gap-6 mb-6'>
          <div className='text-center p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20'>
            <p className='text-sm text-gray-400 mb-2'>🎯 Job Type Detected</p>
            <p className='text-lg font-semibold text-cyan-400'>
              {result.jobType}
            </p>
          </div>
          <div className='text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20'>
            <p className='text-sm text-gray-400 mb-2'>✅ Keyword Matches</p>
            <p className='text-lg font-semibold text-green-400'>
              {result.keywordMatches.length}
            </p>
          </div>
          <div className='text-center p-4 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20'>
            <p className='text-sm text-gray-400 mb-2'>❌ Missing Keywords</p>
            <p className='text-lg font-semibold text-red-400'>
              {result.missingKeywords.length}
            </p>
          </div>
        </div>

        <div className='text-center p-4 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg border border-gray-600'>
          <p className='text-gray-300'>
            {result.atsScore >= 80 &&
              '🎉 Your resume shows excellent ATS compatibility and is ready to impress recruiters!'}
            {result.atsScore >= 60 &&
              result.atsScore < 80 &&
              '👍 Your resume has good ATS compatibility with strategic room for improvement.'}
            {result.atsScore < 60 &&
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
              id: 'parsed',
              label: 'Parsed Data',
              icon: '📄',
              content: <TabbedParsedDataDisplay result={result} />,
            },
            {
              id: 'analysis',
              label: 'Analysis Details',
              icon: '📊',
              content: <AnalysisDataDisplay result={result} />,
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
                    <ImprovementPlan
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

      {/* Action Buttons - Commented out as they are not functional yet */}
      {/*
      <div className='text-center space-x-4'>
        <button className='px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg hover:from-cyan-500 hover:to-blue-600 transition-all font-medium'>
          Download Report
        </button>
        <button className='px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-all font-medium'>
          Analyze Another Resume
        </button>
      </div>
      */}
    </div>
  );
};
