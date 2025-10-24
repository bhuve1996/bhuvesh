'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { atsApi } from '@/api/endpoints/ats';
import { Button } from '@/components/atoms/Button/Button';
import { StatusBadge } from '@/components/molecules/StatusBadge/StatusBadge';
import { Card } from '@/components/ui/Card';
import type { AIContentTabProps } from '@/types';

export const AIContentTab: React.FC<AIContentTabProps> = ({ resumeData }) => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvementResult, setImprovementResult] = useState<{
    section: string;
    improvements: string[];
  } | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const improveContent = async (section: keyof ResumeData) => {
    setIsImproving(true);
    setActiveSection(section);

    try {
      // Convert resume data to text for analysis
      const resumeText = convertResumeDataToText(resumeData);

      // Create a File object for the current resume
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const file = new File([blob], 'resume.txt', { type: 'text/plain' });

      // Get improvement plan
      const analysisResult = await atsApi.extractExperience(file);

      if (analysisResult.success && analysisResult.data) {
        const improvementPlan = await atsApi.getImprovementPlan(
          analysisResult.data,
          { text: resumeText, sections: getSectionData(resumeData, section) },
          undefined
        );

        if (improvementPlan.success && improvementPlan.data) {
          setImprovementResult({
            section,
            improvements: (improvementPlan.data as any).improvements || [],
          });
          toast.success('AI improvements generated!');
        }
      }
    } catch (error) {
      toast.error('Failed to generate AI improvements');
      console.error('AI Improvement Error:', error);
    } finally {
      setIsImproving(false);
      setActiveSection(null);
    }
  };

  const convertResumeDataToText = (data: ResumeData): string => {
    let text = '';
    if (data.personal) {
      text += `${data.personal.fullName}\n${data.personal.email}\n${data.personal.phone}\n`;
    }
    if (data.summary) text += `SUMMARY\n${data.summary}\n\n`;
    if (data.experience) {
      data.experience.forEach(exp => {
        text += `${exp.title} at ${exp.company}\n${exp.description}\n\n`;
      });
    }
    return text;
  };

  const getSectionData = (data: ResumeData, section: keyof ResumeData) => {
    return data[section];
  };

  const sections = [
    { key: 'summary', label: 'Professional Summary', icon: '📝' },
    { key: 'experience', label: 'Work Experience', icon: '💼' },
    { key: 'skills', label: 'Skills', icon: '🛠️' },
  ] as const;

  return (
    <div className='p-4 space-y-4 h-full overflow-y-auto'>
      <div className='text-center'>
        <h4 className='text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
          AI Content Improvement
        </h4>
        <p className='text-sm text-neutral-600 dark:text-neutral-400'>
          Get AI-powered suggestions to improve your resume content
        </p>
      </div>

      <div className='space-y-3'>
        {sections.map(section => (
          <Card key={section.key} className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <span className='text-2xl'>{section.icon}</span>
                <div>
                  <h5 className='font-medium text-neutral-900 dark:text-neutral-100'>
                    {section.label}
                  </h5>
                  <p className='text-sm text-neutral-600 dark:text-neutral-400'>
                    Improve this section with AI
                  </p>
                </div>
              </div>
              <Button
                onClick={() => improveContent(section.key as keyof ResumeData)}
                loading={isImproving && activeSection === section.key}
                variant='outline'
                size='sm'
              >
                Improve
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {improvementResult && (
        <Card className='p-4'>
          <h5 className='font-medium text-neutral-900 dark:text-neutral-100 mb-3'>
            AI Improvements for {improvementResult.section}
          </h5>
          <ul className='space-y-2'>
            {improvementResult.improvements.map((improvement, index) => (
              <li key={index} className='flex items-start gap-2'>
                <StatusBadge status='info' size='sm' icon='✨'>
                  Suggestion
                </StatusBadge>
                <span className='text-sm text-neutral-700 dark:text-neutral-300'>
                  {improvement}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

export default AIContentTab;
