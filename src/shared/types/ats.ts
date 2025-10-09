// ============================================================================
// ATS (Applicant Tracking System) TYPES
// ============================================================================

// ============================================================================
// CONTACT INFORMATION
// ============================================================================

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
    formatted?: string;
  };
  linkedin?: {
    url: string;
    username?: string;
    profile_id?: string;
  };
  github?: {
    url: string;
    username?: string;
    profile_id?: string;
  };
  portfolio?: {
    url: string;
    platform?: string;
  };
  website?: string;
  location?: {
    full: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  social_media?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    [key: string]: string | undefined;
  };
}

// ============================================================================
// EDUCATION
// ============================================================================

export interface Education {
  id: string;
  degree_full: string;
  degree_type: string;
  degree_level:
    | 'associate'
    | 'bachelor'
    | 'master'
    | 'doctorate'
    | 'certificate'
    | 'diploma';
  major?: string;
  specialization?: string;
  minor?: string;
  gpa?: number;
  institution: {
    name: string;
    type: 'university' | 'college' | 'institute' | 'school';
    location?: string;
    ranking?: number;
    accreditation?: string[];
  };
  duration: {
    raw?: string;
    start_date?: string;
    end_date?: string;
    start_year?: number;
    end_year?: number;
    total_years?: number;
    is_current?: boolean;
  };
  grade?: {
    value: string | number;
    type: 'gpa' | 'percentage' | 'grade' | 'class';
    scale?: string;
    percentile?: number;
    honors?: string[];
  };
  achievements?: string[];
  coursework?: string[];
  thesis?: {
    title: string;
    advisor?: string;
    abstract?: string;
  };
}

// ============================================================================
// WORK EXPERIENCE
// ============================================================================

export interface WorkExperience {
  id: string;
  company: string;
  company_info?: {
    industry?: string;
    size?: string;
    location?: string;
    website?: string;
    description?: string;
  };
  positions: Position[];
  total_experience_years: number;
  current: boolean;
  start_date: string;
  end_date?: string;
  location?: string;
  employment_type:
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'internship'
    | 'freelance';
  remote: boolean;
  hybrid: boolean;
}

export interface Position {
  id: string;
  title: string;
  level?:
    | 'entry'
    | 'mid'
    | 'senior'
    | 'lead'
    | 'principal'
    | 'director'
    | 'vp'
    | 'c-level';
  department?: string;
  location: string;
  duration: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  responsibilities: string[];
  achievements: string[];
  skills_used: string[];
  technologies: string[];
  team_size?: number;
  reporting_to?: string;
  direct_reports?: number;
  budget_responsibility?: number;
  key_projects?: string[];
}

// ============================================================================
// PROJECTS
// ============================================================================

export interface Project {
  id: string;
  name: string;
  type: 'personal' | 'professional' | 'academic' | 'open-source' | 'freelance';
  description: string;
  technologies: string[];
  achievements: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  metrics?: {
    users?: number;
    revenue?: number;
    performance?: string;
    efficiency?: string;
    [key: string]: any;
  };
  duration?: {
    start_date: string;
    end_date?: string;
    total_months?: number;
  };
  team_size?: number;
  role: string;
  company?: string;
  url?: string;
  github_url?: string;
  demo_url?: string;
  images?: string[];
  status: 'completed' | 'in-progress' | 'on-hold' | 'cancelled';
}

// ============================================================================
// SKILLS
// ============================================================================

export interface SkillsFound {
  technical_programming?: string[];
  technical_tools?: string[];
  frameworks_libraries?: string[];
  databases?: string[];
  cloud_platforms?: string[];
  devops_tools?: string[];
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
  methodologies?: string[];
  operating_systems?: string[];
  version_control?: string[];
  testing_tools?: string[];
  monitoring_tools?: string[];
  security_tools?: string[];
}

export interface SkillCategory {
  name: string;
  skills: string[];
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_experience?: number;
  last_used?: string;
  relevance_score?: number;
}

// ============================================================================
// FORMATTING ANALYSIS
// ============================================================================

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
    margin_consistency: boolean;
  };
  structure?: {
    has_clear_sections: boolean;
    sections_detected?: string[];
    logical_flow: boolean;
    chronological_order: boolean;
    section_headers_consistent: boolean;
  };
  text_formatting?: {
    all_caps_excessive: boolean;
    appropriate_capitalization: boolean;
    special_characters_count: number;
    emoji_count: number;
    font_consistency: boolean;
    font_size_consistency: boolean;
  };
  length_analysis?: {
    total_words: number;
    total_lines: number;
    average_line_length: number;
    estimated_pages: number;
    appropriate_length: boolean;
    section_word_distribution: Record<string, number>;
  };
  ats_compatibility?: {
    score: number;
    issues?: string[];
    warnings?: string[];
    recommendations?: string[];
    compatibility_factors: {
      file_format: boolean;
      text_extractable: boolean;
      no_images_text: boolean;
      standard_fonts: boolean;
      proper_headers: boolean;
      no_tables: boolean;
      no_columns: boolean;
    };
  };
}

