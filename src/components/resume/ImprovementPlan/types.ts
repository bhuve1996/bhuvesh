export interface ImprovementItem {
  id: string;
  category: 'keyword' | 'formatting' | 'content' | 'structure' | 'ats';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  before?: string;
  after?: string;
  score_impact: number;
  action_steps: string[];
  keywords?: string[];
  suggested_verbs?: string[];
}

export interface ImprovementSummary {
  total_improvements: number;
  by_priority: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  estimated_total_boost: number;
}

export interface ImprovementPlanProps {
  improvements: ImprovementItem[];
  summary: ImprovementSummary;
  quick_wins: ImprovementItem[];
  currentScore: number;
}
