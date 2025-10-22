import React, { ReactNode } from 'react';

import { ChevronIcon } from '../ChevronIcon';

interface CollapsibleSectionProps {
  title: string;
  icon: string;
  color: 'green' | 'purple' | 'orange' | 'blue' | 'cyan' | 'primary';
  count: number;
  countLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  color,
  count,
  countLabel,
  isExpanded,
  onToggle,
  children,
}) => {
  const colorClasses = {
    green: {
      border: 'border-l-green-500',
      bg: 'bg-green-500/10',
      text: 'text-green-500',
      countBg: 'bg-green-500/10',
    },
    purple: {
      border: 'border-l-purple-500',
      bg: 'bg-purple-500/10',
      text: 'text-purple-500',
      countBg: 'bg-purple-500/10',
    },
    orange: {
      border: 'border-l-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-500',
      countBg: 'bg-orange-500/10',
    },
    blue: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-500',
      countBg: 'bg-blue-500/10',
    },
    cyan: {
      border: 'border-l-cyan-500',
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-500',
      countBg: 'bg-cyan-500/10',
    },
    primary: {
      border: 'border-l-primary-500',
      bg: 'bg-primary-500/10',
      text: 'text-primary-500',
      countBg: 'bg-primary-500/10',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`p-6 border-l-4 ${colors.border}`}>
      <div
        className='flex items-center justify-between cursor-pointer mb-6'
        onClick={onToggle}
      >
        <div className='flex items-center space-x-3'>
          <div
            className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}
          >
            <span className='text-2xl'>{icon}</span>
          </div>
          <h3 className='text-xl font-bold text-foreground uppercase tracking-wide'>
            {title}
          </h3>
          <span
            className={`text-sm text-muted-foreground ${colors.countBg} px-2 py-1 rounded-full`}
          >
            {count} {countLabel}
          </span>
        </div>
        <ChevronIcon
          direction={isExpanded ? 'down' : 'right'}
          className={`w-6 h-6 ${colors.text}`}
        />
      </div>
      {isExpanded && <div className='space-y-4'>{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
