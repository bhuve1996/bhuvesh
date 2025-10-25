// UI Component-specific Types
// Consolidated from component-specific interfaces

import type { ReactNode } from 'react';

// Card and Item Components
export interface ItemCardProps {
  children: ReactNode;
  onRemove: () => void;
  removeLabel: string;
  removeIcon?: string;
}

// Auth Components
export interface LoginButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface LogoutButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

// Resume Builder Components
export interface ResumeBuilderProps {
  initialData?: unknown;
  onSave?: (data: unknown) => void;
  className?: string;
}

export interface ATSAnalysisProps {
  file: File;
  onAnalyze: (jobDescription: string) => void;
  error?: string | null;
  className?: string;
}

// Floating Components
export interface FloatingATSScoreProps {
  score: number;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export interface ATSAnalysisResult {
  score: number;
  issues: string[];
  suggestions: string[];
}

// AI Components

export interface AIAssistantProps {
  onSendMessage: (message: string) => void;
  messages: Array<{
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
  }>;
  isLoading?: boolean;
  className?: string;
}
