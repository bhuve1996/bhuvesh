'use client';

import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { Card } from '@/components/ui/Card';

interface AIAssistantProps {
  onSuggestion: (suggestion: string) => void;
  context?: string;
  type?:
    | 'summary'
    | 'experience'
    | 'project'
    | 'achievement'
    | 'personal'
    | 'education'
    | 'skills'
    | 'certifications'
    | 'achievements';
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onSuggestion,
  context = '',
  type = 'summary',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = async () => {
    setIsGenerating(true);

    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockSuggestions = {
      summary: [
        'Results-driven software engineer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering high-impact projects that improved user engagement by 40%.',
        'Passionate full-stack developer specializing in modern JavaScript frameworks and microservices architecture. Strong background in agile development methodologies and experience with AWS cloud infrastructure. Committed to writing clean, maintainable code and mentoring junior developers.',
        'Innovative product manager with expertise in user research, data analysis, and cross-functional team leadership. Successfully launched 3 major product features that increased revenue by 25% and improved customer satisfaction scores by 30%.',
      ],
      experience: [
        'Led development of a microservices-based e-commerce platform serving 100K+ daily active users, resulting in 40% improvement in page load times and 25% increase in conversion rates.',
        'Architected and implemented a real-time data processing pipeline using Apache Kafka and Redis, reducing data latency by 60% and enabling real-time analytics for business stakeholders.',
        'Collaborated with product and design teams to deliver user-centered features, conducting A/B tests that improved user engagement metrics by 35% and reduced churn rate by 20%.',
      ],
      project: [
        'Built a full-stack social media analytics dashboard using React, Node.js, and MongoDB. Features include real-time data visualization, user sentiment analysis, and automated reporting. Deployed on AWS with CI/CD pipeline handling 10K+ API requests daily.',
        'Developed a machine learning-powered recommendation engine for an e-commerce platform using Python, TensorFlow, and PostgreSQL. Achieved 30% improvement in click-through rates and 15% increase in average order value.',
        'Created a mobile-first progressive web app for food delivery using React Native and Firebase. Implemented offline functionality, push notifications, and real-time order tracking, serving 5K+ active users.',
      ],
      achievement: [
        'Led a team of 5 developers to deliver a critical project 2 weeks ahead of schedule, resulting in $500K in additional revenue and improved client satisfaction.',
        'Implemented automated testing framework that reduced bug reports by 50% and decreased deployment time from 2 hours to 15 minutes.',
        'Mentored 3 junior developers, helping them advance to mid-level positions and contributing to a 40% reduction in team onboarding time.',
      ],
    };

    setSuggestions(mockSuggestions[type as keyof typeof mockSuggestions] || []);
    setIsGenerating(false);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onSuggestion(suggestion);
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
          <svg
            className='w-5 h-5 mr-2 text-cyan-500'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
            />
          </svg>
          AI Writing Assistant
        </h3>
        <Button
          onClick={generateSuggestions}
          disabled={isGenerating}
          size='sm'
          className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
        >
          {isGenerating ? (
            <>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
              Generating...
            </>
          ) : (
            <>
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
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
              Generate Ideas
            </>
          )}
        </Button>
      </div>

      <p className='text-sm text-gray-600 mb-4'>
        Get AI-powered suggestions to improve your {type} content. Click
        &quot;Generate Ideas&quot; to see personalized recommendations.
      </p>

      {suggestions.length > 0 && (
        <div className='space-y-3'>
          <h4 className='font-medium text-gray-900'>Suggested Content:</h4>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className='p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors cursor-pointer group'
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <p className='text-sm text-gray-700 group-hover:text-gray-900 transition-colors'>
                {suggestion}
              </p>
              <div className='flex justify-end mt-2'>
                <Button
                  size='sm'
                  variant='ghost'
                  className='opacity-0 group-hover:opacity-100 transition-opacity text-cyan-600 hover:text-cyan-700'
                >
                  Use This
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {context && (
        <div className='mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200'>
          <p className='text-xs text-blue-800'>
            <strong>Context:</strong> {context}
          </p>
        </div>
      )}
    </Card>
  );
};

export default AIAssistant;
