// Common Types and Utilities
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// SelectOption interface moved to types/forms.ts to eliminate duplication

// FormField interface moved to types/forms.ts to eliminate duplication

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: Status;
  error: string | null;
}

// File Types
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

// Analysis Types
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

// Job Types (General job posting profile, different from ATS JobProfile)
export interface GeneralJobProfile {
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

// Scoring Types
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

// Validation Types
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

// Export Types
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
