// Resume and ATS Analysis Types
import type {
  ATSCompatibility,
  FormatAnalysis,
  DetailedScores,
  StructuredExperience,
  ExtractionDetails
} from './ats';

export interface ResumeDocument {
  id: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  sections: Record<string, string>;
  wordCount: number;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisResult {
  jobType: string;
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
  job_description?: string;
}

// ATSCompatibility imported from ./ats

// FormatAnalysis imported from ./ats

// DetailedScores imported from ./ats

// StructuredExperience imported from ./ats

// Company interface - keeping this one as it's different from the one in ats.ts
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

// ATSAnalysisBackendResponse imported from ./ats
