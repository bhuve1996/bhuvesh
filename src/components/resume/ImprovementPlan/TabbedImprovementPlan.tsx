'use client';

import React from 'react';

import { Tabs } from '@/components/ui/Tabs';
import type { ImprovementItem, ImprovementPlanProps } from '@/types';

import { ImprovementPlan } from './ImprovementPlan';

export const TabbedImprovementPlan: React.FC<ImprovementPlanProps> = ({
  improvements,
  summary,
  quick_wins,
  currentScore,
}) => {
  // Group improvements by category
  const groupedImprovements = improvements.reduce(
    (acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, ImprovementItem[]>
  );

  // Group improvements by priority
  const priorityGroups = {
    critical: improvements.filter(i => i.priority === 'critical'),
    high: improvements.filter(i => i.priority === 'high'),
    medium: improvements.filter(i => i.priority === 'medium'),
    low: improvements.filter(i => i.priority === 'low'),
  };

  // Category labels and icons
  const categoryLabels = {
    ats: 'ATS Compatibility',
    keyword: 'Keyword Optimization',
    formatting: 'Formatting',
    content: 'Content Quality',
    structure: 'Structure',
    experience: 'Experience',
    skills: 'Skills',
    education: 'Education',
    other: 'Other',
  };

  const categoryIcons = {
    ats: '🤖',
    keyword: '🔑',
    formatting: '📝',
    content: '✍️',
    structure: '🏗️',
    experience: '💼',
    skills: '🛠️',
    education: '🎓',
    other: '📋',
  };

  const priorityLabels = {
    critical: 'Critical',
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  const priorityIcons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
  };

  // Create tab items
  const tabItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊',
      content: (
        <ImprovementPlan
          improvements={improvements}
          summary={
            summary || {
              total_improvements: 0,
              high_priority: 0,
              estimated_impact: 0,
              estimated_time: '0 min',
            }
          }
          quick_wins={quick_wins || []}
          currentScore={currentScore || 0}
        />
      ),
    },
    {
      id: 'quick-wins',
      label: 'Quick Wins',
      icon: '⚡',
      badge: quick_wins?.length || 0,
      content:
        quick_wins && quick_wins.length > 0 ? (
          <div className='space-y-6'>
            <div className='bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-300 dark:border-yellow-500/30 rounded-xl p-6'>
              <h3 className='text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-4'>
                ⚡ Quick Wins - Start Here!
              </h3>
              <p className='text-slate-600 dark:text-gray-300 mb-4'>
                These {quick_wins.length} improvements will give you the biggest
                score boost with the least effort:
              </p>
              <div className='space-y-3'>
                {quick_wins.map(item => (
                  <div
                    key={item.id}
                    className='flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 gap-3'
                  >
                    <div className='flex items-start gap-3 flex-1'>
                      <span className='text-2xl flex-shrink-0'>
                        {categoryIcons[
                          item.category as keyof typeof categoryIcons
                        ] || '📋'}
                      </span>
                      <div className='flex-1 min-w-0'>
                        <div className='font-semibold text-slate-900 dark:text-white break-words'>
                          {item.title}
                        </div>
                        <div className='text-sm text-slate-600 dark:text-gray-400 break-words'>
                          {item.description}
                        </div>
                      </div>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <div className='text-2xl font-bold text-green-600 dark:text-green-400'>
                        +{item.score_impact || item.impact || 0}
                      </div>
                      <div className='text-xs text-slate-500 dark:text-gray-400'>
                        points
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className='text-center py-6'>
            <div className='text-6xl mb-4'>⚡</div>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>
              No Quick Wins Available
            </h3>
            <p className='text-slate-600 dark:text-gray-300'>
              All improvements require similar effort levels.
            </p>
          </div>
        ),
    },
    {
      id: 'by-category',
      label: 'By Category',
      icon: '📂',
      badge: Object.keys(groupedImprovements).length,
      content: (
        <div className='space-y-6'>
          {Object.entries(groupedImprovements).map(([category, items]) => (
            <div key={category} className='space-y-4'>
              <div className='flex items-center gap-3'>
                <span className='text-2xl'>
                  {categoryIcons[category as keyof typeof categoryIcons] ||
                    '📋'}
                </span>
                <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                  {categoryLabels[category as keyof typeof categoryLabels] ||
                    'Other'}
                </h3>
                <span className='px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm'>
                  {items.length} items
                </span>
              </div>
              <div className='grid gap-4'>
                {items.map(item => (
                  <div
                    key={item.id}
                    className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <h4 className='font-semibold text-slate-900 dark:text-white mb-2'>
                          {item.title}
                        </h4>
                        <p className='text-slate-600 dark:text-gray-300 text-sm mb-3'>
                          {item.description}
                        </p>
                        <div className='flex gap-2'>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              item.priority === 'critical'
                                ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                                : item.priority === 'high'
                                  ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300'
                                  : item.priority === 'medium'
                                    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                                    : 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-xl font-bold text-green-600 dark:text-green-400'>
                          +{item.score_impact || item.impact || 0}
                        </div>
                        <div className='text-xs text-slate-500 dark:text-gray-400'>
                          points
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'by-priority',
      label: 'By Priority',
      icon: '🎯',
      badge: Object.values(priorityGroups).filter(group => group.length > 0)
        .length,
      content: (
        <div className='space-y-6'>
          {Object.entries(priorityGroups).map(([priority, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={priority} className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <span className='text-2xl'>
                    {priorityIcons[priority as keyof typeof priorityIcons]}
                  </span>
                  <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
                    {priorityLabels[priority as keyof typeof priorityLabels]}
                  </h3>
                  <span className='px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm'>
                    {items.length} items
                  </span>
                </div>
                <div className='grid gap-4'>
                  {items.map(item => (
                    <div
                      key={item.id}
                      className='bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700'
                    >
                      <div className='flex items-start justify-between gap-4'>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-2'>
                            <span className='text-lg'>
                              {categoryIcons[
                                item.category as keyof typeof categoryIcons
                              ] || '📋'}
                            </span>
                            <h4 className='font-semibold text-slate-900 dark:text-white'>
                              {item.title}
                            </h4>
                          </div>
                          <p className='text-slate-600 dark:text-gray-300 text-sm mb-3'>
                            {item.description}
                          </p>
                          <div className='flex gap-2'>
                            <span className='px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'>
                              {categoryLabels[
                                item.category as keyof typeof categoryLabels
                              ] || 'Other'}
                            </span>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-xl font-bold text-green-600 dark:text-green-400'>
                            +{item.score_impact || item.impact || 0}
                          </div>
                          <div className='text-xs text-slate-500 dark:text-gray-400'>
                            points
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      <Tabs items={tabItems} variant='pills' className='w-full' />
    </div>
  );
};

export default TabbedImprovementPlan;