// ============================================================================
// ATS COMPATIBILITY
// ============================================================================

export interface ATSCompatibility {
  overall_score: number;
  grade: string;
  issues: string[];
  warnings: string[];
  recommendations: string[];
  sections_found: string[];
  contact_completeness: string;
  bullet_consistency: boolean;
  word_count_optimal: boolean;
  format_score: number;
  content_score: number;
  keyword_score: number;
  semantic_score: number;
  compatibility_factors: {
    file_format_compatible: boolean;
    text_extractable: boolean;
    no_graphics_text: boolean;
    standard_fonts: boolean;
    proper_headers: boolean;
    no_tables: boolean;
    no_columns: boolean;
    appropriate_length: boolean;
    keyword_optimized: boolean;
    section_complete: boolean;
  };
}

// ============================================================================
// FORMAT ANALYSIS
// ============================================================================

export interface FormatAnalysis {
  grade: string;
  score: number;
  sections_found: number;
  required_sections: number;
  optional_sections_found: number;
  contact_completeness: string;
  has_professional_summary: boolean;
  section_headers_count: number;
  issues: string[];
  recommendations: string[];
  section_analysis: {
    contact_info: { present: boolean; completeness: number; issues: string[] };
    summary: { present: boolean; quality: number; issues: string[] };
    experience: { present: boolean; completeness: number; issues: string[] };
    education: { present: boolean; completeness: number; issues: string[] };
    skills: { present: boolean; completeness: number; issues: string[] };
    projects: { present: boolean; completeness: number; issues: string[] };
    certifications: {
      present: boolean;
      completeness: number;
      issues: string[];
    };
  };
}

// ============================================================================
// DETAILED SCORES
// ============================================================================

export interface DetailedScores {
  keyword_score: number;
  semantic_score: number;
  format_score: number;
  content_score: number;
  experience_score: number;
  skills_score: number;
  education_score: number;
  ats_score: number;
  overall_score: number;
  breakdown: {
    keyword_matching: number;
    semantic_similarity: number;
    format_compatibility: number;
    content_quality: number;
    experience_relevance: number;
    skills_alignment: number;
    education_match: number;
    ats_optimization: number;
  };
}

// ============================================================================
// EXTRACTION DETAILS
// ============================================================================

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
  extraction_confidence: number;
  extraction_method: 'ai' | 'rule-based' | 'hybrid';
  processing_time: number;
  word_count: number;
  character_count: number;
  language_detected: string;
  encoding_detected: string;
}

// ============================================================================
// CATEGORIZED RESUME
// ============================================================================

export interface CategorizedResume {
  contact_info?: ContactInfo;
  education?: Education[];
  work_experience?: WorkExperience[];
  projects?: Project[];
  skills?: SkillsFound;
  hobbies_interests?: string[];
  languages?: string[];
  achievements?: string[];
  summary_profile?: string;
  certifications?: string[];
  publications?: string[];
  volunteer_work?: string[];
  formatting_analysis?: FormattingAnalysis;
  metadata: {
    extracted_at: Date;
    file_name: string;
    file_size: number;
    file_type: string;
    extraction_method: string;
    confidence_score: number;
  };
}

// ============================================================================
// STRUCTURED EXPERIENCE
// ============================================================================

export interface StructuredWorkExperience {
  company: string;
  company_info?: {
    industry?: string;
    size?: string;
    location?: string;
    website?: string;
  };
  positions: Position[];
  responsibilities: string[];
  projects: Project[];
  achievements: string[];
  skills_used: string[];
  technologies: string[];
  total_experience_years: number;
  current: boolean;
  start_date: string;
  end_date?: string;
  location?: string;
  employment_type:
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'internship'
    | 'freelance';
}

export interface StructuredContactInfo {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio?: string;
  website?: string;
}

export interface StructuredExperience {
  work_experience: StructuredWorkExperience[];
  contact_info: StructuredContactInfo;
  education: Education[];
  projects: Project[];
  skills: SkillsFound;
  summary?: string;
  metadata: {
    total_experience_years: number;
    current_company?: string;
    career_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
    industry_experience: string[];
    skill_categories: string[];
  };
}

// ============================================================================
// BACKEND API RESPONSE
// ============================================================================

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
    categorized_resume?: CategorizedResume;
    processing_time: number;
    analysis_version: string;
    generated_at: Date;
  };
}

// ============================================================================
// FRONTEND ANALYSIS RESULT
// ============================================================================

export interface AnalysisResult {
  id: string;
  jobType: string;
  jobTypeConfidence: number;
  atsScore: number;
  keywordMatches: string[];
  missingKeywords: string[];
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  keywordDensity?: Record<string, number>;
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
  categorized_resume?: CategorizedResume;
  metadata: {
    analyzed_at: Date;
    file_name: string;
    file_size: number;
    processing_time: number;
    analysis_version: string;
  };
}
