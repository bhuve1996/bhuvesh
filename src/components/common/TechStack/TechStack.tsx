import React from 'react';

import { AnimatedSection } from '@/components/common/AnimatedSection';
import { cn, getAnimationDelay } from '@/lib/utils';

interface TechStackProps {
  technologies: string[];
  className?: string;
  columns?: 2 | 3 | 4 | 5;
  showIcons?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const TechStack: React.FC<TechStackProps> = ({
  technologies,
  className = '',
  columns = 3,
  showIcons = false,
  variant = 'default',
}) => {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  };

  const variantClasses = {
    default:
      'bg-primary-500/5 border border-primary-500/20 text-primary-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-500/10 hover:border-primary-500/40 transition-all duration-300 cursor-pointer transform hover:scale-105',
    compact:
      'bg-primary-500/10 border border-primary-500/20 text-primary-400 px-2 py-1 rounded text-xs font-medium',
    detailed:
      'bg-primary-500/5 border border-primary-500/20 text-primary-400 px-4 py-3 rounded-lg text-sm font-medium hover:bg-primary-500/10 hover:border-primary-500/40 transition-all duration-300 cursor-pointer',
  };

  return (
    <div className={cn('grid gap-3', columnClasses[columns], className)}>
      {technologies.map((tech, index) => (
        <AnimatedSection
          key={tech}
          animation='scaleIn'
          delay={index * 50}
          className='transform'
        >
          <div
            className={cn(
              'text-center transition-all duration-300',
              variantClasses[variant]
            )}
            style={{
              animationDelay: getAnimationDelay(index, 50),
            }}
          >
            {showIcons && <span className='mr-2'>{getTechIcon(tech)}</span>}
            <span className='group-hover:text-primary-300 transition-colors duration-300'>
              {tech}
            </span>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

// Helper function to get tech icons
function getTechIcon(tech: string): string {
  const iconMap: Record<string, string> = {
    React: '⚛️',
    'Next.js': '▲',
    TypeScript: '🔷',
    JavaScript: '🟨',
    'Node.js': '🟢',
    Python: '🐍',
    AWS: '☁️',
    Docker: '🐳',
    Kubernetes: '⚙️',
    Git: '📝',
    HTML5: '🌐',
    CSS3: '🎨',
    'Tailwind CSS': '💨',
    MongoDB: '🍃',
    PostgreSQL: '🐘',
    Redis: '🔴',
    GraphQL: '🔷',
    'REST APIs': '🔗',
    Firebase: '🔥',
    Supabase: '⚡',
  };

  return iconMap[tech] || '💻';
}

export default TechStack;
