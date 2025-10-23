'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { atsApi } from '@/api/endpoints/ats';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResumeData } from '@/types/resume';

interface FloatingATSScoreProps {
  resumeData: ResumeData;
  className?: string;
}

interface ATSAnalysisResult {
  score: number;
  breakdown: {
    keywordMatching: number;
    semanticMatching: number;
    formatCompliance: number;
    contentQuality: number;
    atsCompatibility: number;
  };
  issues: string[];
  suggestions: string[];
  jobTitle?: string;
  confidence?: number;
}

export const FloatingATSScore: React.FC<FloatingATSScoreProps> = ({
  resumeData,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<ATSAnalysisResult | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  // Show the floating button after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const analyzeATS = useCallback(async () => {
    setIsAnalyzing(true);

    try {
      // Convert resume data to text format for analysis
      const resumeText = convertResumeDataToText(resumeData);

      // Debug: Log what we're sending to the backend
      // eslint-disable-next-line no-console
      console.log('📤 Sending to ATS Analysis Backend:');
      // eslint-disable-next-line no-console
      console.log('Resume Text Length:', resumeText.length);
      // eslint-disable-next-line no-console
      console.log('Resume Text Preview:', `${resumeText.substring(0, 200)}...`);
      // eslint-disable-next-line no-console
      console.log('Full Resume Data:', resumeData);

      // Create a File object to send to the backend
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const file = new File([blob], 'resume.txt', { type: 'text/plain' });

      // Use the existing ATS API for analysis
      const result = await atsApi.extractExperience(file);

      if (result.success && result.data) {
        const analysis = result.data;
        setAnalysisResult({
          score: analysis.atsScore || 0,
          breakdown: {
            keywordMatching: Array.isArray(analysis.keywordMatches)
              ? analysis.keywordMatches.length
              : analysis.keywordMatches || 0,
            semanticMatching: 0, // Not available in current API
            formatCompliance: 0, // Not available in current API
            contentQuality: 0, // Not available in current API
            atsCompatibility: 0, // Not available in current API
          },
          issues: analysis.issues || [],
          suggestions: analysis.suggestions || [],
          jobTitle: analysis.jobType,
          confidence: analysis.confidence,
        });

        toast.success(
          `🎯 ATS Analysis Complete! Score: ${analysis.atsScore}/100`
        );
        setIsExpanded(true);
      } else {
        throw new Error(result.message || 'Analysis failed');
      }
    } catch {
      // console.error('ATS Analysis error:', error);
      toast.error('Failed to analyze resume. Using fallback analysis.');

      // Fallback to basic analysis
      const fallbackResult = performBasicAnalysis(resumeData);
      setAnalysisResult(fallbackResult);
      setIsExpanded(true);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeData]);

  const convertResumeDataToText = (data: ResumeData): string => {
    let text = '';

    // Header
    text += `${data.personal.fullName}\n`;
    text += `${data.personal.email}\n`;
    if (data.personal.phone) text += `${data.personal.phone}\n`;
    if (data.personal.location) text += `${data.personal.location}\n`;
    if (data.personal.linkedin) text += `LinkedIn: ${data.personal.linkedin}\n`;
    if (data.personal.github) text += `GitHub: ${data.personal.github}\n`;
    text += '\n';

    // Summary
    if (data.summary) {
      text += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
    }

    // Experience
    if (data.experience.length > 0) {
      text += 'PROFESSIONAL EXPERIENCE\n';
      data.experience.forEach(exp => {
        text += `${exp.position} at ${exp.company}\n`;
        text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        if (exp.description) text += `${exp.description}\n`;
        if (exp.achievements.length > 0) {
          exp.achievements.forEach(achievement => {
            text += `• ${achievement}\n`;
          });
        }
        text += '\n';
      });
    }

    // Education
    if (data.education.length > 0) {
      text += 'EDUCATION\n';
      data.education.forEach(edu => {
        text += `${edu.degree} in ${edu.field}\n`;
        text += `${edu.institution}\n`;
        text += `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        text += '\n';
      });
    }

    // Skills
    text += 'SKILLS\n';
    if (data.skills.technical.length > 0) {
      text += `Technical: ${data.skills.technical.join(', ')}\n`;
    }
    if (data.skills.business.length > 0) {
      text += `Business: ${data.skills.business.join(', ')}\n`;
    }
    if (data.skills.soft.length > 0) {
      text += `Soft Skills: ${data.skills.soft.join(', ')}\n`;
    }
    if (data.skills.languages.length > 0) {
      text += `Languages: ${data.skills.languages.join(', ')}\n`;
    }
    if (data.skills.certifications.length > 0) {
      text += `Certifications: ${data.skills.certifications.join(', ')}\n`;
    }
    text += '\n';

    // Projects
    if (data.projects.length > 0) {
      text += 'PROJECTS\n';
      data.projects.forEach(project => {
        text += `${project.name}\n`;
        if (project.description) text += `${project.description}\n`;
        if (project.technologies.length > 0) {
          text += `Technologies: ${project.technologies.join(', ')}\n`;
        }
        text += '\n';
      });
    }

    // Achievements
    if (data.achievements && data.achievements.length > 0) {
      text += 'ACHIEVEMENTS\n';
      data.achievements.forEach(achievement => {
        text += `• ${achievement}\n`;
      });
    }

    return text;
  };

  const performBasicAnalysis = (data: ResumeData): ATSAnalysisResult => {
    const issues: string[] = [];
    // const _suggestions: string[] = [];
    let score = 100;

    // Check contact information
    if (!data.personal.email) {
      issues.push('Missing email address');
      score -= 10;
    }
    if (!data.personal.phone) {
      issues.push('Missing phone number');
      score -= 5;
    }

    // Check summary
    if (!data.summary || data.summary.length < 50) {
      issues.push('Professional summary too short');
      score -= 15;
    }

    // Check experience
    if (data.experience.length === 0) {
      issues.push('No work experience listed');
      score -= 25;
    }

    // Check skills
    if (
      data.skills.technical.length === 0 &&
      data.skills.business.length === 0
    ) {
      issues.push('No skills section found');
      score -= 20;
    }

    return {
      score: Math.max(0, score),
      breakdown: {
        keywordMatching: Math.max(0, score - 20),
        semanticMatching: Math.max(0, score - 15),
        formatCompliance: Math.max(0, score - 10),
        contentQuality: Math.max(0, score - 25),
        atsCompatibility: Math.max(0, score - 5),
      },
      issues,
      suggestions: [
        'Add quantifiable achievements to experience',
        'Include relevant keywords from job descriptions',
        'Use action verbs in descriptions',
        'Keep formatting consistent and ATS-friendly',
      ],
    };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Work';
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className='relative group'>
              <Button
                onClick={analyzeATS}
                disabled={isAnalyzing}
                className='w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center'
                aria-label='Analyze ATS Score'
              >
                {isAnalyzing ? (
                  <div className='w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : (
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
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                )}
              </Button>

              {/* Tooltip */}
              {showTooltip && (
                <div className='absolute right-16 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
                  <div className='bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap relative'>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setShowTooltip(false);
                      }}
                      className='absolute -top-1 -right-1 w-4 h-4 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xs text-white transition-colors pointer-events-auto'
                      title='Close tooltip'
                    >
                      ×
                    </button>
                    <div className='font-medium'>🎯 Live ATS Score</div>
                    <div className='text-xs text-gray-300 mt-1'>
                      AI-powered resume analysis & optimization
                    </div>
                    <div className='text-xs text-gray-400 mt-1'>
                      Analyzes: Keywords, Format, Content Quality
                    </div>
                    <div className='absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45'></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className='w-80 max-h-96 overflow-y-auto'
          >
            <Card className='p-4 bg-white shadow-xl border border-gray-200'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
                  <svg
                    className='w-5 h-5 mr-2 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                    />
                  </svg>
                  ATS Score
                </h3>
                <Button
                  onClick={() => setIsExpanded(false)}
                  variant='outline'
                  size='sm'
                  className='w-8 h-8 p-0'
                >
                  ×
                </Button>
              </div>

              {analysisResult && (
                <div className='space-y-4'>
                  {/* Overall Score */}
                  <div className='text-center'>
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-2xl font-bold ${getScoreColor(analysisResult.score)}`}
                    >
                      {analysisResult.score}/100
                    </div>
                    <p className='text-sm text-gray-600 mt-1'>
                      {getScoreLabel(analysisResult.score)}
                    </p>
                    {analysisResult.jobTitle && (
                      <p className='text-xs text-gray-500 mt-1'>
                        Detected Role: {analysisResult.jobTitle}
                        {analysisResult.confidence &&
                          ` (${Math.round(analysisResult.confidence * 100)}% confidence)`}
                      </p>
                    )}
                  </div>

                  {/* Score Breakdown */}
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium text-gray-700'>
                      Score Breakdown
                    </h4>
                    <div className='space-y-1'>
                      <div className='flex justify-between text-xs'>
                        <span>Keyword Matching</span>
                        <span>
                          {analysisResult.breakdown.keywordMatching}/100
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div
                          className='bg-blue-600 h-1 rounded-full'
                          style={{
                            width: `${analysisResult.breakdown.keywordMatching}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className='space-y-1'>
                      <div className='flex justify-between text-xs'>
                        <span>Content Quality</span>
                        <span>
                          {analysisResult.breakdown.contentQuality}/100
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div
                          className='bg-green-600 h-1 rounded-full'
                          style={{
                            width: `${analysisResult.breakdown.contentQuality}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className='space-y-1'>
                      <div className='flex justify-between text-xs'>
                        <span>Format Compliance</span>
                        <span>
                          {analysisResult.breakdown.formatCompliance}/100
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-1'>
                        <div
                          className='bg-purple-600 h-1 rounded-full'
                          style={{
                            width: `${analysisResult.breakdown.formatCompliance}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Issues */}
                  {analysisResult.issues.length > 0 && (
                    <div>
                      <h4 className='text-sm font-medium text-red-700 mb-2'>
                        Issues Found
                      </h4>
                      <ul className='space-y-1'>
                        {analysisResult.issues
                          .slice(0, 3)
                          .map((issue, index) => (
                            <li
                              key={index}
                              className='text-xs text-red-600 flex items-start'
                            >
                              <span className='mr-1'>•</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {analysisResult.suggestions.length > 0 && (
                    <div>
                      <h4 className='text-sm font-medium text-blue-700 mb-2'>
                        Suggestions
                      </h4>
                      <ul className='space-y-1'>
                        {analysisResult.suggestions
                          .slice(0, 3)
                          .map((suggestion, index) => (
                            <li
                              key={index}
                              className='text-xs text-blue-600 flex items-start'
                            >
                              <span className='mr-1'>💡</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Refresh Button */}
                  <Button
                    onClick={analyzeATS}
                    disabled={isAnalyzing}
                    variant='outline'
                    size='sm'
                    className='w-full'
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingATSScore;
