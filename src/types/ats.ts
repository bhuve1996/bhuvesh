// ATS Analysis Types

export interface ContactInfo {
  full_name: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone?: {
    raw: string;
    country_code?: string;
    number?: string;
  };
  linkedin?: {
    url: string;
    username?: string;
  };
  github?: {
    url: string;
    username?: string;
  };
  portfolio?: string;
  location?: {
    full: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface Education {
  degree_full: string;
  degree_type: string;
  major?: string;
  specialization?: string;
  institution?: {
    name: string;
    type?: string;
    location?: string;
  };
  duration?: {
    raw?: string;
    start_year?: string;
    end_year?: string;
    total_years?: number;
  };
  grade?: {
    value: string;
    type?: string;
    scale?: string;
    percentile?: number;
  };
}

export interface ProjectDetail {
  name: string;
  type?: string;
  description?: string;
  technologies?: string[];
  achievements?: string[];
}

export interface WorkExperience {
  company: string;
  location: string;
  role: string;
  duration: string;
  duration_formatted?: string;
  start_date?: string;
  end_date?: string;
  total_months?: number;
  projects?: ProjectDetail[];
}

export interface SkillsFound {
  technical_programming?: string[];
  technical_tools?: string[];
  business_management?: string[];
  financial_accounting?: string[];
  creative_design?: string[];
  media_content?: string[];
  medical_clinical?: string[];
  healthcare_admin?: string[];
  teaching_training?: string[];
  academic_research?: string[];
  sales_marketing?: string[];
  customer_service?: string[];
  manufacturing_operations?: string[];
  quality_control?: string[];
  hospitality_food?: string[];
  travel_tourism?: string[];
  legal_regulatory?: string[];
  hr_recruitment?: string[];
  fashion_styling?: string[];
  beauty_cosmetology?: string[];
  construction_civil?: string[];
  mechanical_electrical?: string[];
  soft_skills?: string[];
  languages_spoken?: string[];
  tools_software?: string[];
  certifications?: string[];
}

export interface FormattingAnalysis {
  bullet_points?: {
    detected: boolean;
    count: number;
    types_used?: string[];
    consistent: boolean;
    recommendation?: string;
  };
  spacing?: {
    line_spacing_consistent: boolean;
    excessive_whitespace: boolean;
    proper_section_breaks: boolean;
  };
  structure?: {
    has_clear_sections: boolean;
    sections_detected?: string[];
    logical_flow: boolean;
    chronological_order: boolean;
  };
  text_formatting?: {
    all_caps_excessive: boolean;
    appropriate_capitalization: boolean;
    special_characters_count: number;
    emoji_count: number;
  };
  length_analysis?: {
    total_words: number;
    total_lines: number;
    average_line_length: number;
    estimated_pages: number;
    appropriate_length: boolean;
  };
  ats_compatibility?: {
    score: number;
    issues?: string[];
    warnings?: string[];
    recommendations?: string[];
  };
}

export interface CategorizedResume {
  contact_info?: ContactInfo;
  education?: Education[];
  work_experience?: WorkExperience[];
  skills?: SkillsFound;
  hobbies_interests?: string[];
  languages?: string[];
  achievements?: string[];
  summary_profile?: string;
  formatting_analysis?: FormattingAnalysis;
}

export interface ExtractionDetails {
  all_resume_keywords?: string[];
  all_jd_keywords?: string[];
  all_matched_keywords?: string[];
  all_missing_keywords?: string[];
  skills_found?: SkillsFound;
  skills_required?: SkillsFound;
  resume_text_sample?: string;
  full_resume_text?: string;
  total_resume_keywords?: number;
  total_jd_keywords?: number;
  total_matched_keywords?: number;
  total_missing_keywords?: number;
  categorized_resume?: CategorizedResume;
}

export interface ATSCompatibility {
  grade: string;
  issues: string[];
  warnings: string[];
  recommendations: string[];
  sections_found: string[];
  contact_completeness: string;
  bullet_consistency: boolean;
  word_count_optimal: boolean;
}

export interface FormatAnalysis {
  grade: string;
  sections_found: number;
  optional_sections_found: number;
  contact_completeness: string;
  has_professional_summary: boolean;
  section_headers_count: number;
  issues: string[];
  recommendations: string[];
}

export interface DetailedScores {
  keyword_score: number;
  semantic_score: number;
  format_score: number;
  content_score: number;
  ats_score: number;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Position {
  title: string;
  location: string;
  duration: string;
  start_date: string;
  end_date: string;
}

export interface StructuredWorkExperience {
  company: string;
  positions: Position[];
  responsibilities: string[];
  projects: Project[];
  achievements: string[];
  skills_used: string[];
  total_experience_years: number;
  current: boolean;
}

export interface StructuredContactInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

export interface StructuredExperience {
  work_experience: StructuredWorkExperience[];
  contact_info: StructuredContactInfo;
}

export interface ATSAnalysisBackendResponse {
  success: boolean;
  message?: string;
  data: {
    ats_score: number;
    match_category: string;
    detected_job_type?: string;
    job_detection_confidence?: number;
    keyword_matches?: string[];
    missing_keywords?: string[];
    semantic_similarity?: number;
    suggestions?: string[];
    strengths?: string[];
    weaknesses?: string[];
    formatting_issues?: string[];
    ats_friendly?: boolean;
    word_count?: number;
    detailed_scores?: DetailedScores;
    ats_compatibility?: ATSCompatibility;
    format_analysis?: FormatAnalysis;
    structured_experience?: StructuredExperience;
    extraction_details?: ExtractionDetails;
  };
}

export interface AnalysisResult {
  jobType: string;
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  keywordDensity?: Record<string, number> | undefined;
  wordCount: number;
  characterCount: number;
  extraction_details?: ExtractionDetails | undefined;
  // Enhanced analysis data
  ats_compatibility?: ATSCompatibility | undefined;
  format_analysis?: FormatAnalysis | undefined;
  detailed_scores?: DetailedScores | undefined;
  semantic_similarity?: number | undefined;
  match_category?: string | undefined;
  ats_friendly?: boolean | undefined;
  formatting_issues?: string[] | undefined;
  structured_experience?: StructuredExperience | undefined;
  job_description?: string | undefined;  // AI-generated job description
}
