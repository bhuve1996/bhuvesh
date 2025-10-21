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
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
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

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate?: string;
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
}

// ATS Analysis Result Types
export interface AnalysisResult {
  jobType: string;
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  keywordDensity: Record<string, number>;
  wordCount: number;
  characterCount: number;
  extraction_details?: any; // From backend extraction_details
  ats_compatibility?: any; // From backend ats_compatibility
  format_analysis?: any; // From backend format_analysis
  detailed_scores?: any; // From backend detailed_scores
  semantic_similarity?: number;
  match_category?: string;
  ats_friendly?: boolean;
  formatting_issues?: string[];
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
