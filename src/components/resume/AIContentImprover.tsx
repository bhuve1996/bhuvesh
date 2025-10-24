'use client';

import { motion } from 'framer-motion';
import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';
import { ResumeData } from '@/types/resume';

interface AIContentImproverProps {
  resumeData: ResumeData;
  onContentUpdate: (updatedData: ResumeData) => void;
  className?: string;
}

export const AIContentImprover: React.FC<AIContentImproverProps> = ({
  resumeData,
  onContentUpdate,
  className = '',
}) => {
  const [isImproving, setIsImproving] = useState(false);
  const [improvedContent, setImprovedContent] = useState<ResumeData | null>(
    null
  );
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const improveContent = async (section: keyof ResumeData) => {
    setIsImproving(true);
    setActiveSection(section);

    try {
      // Simulate AI improvement (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const improved = { ...resumeData };

      switch (section) {
        case 'summary':
          improved.summary = `${resumeData.summary} Enhanced with AI-powered optimization to highlight key achievements and skills more effectively.`;
          break;
        case 'experience':
          improved.experience = resumeData.experience.map(exp => ({
            ...exp,
            description: `${exp.description} Optimized with action verbs and quantifiable results.`,
            achievements: exp.achievements?.map(
              ach => `${ach} (AI-enhanced for impact)`
            ),
          }));
          break;
        case 'skills':
          improved.skills = {
            ...resumeData.skills,
            technical: [
              ...(resumeData.skills.technical || []),
              'AI-Enhanced Skills',
            ],
            business: [
              ...(resumeData.skills.business || []),
              'Strategic Thinking',
            ],
          };
          break;
      }

      setImprovedContent(improved);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setIsImproving(false);
      setActiveSection(null);
    }
  };

  const applyImprovements = () => {
    if (improvedContent) {
      onContentUpdate(improvedContent);
      setImprovedContent(null);
    }
  };

  const sections = [
    { key: 'summary', label: 'Professional Summary', icon: '📝' },
    { key: 'experience', label: 'Work Experience', icon: '💼' },
    { key: 'skills', label: 'Skills', icon: '🎯' },
  ] as const;

  return (
    <Card className={`p-6 ${className}`}>
      <div className='mb-6'>
        <h3 className='text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2'>
          🤖 AI Content Improver
        </h3>
        <p className='text-sm text-slate-600 dark:text-slate-400'>
          Enhance your resume content with AI-powered suggestions for better ATS
          compatibility and impact.
        </p>
      </div>

      <div className='space-y-4'>
        {sections.map(({ key, label, icon }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sections.findIndex(s => s.key === key) }}
            className='flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700'
          >
            <div className='flex items-center space-x-3'>
              <span className='text-2xl'>{icon}</span>
              <div>
                <h4 className='font-medium text-slate-900 dark:text-slate-100'>
                  {label}
                </h4>
                <p className='text-sm text-slate-600 dark:text-slate-400'>
                  Optimize for ATS and impact
                </p>
              </div>
            </div>
            <Button
              onClick={() => improveContent(key)}
              disabled={isImproving}
              variant='outline'
              size='sm'
              className='min-w-[100px]'
            >
              {isImproving && activeSection === key ? (
                <div className='flex items-center space-x-2'>
                  <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                  <span>Improving...</span>
                </div>
              ) : (
                'Improve'
              )}
            </Button>
          </motion.div>
        ))}
      </div>

      {improvedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <span className='text-green-600 dark:text-green-400'>✅</span>
              <span className='text-sm font-medium text-green-800 dark:text-green-200'>
                Content improved! Review and apply changes.
              </span>
            </div>
            <div className='flex space-x-2'>
              <Button
                onClick={() => setImprovedContent(null)}
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
                Apply Changes
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

export default AIContentImprover;
