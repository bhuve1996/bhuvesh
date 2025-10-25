/**
 * Demo component to showcase AI content restructuring
 */

import React, { useState } from 'react';

import { Button } from '@/components/atoms/Button/Button';
import { ContentRestructuringService } from '@/lib/ai/contentRestructuring';

export const ContentRestructuringDemo: React.FC = () => {
  const [originalText] = useState(
    'Engineered scalable UI components, reusable Storybook modules, and integrated Contentful CMS to enable dynamic, global content delivery. Developed modular UI components, optimized SEO and load performance, and streamlined content workflows through Contentful and Storybook integration. Architected and customized Sitecore templates with Vue.js and SCSS, ensuring scalable and reusable frontend modules for events and campaigns. Integrated Mapbox for interactive maps, customized React components for destination discovery, and improved accessibility across devices. Rebuilt catalog and checkout flows with Next.js and GraphQL, optimized performance with Vercel deployments, and ensured responsive customer journeys.'
  );

  const [restructuredContent, setRestructuredContent] = useState<{
    achievements: string[];
    keyTechnologies: string[];
    responsibilities: string[];
    impactMetrics: string[];
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRestructure = async () => {
    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      const restructured =
        ContentRestructuringService.restructureExperienceDescription(
          originalText
        );
      setRestructuredContent(restructured);
    } catch (_error) {
      // Restructuring failed
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='p-6 space-y-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700'>
      <div className='text-center'>
        <h3 className='text-xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
          🤖 AI Content Restructuring Demo
        </h3>
        <p className='text-slate-600 dark:text-slate-400'>
          See how AI automatically organizes and structures your resume content
        </p>
      </div>

      {/* Original Content */}
      <div className='space-y-3'>
        <h4 className='font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2'>
          <span className='text-red-500'>📝</span>
          Original Content (Raw Text)
        </h4>
        <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
          <p className='text-sm text-slate-700 dark:text-slate-300 leading-relaxed'>
            {originalText}
          </p>
        </div>
      </div>

      {/* Restructure Button */}
      <div className='text-center'>
        <Button
          onClick={handleRestructure}
          disabled={isProcessing}
          variant='primary'
          className='px-6 py-3'
        >
          {isProcessing ? (
            <>
              <span className='animate-spin mr-2'>⏳</span>
              AI is restructuring...
            </>
          ) : (
            <>
              <span className='mr-2'>🚀</span>
              Restructure with AI
            </>
          )}
        </Button>
      </div>

      {/* Restructured Content */}
      {restructuredContent && (
        <div className='space-y-4'>
          <h4 className='font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2'>
            <span className='text-green-500'>✨</span>
            AI-Restructured Content (Organized)
          </h4>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Key Achievements */}
            {restructuredContent.achievements.length > 0 && (
              <div className='p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                <h5 className='font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2'>
                  <span>🎯</span>
                  Key Achievements ({restructuredContent.achievements.length})
                </h5>
                <ul className='space-y-1'>
                  {restructuredContent.achievements.map(
                    (achievement: string, index: number) => (
                      <li
                        key={index}
                        className='text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2'
                      >
                        <span className='text-green-600 dark:text-green-400 mt-1'>
                          •
                        </span>
                        <span>{achievement}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Key Technologies */}
            {restructuredContent.keyTechnologies.length > 0 && (
              <div className='p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                <h5 className='font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2'>
                  <span>💻</span>
                  Technologies Used (
                  {restructuredContent.keyTechnologies.length})
                </h5>
                <div className='flex flex-wrap gap-2'>
                  {restructuredContent.keyTechnologies.map(
                    (tech: string, index: number) => (
                      <span
                        key={index}
                        className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium'
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {restructuredContent.responsibilities.length > 0 && (
              <div className='p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg'>
                <h5 className='font-semibold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2'>
                  <span>📋</span>
                  Responsibilities (
                  {restructuredContent.responsibilities.length})
                </h5>
                <ul className='space-y-1'>
                  {restructuredContent.responsibilities.map(
                    (responsibility: string, index: number) => (
                      <li
                        key={index}
                        className='text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2'
                      >
                        <span className='text-purple-600 dark:text-purple-400 mt-1'>
                          •
                        </span>
                        <span>{responsibility}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Impact Metrics */}
            {restructuredContent.impactMetrics.length > 0 && (
              <div className='p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
                <h5 className='font-semibold text-orange-800 dark:text-orange-200 mb-2 flex items-center gap-2'>
                  <span>📊</span>
                  Impact & Results ({restructuredContent.impactMetrics.length})
                </h5>
                <ul className='space-y-1'>
                  {restructuredContent.impactMetrics.map(
                    (metric: string, index: number) => (
                      <li
                        key={index}
                        className='text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2'
                      >
                        <span className='text-orange-600 dark:text-orange-400 mt-1'>
                          ✓
                        </span>
                        <span>{metric}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className='p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg'>
            <h5 className='font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2'>
              <span>📈</span>
              AI Analysis Summary
            </h5>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
              <div className='p-2 bg-white dark:bg-slate-800 rounded border'>
                <div className='text-lg font-bold text-green-600 dark:text-green-400'>
                  {restructuredContent.achievements.length}
                </div>
                <div className='text-xs text-slate-600 dark:text-slate-400'>
                  Achievements
                </div>
              </div>
              <div className='p-2 bg-white dark:bg-slate-800 rounded border'>
                <div className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                  {restructuredContent.keyTechnologies.length}
                </div>
                <div className='text-xs text-slate-600 dark:text-slate-400'>
                  Technologies
                </div>
              </div>
              <div className='p-2 bg-white dark:bg-slate-800 rounded border'>
                <div className='text-lg font-bold text-purple-600 dark:text-purple-400'>
                  {restructuredContent.responsibilities.length}
                </div>
                <div className='text-xs text-slate-600 dark:text-slate-400'>
                  Responsibilities
                </div>
              </div>
              <div className='p-2 bg-white dark:bg-slate-800 rounded border'>
                <div className='text-lg font-bold text-orange-600 dark:text-orange-400'>
                  {restructuredContent.impactMetrics.length}
                </div>
                <div className='text-xs text-slate-600 dark:text-slate-400'>
                  Impact Metrics
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits */}
      <div className='p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg'>
        <h5 className='font-semibold text-cyan-800 dark:text-cyan-200 mb-2 flex items-center gap-2'>
          <span>💡</span>
          Benefits of AI Content Restructuring
        </h5>
        <ul className='space-y-1 text-sm text-slate-700 dark:text-slate-300'>
          <li className='flex items-start gap-2'>
            <span className='text-cyan-600 dark:text-cyan-400 mt-1'>✓</span>
            <span>
              Automatically extracts and organizes key achievements into bullet
              points
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-cyan-600 dark:text-cyan-400 mt-1'>✓</span>
            <span>
              Identifies and categorizes technologies used in each role
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-cyan-600 dark:text-cyan-400 mt-1'>✓</span>
            <span>
              Separates responsibilities from achievements for better clarity
            </span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-cyan-600 dark:text-cyan-400 mt-1'>✓</span>
            <span>Highlights impact metrics and quantifiable results</span>
          </li>
          <li className='flex items-start gap-2'>
            <span className='text-cyan-600 dark:text-cyan-400 mt-1'>✓</span>
            <span>Improves readability and professional presentation</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
