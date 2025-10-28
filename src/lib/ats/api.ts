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
  job_description: string;
  structured_experience: unknown;
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
  _jobDescription: string, // Prefixed with underscore to indicate unused parameter
  onProgress?: (step: string, progress: number) => void
): Promise<ATSAnalysisResponse> {
  try {
    // Step 1: Uploading
    onProgress?.('Uploading', 25);

    // Small delay to show uploading step
    await new Promise(resolve => setTimeout(resolve, 200));

    // Use the backend /quick-analyze endpoint directly
    const formData = new FormData();
    formData.append('file', file);

    // Step 2: Parsing - call this before the actual request
    onProgress?.('Parsing', 50);

    // Make the actual request - this is where the real work happens
    const response = await fetch(
      'http://localhost:8000/api/upload/quick-analyze',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Step 3: Analyzing - call this after we get the response but before parsing
    onProgress?.('Analyzing', 75);

    // Small delay to show analyzing step
    await new Promise(resolve => setTimeout(resolve, 300));

    // Parse the response
    const result = await response.json();

    // Step 4: Results - call this after we have the parsed result
    onProgress?.('Results', 100);

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          ats_score: result.data.ats_score || 0,
          match_category: result.data.match_category || 'Unknown',
          keyword_matches: result.data.keyword_matches || [],
          missing_keywords: result.data.missing_keywords || [],
          semantic_similarity: result.data.semantic_similarity || 0,
          suggestions: result.data.suggestions || [],
          strengths: result.data.strengths || [],
          weaknesses: result.data.weaknesses || [],
          formatting_issues: result.data.formatting_issues || [],
          ats_friendly: result.data.ats_friendly || false,
          word_count: result.data.word_count || 0,
          job_description: result.data.job_description || '', // Add AI-generated job description
          structured_experience: result.data.structured_experience || {
            work_experience: [],
            contact_info: {
              full_name: '',
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              github: '',
            },
          },
          detailed_scores: result.data.detailed_scores || {
            keyword_score: 0,
            semantic_score: 0,
            format_score: 0,
            content_score: 0,
            ats_score: 0,
          },
        },
        message: result.message || 'Analysis completed successfully',
      };
    } else {
      throw new Error(result.message || 'Analysis failed');
    }
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
            word_count: (response.data.extracted_text || '').split(' ').length,
            character_count: (response.data.extracted_text || '').length,
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
