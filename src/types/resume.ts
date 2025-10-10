// Resume and ATS Analysis Types
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
  extraction_details?: any;
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

export interface ATSCompatibility {
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface FormatAnalysis {
  has_images: boolean;
  has_tables: boolean;
  font_issues: string[];
  layout_score: number;
}

export interface DetailedScores {
  keyword_score: number;
  semantic_score: number;
  format_score: number;
  content_score: number;
  ats_score: number;
}

export interface StructuredExperience {
  companies: Company[];
  total_experience_months: number;
  current_company?: string;
}

export interface Company {
  name: string;
  position: string;
  start_date: string;
  end_date: string;
  duration_months: number;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
}

export interface ATSAnalysisBackendResponse {
  success: boolean;
  data: {
    ats_score: number;
    detected_job_type: string;
    job_detection_confidence: number;
    keyword_matches: string[];
    missing_keywords: string[];
    suggestions: string[];
    strengths: string[];
    weaknesses: string[];
    word_count: number;
    extraction_details: any;
    ats_compatibility: ATSCompatibility;
    format_analysis: FormatAnalysis;
    detailed_scores: DetailedScores;
    semantic_similarity: number;
    match_category: string;
    ats_friendly: boolean;
    formatting_issues: string[];
    structured_experience: StructuredExperience;
    job_description: string;
  };
  message: string;
}
