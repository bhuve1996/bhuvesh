// Component-specific Types
export interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  className?: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface NavigationProps {
  className?: string;
}

export interface HeroSectionProps {
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
    | 'content'
    | 'experience'
    | 'skills'
    | 'education';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: number; // 0-100
  effort: 'low' | 'medium' | 'high';
  examples?: string[];
  resources?: string[];
  completed: boolean;
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
  summary?: string;
  quick_wins?: string[];
  className?: string;
}

export interface ATSCheckerProps {
  className?: string;
}
