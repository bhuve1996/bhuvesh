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

// ============================================================================
// DATA CLEANING UTILITIES
// ============================================================================
// These utilities ensure consistent data cleaning across the application

export class ResumeDataUtils {
  // Clean name extraction (remove prefixes like "Hi, Hello, I'm")
  static cleanName(name: string): string {
    if (!name) return '';

    const cleaned = name
      .replace(/^(hi,?\s*|hello,?\s*|i'?m\s*|i am\s*)/i, '') // Remove prefixes
      .replace(/[.!?]+$/, '') // Remove trailing punctuation
      .trim();

    return cleaned || name; // Fallback to original if cleaning results in empty string
  }

  // Clean portfolio URL (filter out invalid URLs like "gmail.com")
  static cleanPortfolio(portfolio: string): string {
    if (!portfolio) return '';

    const invalidPatterns = [
      /^gmail\.com$/i,
      /^@/i, // Email addresses starting with @
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, // Email addresses
      /^www\.$/i,
      /^http:\/\/$/i,
      /^https:\/\/$/i,
    ];

    if (invalidPatterns.some(pattern => pattern.test(portfolio))) {
      return '';
    }

    return portfolio;
  }

  // Capitalize first letter of skills
  static capitalizeSkills(skills: string[]): string[] {
    return skills.map(skill => {
      if (!skill) return '';
      return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
    });
  }

  // Capitalize first letter of a single skill
  static capitalizeSkill(skill: string): string {
    if (!skill) return '';
    return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase();
  }

  // Clean and capitalize all skills in a skills object
  static cleanSkills(skills: {
    technical: string[];
    business: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  }): {
    technical: string[];
    business: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  } {
    return {
      technical: this.capitalizeSkills(skills.technical || []),
      business: this.capitalizeSkills(skills.business || []),
      soft: this.capitalizeSkills(skills.soft || []),
      languages: this.capitalizeSkills(skills.languages || []),
      certifications: this.capitalizeSkills(skills.certifications || []),
    };
  }

  // Extract current job title from work experience
  static getCurrentJobTitle(experience: ResumeBuilderWorkExperience[]): string {
    if (!experience || experience.length === 0) return '';

    // Find current job first
    const currentJob = experience.find(exp => exp.current === true);
    if (currentJob) {
      return currentJob.position || '';
    }

    // Fallback to most recent job
    const mostRecentJob = experience[0];
    return mostRecentJob?.position || '';
  }

  // Clean phone number
  static cleanPhone(phone: string): string {
    if (!phone) return '';
    // Remove all non-digit characters except + at the beginning
    return phone.replace(/[^\d+]/g, '').trim();
  }

  // Clean email
  static cleanEmail(email: string): string {
    if (!email) return '';
    return email.toLowerCase().trim();
  }

  // Clean location
  static cleanLocation(location: string): string {
    if (!location) return '';
    return location.trim();
  }

  // Clean LinkedIn URL
  static cleanLinkedIn(linkedin: string): string {
    if (!linkedin) return '';
    // Ensure it's a proper LinkedIn URL
    if (
      linkedin.startsWith('linkedin.com') ||
      linkedin.startsWith('www.linkedin.com')
    ) {
      return `https://${linkedin}`;
    }
    return linkedin;
  }

  // Clean GitHub URL
  static cleanGitHub(github: string): string {
    if (!github) return '';
    // Ensure it's a proper GitHub URL
    if (
      github.startsWith('github.com') ||
      github.startsWith('www.github.com')
    ) {
      return `https://${github}`;
    }
    return github;
  }

  // Clean project URL
  static cleanProjectUrl(url: string): string {
    if (!url) return '';
    // Ensure it has a protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  }

  // Clean and validate entire personal info object
  static cleanPersonalInfo(
    personal: Partial<ResumeData['personal']>
  ): ResumeData['personal'] {
    return {
      fullName: this.cleanName(personal.fullName || ''),
      email: this.cleanEmail(personal.email || ''),
      phone: this.cleanPhone(personal.phone || ''),
      location: this.cleanLocation(personal.location || ''),
      linkedin: this.cleanLinkedIn(personal.linkedin || ''),
      github: this.cleanGitHub(personal.github || ''),
      portfolio: this.cleanPortfolio(personal.portfolio || ''),
      jobTitle: personal.jobTitle || '',
    };
  }

  // Clean work experience
  static cleanWorkExperience(
    experience: Partial<ResumeBuilderWorkExperience>
  ): ResumeBuilderWorkExperience {
    return {
      id: experience.id || this.generateId('exp'),
      company: experience.company || '',
      position: experience.position || '',
      location: this.cleanLocation(experience.location || ''),
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      current: experience.current || false,
      description: experience.description || '',
      achievements: experience.achievements || [],
      keyTechnologies: experience.keyTechnologies || [],
      title: experience.title || '',
      impactMetrics: experience.impactMetrics || [],
      responsibilities: experience.responsibilities || [],
    };
  }

  // Clean education
  static cleanEducation(
    education: Partial<ResumeBuilderEducation>
  ): ResumeBuilderEducation {
    return {
      id: education.id || this.generateId('edu'),
      institution: education.institution || '',
      degree: education.degree || '',
      field: education.field || '',
      location: this.cleanLocation(education.location || ''),
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      current: education.current || false,
      gpa: education.gpa || '',
      honors: education.honors || [],
    };
  }

  // Clean project
  static cleanProject(
    project: Partial<ResumeBuilderProject>
  ): ResumeBuilderProject {
    return {
      id: project.id || this.generateId('proj'),
      name: project.name || '',
      description: project.description || '',
      technologies: project.technologies || [],
      url: this.cleanProjectUrl(project.url || ''),
      github: this.cleanGitHub(project.github || ''),
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      keyFeatures: project.keyFeatures || [],
      impact: project.impact || [],
    };
  }

  // Clean entire ResumeData object
  static cleanResumeData(data: Partial<ResumeData>): ResumeData {
    return {
      personal: this.cleanPersonalInfo(data.personal || {}),
      summary: data.summary || '',
      experience: (data.experience || []).map(exp =>
        this.cleanWorkExperience(exp)
      ),
      education: (data.education || []).map(edu => this.cleanEducation(edu)),
      skills: this.cleanSkills(
        data.skills || {
          technical: [],
          business: [],
          soft: [],
          languages: [],
          certifications: [],
        }
      ),
      projects: (data.projects || []).map(proj => this.cleanProject(proj)),
      achievements: data.achievements || [],
      certifications: data.certifications || [],
      hobbies: data.hobbies || [],
    };
  }

  // Generate unique ID
  static generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create empty resume data
  static createEmptyResumeData(): ResumeData {
    return {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        jobTitle: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: {
        technical: [],
        business: [],
        soft: [],
        languages: [],
        certifications: [],
      },
      projects: [],
      achievements: [],
      hobbies: [],
    };
  }

  // Validate resume data
  static validateResumeData(data: Partial<ResumeData>): boolean {
    if (!data.personal?.fullName) return false;
    if (!data.personal?.email) return false;
    return true;
  }

  // Get resume statistics
  static getResumeStats(data: ResumeData): {
    wordCount: number;
    experienceCount: number;
    educationCount: number;
    projectCount: number;
    skillCount: number;
  } {
    const wordCount =
      (data.summary || '').split(' ').length +
      data.experience.reduce(
        (acc, exp) => acc + exp.description.split(' ').length,
        0
      ) +
      data.projects.reduce(
        (acc, proj) => acc + proj.description.split(' ').length,
        0
      );

    return {
      wordCount,
      experienceCount: data.experience.length,
      educationCount: data.education.length,
      projectCount: data.projects.length,
      skillCount: Object.values(data.skills).flat().length,
    };
  }
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
