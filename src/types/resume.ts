// Resume Builder Types
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  website?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  title?: string; // Add missing title property
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  period?: string; // Add missing period property
}

export interface Education {
  id: string;
  institution: string;
  school?: string; // Add missing school property
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  honors?: string[];
  period?: string; // Add missing period property
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  link?: string; // Add missing link property
  startDate: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiry?: string;
  credentialId?: string;
  url?: string;
}

export interface Skills {
  technical: string[];
  business: string[];
  soft: string[];
  languages: string[];
  certifications: string[];
}

export interface ResumeData {
  personal: PersonalInfo;
  summary?: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skills;
  projects: Project[];
  achievements?: string[];
  certifications?: Certification[];
  hobbies?: string[];
}

// Import ATS types for proper typing
import type {
  ATSCompatibility,
  DetailedScores,
  ExtractionDetails,
  FormatAnalysis,
  StructuredExperience,
} from './ats';

// ATS Analysis Result Types
export interface AnalysisResult {
  jobType: string;
  atsScore: number;
  ats_score?: number; // Backend compatibility
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  keywordDensity: Record<string, number>;
  wordCount: number;
  characterCount: number;
  extraction_details?: ExtractionDetails;
  ats_compatibility?: ATSCompatibility;
  format_analysis?: FormatAnalysis;
  detailed_scores?: DetailedScores;
  semantic_similarity?: number;
  match_category?: string;
  ats_friendly?: boolean;
  formatting_issues?: string[];
  structured_experience?: StructuredExperience;
  job_description?: string;
}

// Template Types
export interface SectionConfig {
  type:
    | 'header'
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'projects'
    | 'achievements';
  order: number;
  optional: boolean;
  title: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface FontConfig {
  heading: string;
  body: string;
  size: {
    heading: string;
    subheading: string;
    body: string;
    small: string;
  };
}

export interface SpacingConfig {
  lineHeight: number;
  sectionGap: string;
  margins: string;
  padding: string;
}

export interface LayoutConfig {
  sections: SectionConfig[];
  colors: ColorScheme;
  fonts: FontConfig;
  spacing: SpacingConfig;
  columns: 1 | 2;
  sidebar?: boolean;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | 'tech'
    | 'business'
    | 'creative'
    | 'healthcare'
    | 'education'
    | 'general';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  style: 'modern' | 'classic' | 'creative' | 'ats-optimized';
  atsScore: number;
  preview: string; // Base64 image or URL
  layout: LayoutConfig;
  sampleData?: Partial<ResumeData>;
}

// Builder State Types
export interface BuilderState {
  currentTemplate: ResumeTemplate | null;
  resumeData: ResumeData;
  isEditing: boolean;
  selectedSection: string | null;
  previewMode: 'desktop' | 'mobile' | 'print';
}

// Export Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'json';
  template: string;
  atsOptimized: boolean;
  includePhoto?: boolean;
  pageBreaks: 'auto' | 'manual';
  quality: 'draft' | 'final';
}

// Template Gallery Types
export interface TemplateFilter {
  category: string[];
  experienceLevel: string[];
  style: string[];
  atsScore: {
    min: number;
    max: number;
  };
}

export interface TemplateGalleryState {
  templates: ResumeTemplate[];
  filteredTemplates: ResumeTemplate[];
  selectedTemplate: ResumeTemplate | null;
  filters: TemplateFilter;
  searchQuery: string;
  sortBy: 'name' | 'atsScore' | 'popularity';
}
