import type {
  ATSCompatibility,
  Certification,
  DetailedScores,
  ExtractionDetails,
  FormatAnalysis,
  StructuredExperience,
} from './ats';

// Re-export ATS types with Resume Builder naming for compatibility
export type {
  Certification,
  Education,
  ContactInfo as PersonalInfo,
  Project,
  SkillsFound as Skills,
  WorkExperience,
} from './ats';

// Resume Builder specific interfaces (standalone, not extending ATS types)
export interface ResumeBuilderWorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
  title?: string;
  // AI-restructured content
  keyTechnologies?: string[];
  impactMetrics?: string[];
  responsibilities?: string[];
}

export interface ResumeBuilderEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  honors?: string[];
}

export interface ResumeBuilderProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
  // AI-restructured content
  keyFeatures?: string[];
  impact?: string[];
}

// Resume Builder Data Structure using ATS types
export interface ResumeData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    jobTitle?: string; // Current job title/position
  };
  summary?: string;
  experience: ResumeBuilderWorkExperience[];
  education: ResumeBuilderEducation[];
  skills: {
    technical: string[];
    business: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  projects: ResumeBuilderProject[];
  achievements?: string[];
  certifications?: Certification[];
  hobbies?: string[];
}

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
  issues?: string[];
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
  sidebar?: string;
  sidebarText?: string;
  card?: string;
  border?: string;
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
  fontSize?: string;
  fontFamily?: string;
  colorScheme?: string;
  spacing?: Record<string, unknown>;
  sections?: Array<{
    id: string;
    visible: boolean;
    order: number;
  }>;
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
