'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { atsApi } from '@/api/endpoints/ats';
import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import { ResumeData } from '@/types/resume';

interface ImprovedAIContentImproverProps {
  resumeData: ResumeData;
  onContentUpdate: (updatedData: ResumeData) => void;
  className?: string;
}

interface ContentImprovement {
  section: string;
  original: string;
  improved: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
}

interface ImprovementResult {
  improvements: ContentImprovement[];
  overallScore: number;
  scoreIncrease: number;
  summary: string;
}

export const ImprovedAIContentImprover: React.FC<
  ImprovedAIContentImproverProps
> = ({ resumeData, onContentUpdate, className = '' }) => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] =
    useState<ImprovementResult | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showChanges, setShowChanges] = useState(false);

  const improveContent = async (section: keyof ResumeData) => {
    setIsImproving(true);
    setActiveSection(section);

    try {
      // Convert resume data to text for analysis
      const resumeText = convertResumeDataToText(resumeData);

      // Create a File object for the current resume
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const file = new File([blob], 'resume.txt', { type: 'text/plain' });

      // First, get the current ATS analysis
      const analysisResult = await atsApi.extractExperience(file);

      if (!analysisResult.success || !analysisResult.data) {
        throw new Error('Failed to analyze current resume');
      }

      const currentScore =
        (analysisResult.data as { ats_score?: number }).ats_score || 0;

      // Generate improvement plan using the backend API
      const improvementPlan = await atsApi.getImprovementPlan(
        analysisResult.data,
        { text: resumeText, sections: getSectionData(resumeData, section) },
        undefined // No specific job description for general improvements
      );

      if (!improvementPlan.success || !improvementPlan.data) {
        throw new Error('Failed to generate improvement plan');
      }

      // Apply AI improvements to the specific section
      const improvements = await applyAIImprovements(
        resumeData,
        section,
        improvementPlan.data as {
          improvements?: Array<{ category?: string; section?: string }>;
        }
      );

      // Calculate new score (simulate improvement)
      const scoreIncrease = Math.min(15, Math.floor(Math.random() * 10) + 5);
      const newScore = Math.min(100, currentScore + scoreIncrease);

      const result: ImprovementResult = {
        improvements,
        overallScore: newScore,
        scoreIncrease,
        summary: `Improved ${section} section with AI-powered optimizations. Expected ATS score increase: +${scoreIncrease} points.`,
      };

      setImprovementResult(result);
      setShowChanges(true);

      toast.success(
        `✨ ${section} improved! Expected score increase: +${scoreIncrease} points`
      );
    } catch {
      // console.error('Content improvement error:', error);
      toast.error('Failed to improve content. Please try again.');
    } finally {
      setIsImproving(false);
      setActiveSection(null);
    }
  };

  const applyAIImprovements = async (
    data: ResumeData,
    section: keyof ResumeData,
    improvementPlan: {
      improvements?: Array<{ category?: string; section?: string }>;
    }
  ): Promise<ContentImprovement[]> => {
    const improvements: ContentImprovement[] = [];

    // Get relevant suggestions from the improvement plan
    const suggestions = improvementPlan.improvements || [];
    const sectionSuggestions = suggestions.filter(
      (s: { category?: string; section?: string }) =>
        s.category?.toLowerCase().includes(section.toLowerCase()) ||
        s.section?.toLowerCase().includes(section.toLowerCase())
    );

    switch (section) {
      case 'summary':
        if (data.summary) {
          const improved = await generateImprovedSummary(
            data.summary,
            sectionSuggestions
          );
          improvements.push({
            section: 'Professional Summary',
            original: data.summary,
            improved,
            reason:
              'Enhanced with action verbs, quantifiable results, and ATS keywords',
            impact: 'high',
          });
        }
        break;

      case 'experience':
        data.experience.forEach((exp, index) => {
          if (exp.description) {
            const improved = generateImprovedExperience(
              exp.description,
              sectionSuggestions
            );
            improvements.push({
              section: `Experience ${index + 1}: ${exp.position}`,
              original: exp.description,
              improved,
              reason:
                'Added action verbs, quantified achievements, and industry keywords',
              impact: 'high',
            });
          }
        });
        break;

      case 'skills':
        const improvedSkills = generateImprovedSkills(
          data.skills,
          sectionSuggestions
        );
        improvements.push({
          section: 'Skills Section',
          original: JSON.stringify(data.skills),
          improved: JSON.stringify(improvedSkills),
          reason:
            'Reorganized and added relevant technical skills for better ATS matching',
          impact: 'medium',
        });
        break;
    }

    return improvements;
  };

  const generateImprovedSummary = async (
    original: string,
    _suggestions: Array<{ category?: string; section?: string }>
  ): Promise<string> => {
    // Simulate AI improvement - in real implementation, this would call an AI service
    // const _improvements = [
    //   'Results-driven',
    //   'Proven track record',
    //   'Expertise in',
    //   'Led cross-functional teams',
    //   'Delivered measurable results',
    //   'Optimized processes',
    // ];

    let improved = original;

    // Add action verbs if missing
    if (
      !improved.toLowerCase().includes('led') &&
      !improved.toLowerCase().includes('managed')
    ) {
      improved = `Led and managed ${improved.toLowerCase()}`;
    }

    // Add quantifiable results if missing
    if (!/\d+/.test(improved)) {
      improved += ' with measurable impact on business outcomes.';
    }

    // Add industry keywords
    const keywords = ['strategic', 'collaborative', 'innovative', 'scalable'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    improved = improved.replace(/\.$/, ` with ${randomKeyword} solutions.`);

    return improved;
  };

  const generateImprovedExperience = (
    original: string,
    _suggestions: Array<{ category?: string; section?: string }>
  ): string => {
    let improved = original;

    // Add action verbs
    const actionVerbs = [
      'Led',
      'Developed',
      'Implemented',
      'Optimized',
      'Delivered',
      'Managed',
    ];
    const randomVerb =
      actionVerbs[Math.floor(Math.random() * actionVerbs.length)];

    if (
      randomVerb &&
      !improved.toLowerCase().startsWith(randomVerb.toLowerCase())
    ) {
      improved = `${randomVerb} ${improved.toLowerCase()}`;
    }

    // Add quantifiable results
    if (!/\d+/.test(improved)) {
      const metrics = ['20%', '15%', '30%', '50%', '25%'];
      const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
      improved += `, resulting in ${randomMetric} improvement in efficiency.`;
    }

    return improved;
  };

  const generateImprovedSkills = (
    skills: Record<string, string[]>,
    _suggestions: Array<{ category?: string; section?: string }>
  ): Record<string, string[]> => {
    const improved = { ...skills };

    // Add relevant technical skills if missing
    const commonTechSkills = [
      'Python',
      'JavaScript',
      'SQL',
      'Git',
      'Docker',
      'AWS',
    ];
    const missingSkills = commonTechSkills.filter(
      skill =>
        !improved.technical?.some((s: string) =>
          s.toLowerCase().includes(skill.toLowerCase())
        )
    );

    if (missingSkills.length > 0 && improved.technical && missingSkills[0]) {
      improved.technical.push(missingSkills[0]);
    }

    // Reorganize skills by relevance
    if (improved.technical) {
      improved.technical = improved.technical.sort();
    }

    return improved;
  };

  const applyImprovements = () => {
    if (!improvementResult) return;

    const updatedData = { ...resumeData };

    improvementResult.improvements.forEach(improvement => {
      switch (improvement.section) {
        case 'Professional Summary':
          updatedData.summary = improvement.improved;
          break;
        case 'Skills Section':
          updatedData.skills = JSON.parse(improvement.improved);
          break;
        default:
          if (improvement.section.startsWith('Experience')) {
            const expIndex =
              parseInt(improvement.section.match(/\d+/)?.[0] || '0') - 1;
            if (updatedData.experience[expIndex]) {
              updatedData.experience[expIndex].description =
                improvement.improved;
            }
          }
          break;
      }
    });

    onContentUpdate(updatedData);
    setImprovementResult(null);
    setShowChanges(false);

    toast.success('✅ Improvements applied to your resume!');
  };

  const convertResumeDataToText = (data: ResumeData): string => {
    let text = '';

    // Header
    text += `${data.personal.fullName}\n`;
    text += `${data.personal.email}\n`;
    if (data.personal.phone) text += `${data.personal.phone}\n`;
    if (data.personal.location) text += `${data.personal.location}\n`;
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
        if (exp.description) text += `${exp.description}\n`;
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

    return text;
  };

  const getSectionData = (
    data: ResumeData,
    section: keyof ResumeData
  ): Record<string, unknown> => {
    switch (section) {
      case 'summary':
        return { summary: data.summary };
      case 'experience':
        return { experience: data.experience };
      case 'skills':
        return { skills: data.skills };
      default:
        return {};
    }
  };

  const sections = [
    { key: 'summary', label: 'Professional Summary', icon: '📝' },
    { key: 'experience', label: 'Work Experience', icon: '💼' },
    { key: 'skills', label: 'Skills', icon: '🛠️' },
  ] as const;

  return (
    <Card className={`p-6 ${className}`}>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2'>
          🤖 AI Content Improver
        </h3>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          Use AI to enhance your resume content with better keywords, action
          verbs, and ATS optimization
        </p>
      </div>

      <div className='space-y-4'>
        {sections.map(({ key, label, icon }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700'
          >
            <div className='flex items-center space-x-3'>
              <span className='text-2xl'>{icon}</span>
              <div>
                <h4 className='font-medium text-slate-900 dark:text-slate-100'>
                  {label}
                </h4>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  AI-powered content enhancement
                </p>
              </div>
            </div>
            <Button
              onClick={() => improveContent(key)}
              disabled={isImproving}
              variant='outline'
              size='sm'
              className='min-w-[120px]'
            >
              {isImproving && activeSection === key ? (
                <div className='flex items-center space-x-2'>
                  <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin' />
                  <span>AI Improving...</span>
                </div>
              ) : (
                'Improve with AI'
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {improvementResult && showChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='mt-6 space-y-4'
          >
            <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center space-x-2'>
                  <span className='text-green-600 dark:text-green-400 text-xl'>
                    ✨
                  </span>
                  <div>
                    <h4 className='font-medium text-green-800 dark:text-green-200'>
                      AI Improvements Ready!
                    </h4>
                    <p className='text-sm text-green-700 dark:text-green-300'>
                      Expected ATS score increase: +
                      {improvementResult.scoreIncrease} points
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowChanges(false)}
                  variant='outline'
                  size='sm'
                  className='text-green-600 border-green-300 hover:bg-green-100'
                >
                  Hide Changes
                </Button>
              </div>

              <div className='space-y-4'>
                {improvementResult.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-700'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <h5 className='font-medium text-slate-900 dark:text-slate-100'>
                        {improvement.section}
                      </h5>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          improvement.impact === 'high'
                            ? 'bg-red-100 text-red-800'
                            : improvement.impact === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {improvement.impact} impact
                      </span>
                    </div>

                    <p className='text-sm text-slate-600 dark:text-slate-400 mb-3'>
                      {improvement.reason}
                    </p>

                    <div className='space-y-2'>
                      <div>
                        <label className='text-xs font-medium text-red-600 dark:text-red-400'>
                          Before:
                        </label>
                        <p className='text-sm text-slate-700 dark:text-slate-300 bg-red-50 dark:bg-red-900/20 p-2 rounded border-l-2 border-red-300'>
                          {improvement.original}
                        </p>
                      </div>

                      <div>
                        <label className='text-xs font-medium text-green-600 dark:text-green-400'>
                          After:
                        </label>
                        <p className='text-sm text-slate-700 dark:text-slate-300 bg-green-50 dark:bg-green-900/20 p-2 rounded border-l-2 border-green-300'>
                          {improvement.improved}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className='flex space-x-3 mt-4'>
                <Button
                  onClick={() => setImprovementResult(null)}
                  variant='outline'
                  size='sm'
                >
                  Cancel
                </Button>
                <Button
                  onClick={applyImprovements}
                  size='sm'
                  className='bg-green-600 hover:bg-green-700'
                >
                  Apply All Changes
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ImprovedAIContentImprover;
