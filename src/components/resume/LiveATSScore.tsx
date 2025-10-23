'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { ResumeData } from '@/types/resume';

interface LiveATSScoreProps {
  resumeData: ResumeData;
  className?: string;
}

interface ATSMetrics {
  score: number;
  issues: string[];
  suggestions: string[];
  sections: {
    contact: number;
    summary: number;
    experience: number;
    skills: number;
    education: number;
  };
}

export const LiveATSScore: React.FC<LiveATSScoreProps> = ({
  resumeData,
  className = '',
}) => {
  const [atsMetrics, setAtsMetrics] = useState<ATSMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeATS = useCallback(async () => {
    setIsAnalyzing(true);

    // Simulate ATS analysis (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    const issues: string[] = [];
    const suggestions: string[] = [];
    let totalScore = 100;

    // Check contact information
    if (!resumeData.personal.email) {
      issues.push('Missing email address');
      totalScore -= 10;
    }
    if (!resumeData.personal.phone) {
      issues.push('Missing phone number');
      totalScore -= 5;
    }
    if (!resumeData.personal.linkedin) {
      suggestions.push('Add LinkedIn profile for better visibility');
      totalScore -= 3;
    }

    // Check summary
    if (!resumeData.summary || resumeData.summary.length < 50) {
      issues.push('Professional summary too short');
      totalScore -= 15;
    } else if (resumeData.summary.length > 200) {
      suggestions.push('Consider shortening professional summary');
      totalScore -= 5;
    }

    // Check experience
    if (!resumeData.experience || resumeData.experience.length === 0) {
      issues.push('No work experience listed');
      totalScore -= 25;
    } else {
      resumeData.experience.forEach((exp, index) => {
        if (!exp.achievements || exp.achievements.length === 0) {
          suggestions.push(`Add achievements to experience ${index + 1}`);
          totalScore -= 5;
        }
        if (!exp.description) {
          suggestions.push(`Add description to experience ${index + 1}`);
          totalScore -= 3;
        }
      });
    }

    // Check skills
    if (
      !resumeData.skills ||
      (!resumeData.skills.technical && !resumeData.skills.business)
    ) {
      issues.push('No skills section found');
      totalScore -= 20;
    }

    // Check education
    if (!resumeData.education || resumeData.education.length === 0) {
      issues.push('No education information');
      totalScore -= 10;
    }

    const metrics: ATSMetrics = {
      score: Math.max(0, totalScore),
      issues,
      suggestions,
      sections: {
        contact:
          resumeData.personal.email && resumeData.personal.phone ? 100 : 70,
        summary:
          resumeData.summary && resumeData.summary.length >= 50 ? 95 : 60,
        experience:
          resumeData.experience && resumeData.experience.length > 0 ? 90 : 40,
        skills:
          resumeData.skills &&
          (resumeData.skills.technical || resumeData.skills.business)
            ? 95
            : 30,
        education:
          resumeData.education && resumeData.education.length > 0 ? 90 : 50,
      },
    };

    setAtsMetrics(metrics);
    setIsAnalyzing(false);
  }, [resumeData]);

  useEffect(() => {
    analyzeATS();
  }, [analyzeATS]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
            🎯 Live ATS Score
          </h3>
          <button
            onClick={analyzeATS}
            disabled={isAnalyzing}
            className='text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50'
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </button>
        </div>

        {isAnalyzing ? (
          <div className='flex items-center justify-center py-8'>
            <div className='w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
            <span className='ml-2 text-slate-600 dark:text-slate-400'>
              Analyzing resume...
            </span>
          </div>
        ) : atsMetrics ? (
          <div className='space-y-6'>
            {/* Overall Score */}
            <div className='text-center'>
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getScoreBg(atsMetrics.score)} mb-3`}
              >
                <span
                  className={`text-2xl font-bold ${getScoreColor(atsMetrics.score)}`}
                >
                  {atsMetrics.score}
                </span>
              </div>
              <p className='text-sm text-slate-600 dark:text-slate-400'>
                Overall ATS Score
              </p>
            </div>

            {/* Section Scores */}
            <div className='grid grid-cols-2 gap-4'>
              {Object.entries(atsMetrics.sections).map(([section, score]) => (
                <div key={section} className='text-center'>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getScoreBg(score)} mb-2`}
                  >
                    <span
                      className={`text-sm font-bold ${getScoreColor(score)}`}
                    >
                      {score}
                    </span>
                  </div>
                  <p className='text-xs text-slate-600 dark:text-slate-400 capitalize'>
                    {section}
                  </p>
                </div>
              ))}
            </div>

            {/* Issues */}
            {atsMetrics.issues.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-red-600 dark:text-red-400 mb-2'>
                  ⚠️ Issues Found
                </h4>
                <ul className='space-y-1'>
                  {atsMetrics.issues.map((issue, index) => (
                    <li
                      key={index}
                      className='text-sm text-red-600 dark:text-red-400'
                    >
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {atsMetrics.suggestions.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2'>
                  💡 Suggestions
                </h4>
                <ul className='space-y-1'>
                  {atsMetrics.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className='text-sm text-blue-600 dark:text-blue-400'
                    >
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default LiveATSScore;
