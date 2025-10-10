// Component-specific Types
import type { AnalysisResult } from './resume';

export interface FileUploadComponentProps {
  onFileUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onUpload?: (files: File[]) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  disabled?: boolean;
  dragAndDrop?: boolean;
  preview?: boolean;
  validation?: {
    allowedTypes?: string[];
    maxSize?: number;
    custom?: (file: File) => string | null;
  };
  className?: string;
}

// TabsProps moved to ui.ts to avoid conflicts
// export interface TabsProps {
//   tabs: Tab[];
//   activeTab: string;
//   onTabChange: (tabId: string) => void;
//   className?: string;
// }

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface NavigationProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  className?: string;
}

export interface HeroSectionProps {
  onGetStarted?: () => void;
  onViewProjects?: () => void;
  className?: string;
}

export interface ATSAnalysisProps {
  file: File;
  onAnalyze: (jobDescription: string) => void;
  error?: string | null;
  className?: string;
}

export interface ImprovementItem {
  id: string;
  category:
    | 'keyword'
    | 'format'
    | 'formatting'
    | 'content'
    | 'experience'
    | 'skills'
    | 'education'
    | 'ats'
    | 'structure'
    | 'other';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // 0-100
  score_impact?: number; // Alternative field name used by backend
  effort?: 'low' | 'medium' | 'high';
  before?: string;
  after?: string;
  action_steps?: string[];
  keywords?: string[];
  suggested_verbs?: string[];
  examples?: string[];
  resources?: string[];
  completed?: boolean;
}

export interface ImprovementPlan {
  id: string;
  currentScore: number;
  targetScore: number;
  improvements: ImprovementItem[];
  quickWins: ImprovementItem[];
  summary: {
    totalImprovements: number;
    highPriority: number;
    estimatedImpact: number;
    estimatedTime: string;
  };
  generatedAt: Date;
  expiresAt: Date;
}

export interface ImprovementPlanProps {
  improvements: ImprovementItem[];
  summary?: {
    total_improvements: number;
    high_priority: number;
    estimated_impact: number;
    estimated_time: string;
  };
  quick_wins?: ImprovementItem[];
  currentScore?: number;
  className?: string;
}

export interface ATSCheckerProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
  onError?: (error: string) => void;
  className?: string;
}
