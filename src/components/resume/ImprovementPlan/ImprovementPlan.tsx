'use client';

import React, { useState } from 'react';

import { Icons } from '@/components/ui/SVG';
import type { ImprovementItem, ImprovementPlanProps } from '@/types';

export const ImprovementPlan: React.FC<ImprovementPlanProps> = ({
  improvements,
  summary,
  quick_wins,
  currentScore,
}) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    const newCompleted = new Set(completed);
    if (completed.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const completedImpact = improvements
    .filter(i => completed.has(i.id))
    .reduce((sum, i) => sum + (i.score_impact || i.impact || 0), 0);

  const projectedScore = Math.min((currentScore || 0) + completedImpact, 100);

  const priorityColors = {
    critical: 'border-red-600 bg-red-50 dark:bg-red-500/10',
    high: 'border-orange-600 bg-orange-50 dark:bg-orange-500/10',
    medium: 'border-amber-600 bg-amber-50 dark:bg-yellow-500/10',
    low: 'border-blue-600 bg-blue-50 dark:bg-blue-500/10',
  };

  const priorityIcons = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🔵',
  };

  const categoryIcons = {
    keyword: '🔑',
    format: '📝',
    formatting: '📝',
    content: '✍️',
    experience: '💼',
    skills: '🛠️',
    education: '🎓',
    ats: '🤖',
    structure: '🏗️',
    other: '📋',
  };

  const categoryColors = {
    ats: 'from-red-100 to-pink-100 dark:from-red-500/20 dark:to-pink-500/20 border-red-300 dark:border-red-500/30',
    keyword:
      'from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 border-blue-300 dark:border-blue-500/30',
    formatting:
      'from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 border-green-300 dark:border-green-500/30',
    content:
      'from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/20 border-purple-300 dark:border-purple-500/30',
    structure:
      'from-orange-100 to-amber-100 dark:from-orange-500/20 dark:to-amber-500/20 border-orange-300 dark:border-orange-500/30',
    other:
      'from-slate-100 to-gray-100 dark:from-gray-500/20 dark:to-slate-500/20 border-slate-300 dark:border-gray-500/30',
  };

  const categoryLabels = {
    ats: 'ATS Compatibility',
    keyword: 'Keyword Optimization',
    formatting: 'Formatting',
    content: 'Content Quality',
    structure: 'Structure',
    other: 'Other',
  };

  return (
    <div className='space-y-8'>
      {/* Header with Score Projection */}
      <div className='bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-300 dark:border-cyan-400/30 rounded-xl p-6'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>
              📈 Improvement Plan
            </h2>
            <p className='text-slate-600 dark:text-gray-300'>
              Complete these{' '}
              {summary?.total_improvements || improvements.length} improvements
              to boost your ATS score
            </p>
          </div>
          <div className='text-right'>
            <div className='text-3xl md:text-4xl font-bold text-cyan-600 dark:text-cyan-400'>
              {currentScore}
              <span className='text-slate-500 dark:text-gray-400 mx-2'>→</span>
              <span className='text-green-600 dark:text-green-400'>
                {projectedScore}
              </span>
            </div>
            <div className='text-sm text-slate-500 dark:text-gray-400 mt-1'>
              Current → Potential Score
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='mt-6'>
          <div className='flex justify-between text-sm text-slate-600 dark:text-gray-300 mb-2'>
            <span>
              Progress: {completed.size} /{' '}
              {summary?.total_improvements || improvements.length}
            </span>
            <span>+{completedImpact} points so far</span>
          </div>
          <div className='w-full bg-slate-200 dark:bg-gray-700 rounded-full h-3'>
            <div
              className='bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 h-3 rounded-full transition-all duration-500'
              style={{
                width: `${(completed.size / (summary?.total_improvements || improvements.length)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Wins Section */}
      {quick_wins && quick_wins.length > 0 && (
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
                    {categoryIcons[item.category]}
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
      )}

      {/* Enhanced Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Priority Summary */}
        {(['critical', 'high', 'medium', 'low'] as const).map(priority => (
          <div
            key={priority}
            className={`border-2 rounded-lg p-4 ${priorityColors[priority]}`}
          >
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-2xl'>{priorityIcons[priority]}</span>
              <span className='font-semibold text-slate-900 dark:text-white capitalize'>
                {priority}
              </span>
            </div>
            <div className='text-3xl font-bold text-slate-900 dark:text-white'>
              {improvements.filter(i => i.priority === priority).length}
            </div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className='bg-slate-50 dark:bg-slate-800/30 rounded-xl p-6 border border-slate-200 dark:border-slate-700'>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white mb-4'>
          📊 Improvement Categories
        </h3>
        <div className='grid grid-cols-3 md:grid-cols-4 gap-4'>
          {Object.entries(categoryLabels).map(([category, label]) => {
            const categoryImprovements = improvements.filter(
              i => i.category === category
            );
            if (categoryImprovements.length === 0) return null;

            const totalImpact = categoryImprovements.reduce(
              (sum, i) => sum + (i.score_impact || i.impact || 0),
              0
            );

            return (
              <div
                key={category}
                className={`bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} rounded-lg p-4 border`}
              >
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xl'>
                    {categoryIcons[category as keyof typeof categoryIcons]}
                  </span>
                  <span className='font-semibold text-slate-900 dark:text-white text-sm'>
                    {label}
                  </span>
                </div>
                <div className='text-2xl font-bold text-slate-900 dark:text-white'>
                  {categoryImprovements.length}
                </div>
                <div className='text-xs text-slate-600 dark:text-gray-300'>
                  +{totalImpact} points potential
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Improvements List */}
      <div className='space-y-4'>
        <h3 className='text-xl font-bold text-slate-900 dark:text-white'>
          All Improvements
        </h3>
        {improvements.map(item => {
          const isExpanded = expandedId === item.id;
          const isCompleted = completed.has(item.id);

          return (
            <ImprovementCard
              key={item.id}
              item={item}
              isExpanded={isExpanded}
              isCompleted={isCompleted}
              priorityColors={priorityColors}
              categoryIcons={categoryIcons}
              categoryColors={categoryColors}
              categoryLabels={categoryLabels}
              onToggleComplete={() => toggleComplete(item.id)}
              onToggleExpand={() => toggleExpand(item.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

// Separate component for individual improvement card
interface ImprovementCardProps {
  item: ImprovementItem;
  isExpanded: boolean;
  isCompleted: boolean;
  priorityColors: Record<string, string>;
  categoryIcons: Record<string, string>;
  categoryColors: Record<string, string>;
  categoryLabels: Record<string, string>;
  onToggleComplete: () => void;
  onToggleExpand: () => void;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({
  item,
  isExpanded,
  isCompleted,
  priorityColors,
  categoryIcons,
  categoryColors,
  categoryLabels,
  onToggleComplete,
  onToggleExpand,
}) => {
  const categoryColor = categoryColors[item.category] || categoryColors.other;
  const categoryLabel = categoryLabels[item.category] || 'Other';

  return (
    <div
      className={`border-2 rounded-xl overflow-hidden transition-all ${
        isCompleted
          ? 'border-green-500/50 bg-green-500/5'
          : `bg-gradient-to-br ${categoryColor} border`
      }`}
    >
      {/* Header */}
      <div
        className='p-4 cursor-pointer hover:bg-white/5 transition-colors'
        onClick={onToggleExpand}
      >
        <div className='flex items-start gap-4'>
          {/* Checkbox */}
          <button
            onClick={e => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
              isCompleted
                ? 'bg-green-500 border-green-500'
                : 'border-gray-500 hover:border-cyan-400'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && <Icons.Check className='w-4 h-4 text-white' />}
          </button>

          {/* Content */}
          <div className='flex-1 min-w-0'>
            <div className='flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3'>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1 flex-wrap'>
                  <span className='text-xl flex-shrink-0'>
                    {categoryIcons[item.category]}
                  </span>
                  <span className='text-lg font-semibold text-slate-900 dark:text-white break-words'>
                    {item.title}
                  </span>
                  <div className='flex gap-2 flex-shrink-0'>
                    <span
                      className={`text-xs px-2 py-1 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white border border-slate-300 dark:border-white/20 whitespace-nowrap`}
                    >
                      {categoryLabel}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        priorityColors[item.priority]
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
                <p className='text-slate-600 dark:text-gray-300 text-sm break-words'>
                  {item.description}
                </p>
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
          </div>

          {/* Expand Icon */}
          <button
            className='flex-shrink-0 mt-1'
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <Icons.ChevronUp className='w-5 h-5 text-cyan-600 dark:text-cyan-400' />
            ) : (
              <Icons.ChevronDown className='w-5 h-5 text-slate-500 dark:text-gray-400' />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className='border-t border-slate-200 dark:border-white/10 p-4 space-y-4 bg-slate-50 dark:bg-black/20'>
          {/* Before/After Examples */}
          {item.before && item.after && (
            <div className='grid md:grid-cols-3 gap-4'>
              <div className='bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg p-4'>
                <div className='text-sm font-semibold text-red-600 dark:text-red-400 mb-2'>
                  ❌ Before
                </div>
                <div className='text-slate-600 dark:text-gray-300 text-sm italic break-words'>
                  &quot;{item.before}&quot;
                </div>
              </div>
              <div className='bg-green-50 dark:bg-green-500/10 border border-green-300 dark:border-green-500/30 rounded-lg p-4'>
                <div className='text-sm font-semibold text-green-600 dark:text-green-400 mb-2'>
                  ✅ After
                </div>
                <div className='text-slate-600 dark:text-gray-300 text-sm italic break-words'>
                  &quot;{item.after}&quot;
                </div>
              </div>
            </div>
          )}

          {/* Action Steps */}
          <div>
            <div className='text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2'>
              📋 Action Steps:
            </div>
            <ol className='list-decimal list-inside space-y-2 text-slate-600 dark:text-gray-300 text-sm'>
              {item.action_steps?.map((step, idx) => (
                <li key={idx} className='break-words'>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Keywords (if applicable) */}
          {item.keywords && item.keywords.length > 0 && (
            <div>
              <div className='text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2'>
                🔑 Keywords to Add:
              </div>
              <div className='flex flex-wrap gap-2'>
                {item.keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className='px-3 py-1 bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/50 rounded-full text-cyan-700 dark:text-cyan-300 text-sm break-all'
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Verbs (if applicable) */}
          {item.suggested_verbs && item.suggested_verbs.length > 0 && (
            <div>
              <div className='text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2'>
                💪 Suggested Action Verbs:
              </div>
              <div className='flex flex-wrap gap-2'>
                {item.suggested_verbs.map((verb, idx) => (
                  <span
                    key={idx}
                    className='px-3 py-1 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/50 rounded-full text-blue-700 dark:text-blue-300 text-sm'
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImprovementPlan;
