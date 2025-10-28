/**
 * API Service for Enhanced ATS Backend
 * Uses unified API client for consistent error handling and retry logic
 */

import {
  analyzeResume,
  checkApiHealth,
  detectJobRole,
  extractKeywords,
  improveResume,
  uploadFile,
} from '@/lib/api/unifiedClient';

// Re-export types for backward compatibility
export type { ApiError, ApiResponse } from '@/lib/api/unifiedClient';

export interface ATSAnalysisResult {
  ats_score: number;
  match_category: string;
  keyword_matches: string[];
  missing_keywords: string[];
  semantic_similarity: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
  formatting_issues: string[];
  ats_friendly: boolean;
  word_count: number;
  detailed_scores: {
    keyword_score: number;
    semantic_score: number;
    format_score: number;
    content_score: number;
    ats_score: number;
  };
}

export interface ATSAnalysisResponse {
  success: boolean;
  data?: ATSAnalysisResult;
  message: string;
}

export interface ParseResponse {
  success: boolean;
  data?: {
    filename: string;
    file_size: number;
    file_type: string;
    text: string;
    word_count: number;
    character_count: number;
    formatting_analysis: Record<string, unknown>;
    parsed_content: Record<string, unknown>;
  };
  message: string;
}

export interface SupportedFormatsResponse {
  supported_formats: string[];
  max_file_size: string;
}

/**
 * Check if backend is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await checkApiHealth();
    return response.success;
  } catch {
    return false;
  }
}

/**
 * Analyze resume with job description using enhanced backend
 */
export async function analyzeResumeWithJobDescription(
  file: File,
  jobDescription: string
): Promise<ATSAnalysisResponse> {
  try {
    // First upload the file
    const uploadResponse = await uploadFile(file);
    if (!uploadResponse.success || !uploadResponse.data) {
      throw new Error('Failed to upload file');
    }

    // Then analyze with job description
    const analysisResponse = await analyzeResume({
      resume_text: uploadResponse.data.extracted_text,
      job_description: jobDescription,
    });

    return {
      success: analysisResponse.success,
      data: analysisResponse.data || {
        ats_score: 0,
        match_category: 'No Match',
        keyword_matches: [],
        missing_keywords: [],
        semantic_similarity: 0,
        suggestions: [],
        strengths: [],
        weaknesses: [],
        formatting_issues: [],
        ats_friendly: false,
        word_count: 0,
        detailed_scores: {
          keyword_score: 0,
          semantic_score: 0,
          format_score: 0,
          content_score: 0,
          ats_score: 0,
        },
      },
      message: analysisResponse.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Analysis failed',
    };
  }
}

/**
 * Parse resume only (without job description)
 */
export async function parseResume(file: File): Promise<ParseResponse> {
  try {
    const response = await uploadFile(file);
    return {
      success: response.success,
      data: response.data
        ? {
            filename: response.data.filename,
            file_size: response.data.size,
            file_type: response.data.content_type,
            text: response.data.extracted_text,
            word_count: response.data.extracted_text.split(' ').length,
            character_count: response.data.extracted_text.length,
            formatting_analysis: {},
            parsed_content: {},
          }
        : {
            filename: '',
            file_size: 0,
            file_type: '',
            text: '',
            word_count: 0,
            character_count: 0,
            formatting_analysis: {},
            parsed_content: {},
          },
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to parse file',
    };
  }
}

/**
 * Upload and parse resume file - returns parsed content
 */
export async function uploadResumeFile(file: File): Promise<ParseResponse> {
  return parseResume(file);
}

/**
 * Quick analysis with AI-generated job description
 */
export async function quickAnalyzeResume(
  file: File
): Promise<ATSAnalysisResponse> {
  try {
    // First upload the file
    const uploadResponse = await uploadFile(file);
    if (!uploadResponse.success || !uploadResponse.data) {
      throw new Error('Failed to upload file');
    }

    // Detect job role from resume
    const jobRoleResponse = await detectJobRole(
      uploadResponse.data.extracted_text
    );
    if (!jobRoleResponse.success || !jobRoleResponse.data) {
      throw new Error('Failed to detect job role');
    }

    // Extract keywords from detected role
    const keywordsResponse = await extractKeywords(
      jobRoleResponse.data.detected_role
    );
    if (!keywordsResponse.success || !keywordsResponse.data) {
      throw new Error('Failed to extract keywords');
    }

    // Analyze resume with detected role as job description
    const analysisResponse = await analyzeResume({
      resume_text: uploadResponse.data.extracted_text,
      job_description: jobRoleResponse.data.detected_role,
    });

    return {
      success: analysisResponse.success,
      data: analysisResponse.data || {
        ats_score: 0,
        match_category: 'No Match',
        keyword_matches: [],
        missing_keywords: [],
        semantic_similarity: 0,
        suggestions: [],
        strengths: [],
        weaknesses: [],
        formatting_issues: [],
        ats_friendly: false,
        word_count: 0,
        detailed_scores: {
          keyword_score: 0,
          semantic_score: 0,
          format_score: 0,
          content_score: 0,
          ats_score: 0,
        },
      },
      message: analysisResponse.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Quick analysis failed',
    };
  }
}

/**
 * Get supported file formats with fallback
 */
export async function getSupportedFormats(): Promise<SupportedFormatsResponse> {
  const fallbackData: SupportedFormatsResponse = {
    supported_formats: ['.pdf', '.docx', '.doc', '.txt'],
    max_file_size: '10MB',
  };

  try {
    const response = await checkApiHealth();
    if (response.success) {
      return fallbackData; // Backend is healthy, return supported formats
    }
  } catch {
    // Backend is not available, return fallback
  }

  return fallbackData;
}

// Export all functions as atsApi object for backward compatibility
export const atsApi = {
  checkBackendHealth,
  analyzeResumeWithJobDescription,
  parseResume,
  uploadFile: uploadResumeFile,
  quickAnalyzeResume,
  getSupportedFormats,
};

// Export individual functions for direct use
export {
  analyzeResume,
  checkApiHealth,
  detectJobRole,
  extractKeywords,
  improveResume,
  uploadFile,
};
