// ============================================================================
// SHARED TYPES - Comprehensive TypeScript type definitions
// ============================================================================

// Re-export all types for easy importing (avoid conflicts)
export * from './api';
export * from './ats';
export * from './common';
// Note: resume and ui types are exported separately to avoid conflicts

// ============================================================================
// COMMON TYPES
// ============================================================================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// FILE TYPES
// ============================================================================

export interface FileUpload {
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface FileValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export type SupportedFileType = 'pdf' | 'docx' | 'doc' | 'txt';
export type SupportedMimeType =
  | 'application/pdf'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/msword'
  | 'text/plain';

// ============================================================================
// ANALYSIS TYPES
// ============================================================================

export interface AnalysisProgress {
  currentStep: number;
  totalSteps: number;
  isAnalyzing: boolean;
  currentStepName: string;
  progress: number; // 0-100
  error?: string;
}

export interface AnalysisStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration?: number;
}

// ============================================================================
// JOB TYPES
// ============================================================================

export interface JobProfile {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  industry: string;
  location?: string;
  remote: boolean;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface JobDescription {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  experience: string;
  education: string;
  skills: string[];
  keywords: string[];
}

// ============================================================================
// SCORING TYPES
// ============================================================================

export interface ScoreBreakdown {
  keyword: number;
  semantic: number;
  format: number;
  content: number;
  experience: number;
  skills: number;
  education: number;
  overall: number;
}

export interface ScoreGrade {
  score: number;
  grade:
    | 'A+'
    | 'A'
    | 'A-'
    | 'B+'
    | 'B'
    | 'B-'
    | 'C+'
    | 'C'
    | 'C-'
    | 'D+'
    | 'D'
    | 'D-'
    | 'F';
  label: string;
  color: string;
  description: string;
}

// ============================================================================
// IMPROVEMENT TYPES
// ============================================================================

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

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationRule[];
  warnings: ValidationRule[];
  score: number;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'json';
  includeAnalysis: boolean;
  includeImprovements: boolean;
  includeRawData: boolean;
  template?: string;
}

export interface ExportResult {
  success: boolean;
  fileUrl?: string;
  fileName: string;
  fileSize: number;
  expiresAt: Date;
}
